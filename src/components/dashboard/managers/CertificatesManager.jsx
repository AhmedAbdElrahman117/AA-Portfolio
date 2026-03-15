import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import { UploadService } from '../../../lib/uploadService';
import DraggableList from '../DraggableList';

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [orderChanged, setOrderChanged] = useState(false);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        const { db } = await initFirebase();
        if (!db) return;

        try {
            const docRef = doc(db, "portfolio", "certificates");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fsData = docSnap.data().data || docSnap.data();
                if (Array.isArray(fsData)) {
                    setCertificates(fsData);
                } else if (fsData.certificates) {
                    setCertificates(fsData.certificates);
                } else {
                    setCertificates([]);
                }
            }
        } catch (error) {
            console.error("Error loading certificates:", error);
            Swal.fire({
                icon: 'error', title: 'Load Failed', text: error.message,
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3'
            });
        } finally {
            setLoading(false);
        }
    };

    const saveToFirebase = async (updatedCertificates) => {
        const { db } = await initFirebase();
        try {
            const docRef = doc(db, "portfolio", "certificates");
            await setDoc(docRef, { data: updatedCertificates }, { merge: true });
        } catch (error) {
            console.error("Error saving certificates:", error);
            Swal.fire({
                icon: 'error', title: 'Save Failed', text: error.message,
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3'
            });
        }
    };

    const handleReorder = (newItems) => {
        setCertificates(newItems);
        setOrderChanged(true);
    };

    const saveOrder = async () => {
        setSaving(true);
        await saveToFirebase(certificates);
        setOrderChanged(false);
        setSaving(false);
        Swal.fire({ icon: 'success', title: 'Order Saved', text: 'Certificate order updated.', background: '#1a1a1a', color: '#fff', timer: 1000 });
    };

    const deleteCertificate = (index) => {
        Swal.fire({
            title: 'Delete Certificate?',
            text: "This cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#2196F3',
            background: '#1a1a1a',
            color: '#fff',
            customClass: {
                popup: 'rounded-2xl border border-white/10 shadow-2xl bg-black/90 backdrop-blur-xl',
                confirmButton: 'rounded-lg px-6',
                cancelButton: 'rounded-lg px-6 bg-[#333333]'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updated = [...certificates];
                updated.splice(index, 1);
                setCertificates(updated);
                await saveToFirebase(updated);
                Swal.fire({ icon: 'success', title: 'Deleted', text: 'Certificate removed successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    const openCertModal = (index = -1) => {
        const isEdit = index >= 0;
        const cert = isEdit ? certificates[index] : {
            title: '', image: '', url: ''
        };

        Swal.fire({
            title: isEdit ? 'Edit Certificate' : 'Add Certificate',
            html: `
                <div class="flex flex-col gap-5 text-left mt-4">
                    <div>
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Title</label>
                        <input id="swal-title" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${cert.title || ''}" placeholder="e.g. Flutter Certification">
                    </div>
                    <div>
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Image File</label>
                        <input id="swal-image" readonly class="cursor-pointer w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${cert.image || ''}" placeholder="Click to select image...">
                    </div>
                    <div>
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Verification URL <span class="text-[10px] normal-case opacity-50 ml-1">(Optional)</span></label>
                        <input id="swal-url" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${cert.url || ''}" placeholder="https://coursera.org/verify/...">
                    </div>
                </div>
            `,
            background: '#1a1a1a',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: '#2196F3',
            cancelButtonColor: '#333333',
            customClass: {
                popup: 'rounded-2xl border border-white/10 shadow-2xl bg-black/90 backdrop-blur-xl',
                htmlContainer: 'overflow-visible text-left',
                confirmButton: 'rounded-lg px-6',
                cancelButton: 'rounded-lg px-6'
            },
            didOpen: () => {
                const imgInput = document.getElementById('swal-image');
                if (imgInput) {
                    imgInput.addEventListener('click', async () => {
                        const file = await UploadService.openFilePicker('cert_image', 'image/*');
                        if (file) {
                            imgInput.value = file.name;
                            imgInput.style.color = '#2196F3';
                        }
                    });
                }
            },
            preConfirm: async () => {
                let finalImage = document.getElementById('swal-image').value;
                const pendingFile = UploadService.getPendingFile('cert_image');

                if (pendingFile) {
                    Swal.showLoading();
                    try {
                        finalImage = await UploadService.uploadPendingFile('cert_image', 'portfolio');
                    } catch (e) {
                        Swal.showValidationMessage(`Upload failed: ${e.message}`);
                        return false;
                    }
                }

                return {
                    title: document.getElementById('swal-title').value,
                    image: finalImage,
                    url: document.getElementById('swal-url').value,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updated = [...certificates];
                const updatedCert = {
                    ...cert,
                    ...result.value,
                    id: isEdit ? cert.id : Date.now().toString()
                };

                if (isEdit) {
                    updated[index] = updatedCert;
                } else {
                    updated.unshift(updatedCert);
                }
                setCertificates(updated);
                await saveToFirebase(updated);
                Swal.fire({ icon: 'success', title: 'Saved', text: 'Certificate saved successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    if (loading) return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Manage Certificates</h3>
                <div className="flex gap-3">
                    {orderChanged && (
                        <button onClick={saveOrder} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
                            <i className={saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'}></i> {saving ? 'Saving...' : 'Save Order'}
                        </button>
                    )}
                    <button onClick={() => openCertModal(-1)} className="bg-gradient-to-r from-brand-light to-brand-dark hover:brightness-110 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-[0_4px_15px_rgba(33,150,243,0.3)] text-sm flex items-center gap-2">
                        <i className="fas fa-plus"></i> Add Certificate
                    </button>
                </div>
            </div>

            <DraggableList
                items={certificates}
                onReorder={handleReorder}
                getItemId={(item, i) => item.id ?? i}
                renderItem={(cert, idx) => (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-brand-light/50 transition-all duration-300">
                        <div className="w-[80px] h-[60px] shrink-0 bg-black/40 rounded overflow-hidden">
                            {cert.image ? (
                                <img src={cert.image.startsWith('http') ? cert.image : `/${cert.image}`} alt={cert.title || 'Certificate'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                    <i className="fas fa-certificate text-2xl"></i>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{cert.title || 'Untitled Certificate'}</h4>
                            {cert.url && (
                                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-light hover:underline mt-1 truncate block">
                                    <i className="fas fa-link mr-1"></i> {cert.url}
                                </a>
                            )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => openCertModal(idx)} className="py-2 px-3 text-xs font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-light">
                                <i className="fas fa-edit"></i> Edit
                            </button>
                            <button onClick={() => deleteCertificate(idx)} className="py-2 px-3 text-xs font-medium bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                )}
            />

            {certificates.length === 0 && (
                <div className="py-8 text-center text-text-muted italic bg-white/5 border border-dashed border-white/10 rounded-lg">
                    <p className="text-sm">No certificates added yet.</p>
                </div>
            )}
        </div>
    );
}
