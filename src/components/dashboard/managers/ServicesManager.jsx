import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';

export default function ServicesManager() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        const { db } = initFirebase();
        if (!db) return;

        try {
            const docRef = doc(db, "portfolio", "services");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fsData = docSnap.data().data || docSnap.data();
                if (Array.isArray(fsData)) {
                    setServices(fsData);
                } else if (fsData.services) {
                    setServices(fsData.services);
                } else {
                    setServices([]);
                }
            }
        } catch (error) {
            console.error("Error loading services:", error);
            Swal.fire({
                icon: 'error', title: 'Load Failed', text: error.message,
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3'
            });
        } finally {
            setLoading(false);
        }
    };

    const saveToFirebase = async (updatedServices) => {
        const { db } = initFirebase();
        try {
            const docRef = doc(db, "portfolio", "services");
            await setDoc(docRef, { data: updatedServices }, { merge: true });
        } catch (error) {
            console.error("Error saving services:", error);
            Swal.fire({
                icon: 'error', title: 'Save Failed', text: error.message,
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3'
            });
        }
    };

    const deleteService = (index) => {
        Swal.fire({
            title: 'Delete Service?',
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
                const updated = [...services];
                updated.splice(index, 1);
                setServices(updated);
                await saveToFirebase(updated);
                Swal.fire({ icon: 'success', title: 'Deleted', text: 'Service removed successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    const openServiceModal = (index = -1) => {
        const isEdit = index >= 0;
        const svc = isEdit ? services[index] : {
            title: '', description: '', icon: 'fas fa-star'
        };

        Swal.fire({
            title: isEdit ? 'Edit Service' : 'Add Service',
            html: `
                <div class="flex flex-col gap-5 text-left mt-4">
                    <div>
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Service Title</label>
                        <input id="swal-title" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${svc.title || ''}" placeholder="e.g. Mobile App Development">
                    </div>
                    <div>
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Font Awesome Icon Class</label>
                        <input id="swal-icon" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${svc.icon || 'fas fa-star'}" placeholder="fas fa-mobile-alt">
                    </div>
                    <div>
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Description</label>
                        <textarea id="swal-desc" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all min-h-[120px]">${svc.description || ''}</textarea>
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
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value,
                    icon: document.getElementById('swal-icon').value,
                    description: document.getElementById('swal-desc').value,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updated = [...services];
                const updatedSvc = {
                    ...svc,
                    ...result.value,
                    id: isEdit ? svc.id : Date.now()
                };

                if (isEdit) {
                    updated[index] = updatedSvc;
                } else {
                    updated.unshift(updatedSvc);
                }
                setServices(updated);
                await saveToFirebase(updated);
                Swal.fire({ icon: 'success', title: 'Saved', text: 'Service saved successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    if (loading) return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Manage Services</h3>
                <div className="flex gap-3">
                    <button onClick={() => openServiceModal(-1)} className="bg-gradient-to-r from-brand-light to-brand-dark hover:brightness-110 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-[0_4px_15px_rgba(33,150,243,0.3)] text-sm flex items-center gap-2">
                        <i className="fas fa-plus"></i> Add Service
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-2 auto-rows-max" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {services.map((svc, idx) => (
                    <div key={svc.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:-translate-y-[5px] hover:border-brand-light transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] items-center">
                        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-brand-light to-brand-dark flex flex-col items-center justify-center shrink-0 shadow-lg border border-white/10">
                            <i className={`${svc.icon || 'fas fa-cog'} text-2xl text-white`}></i>
                        </div>
                        <div className="text-center flex-1 w-full justify-start flex flex-col">
                            <h4 className="text-[14px] font-semibold text-white mb-1.5">{svc.title || 'Untitled Service'}</h4>
                            <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3">{svc.description}</p>
                        </div>
                        <div className="flex gap-2 w-full mt-auto shrink-0">
                            <button onClick={() => openServiceModal(idx)} className="flex-1 py-2 px-3 text-[12px] font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-light">
                                <i className="fas fa-edit"></i> Edit
                            </button>
                            <button onClick={() => deleteService(idx)} className="flex-1 py-2 px-3 text-[12px] font-medium bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full py-8 text-center text-text-muted italic bg-white/5 border border-dashed border-white/10 rounded-lg">
                        <p className="text-sm">No services added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
