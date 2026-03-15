import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import { UploadService } from '../../../lib/uploadService';

export default function HomeManager() {
    const [activeTab, setActiveTab] = useState('typewriter');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [typewriterTexts, setTypewriterTexts] = useState([]);
    const [social, setSocial] = useState({ linkedin: '', github: '', facebook: '', email: '' });
    const [cv, setCv] = useState({ path: '', filename: '' });

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        const { db } = await initFirebase();
        if (!db) return;

        try {
            // Load About (for typewriter)
            const aboutSnap = await getDoc(doc(db, "portfolio", "about"));
            if (aboutSnap.exists()) {
                const data = aboutSnap.data().data || aboutSnap.data();
                if (data.typewriterTexts && Array.isArray(data.typewriterTexts)) {
                    setTypewriterTexts(data.typewriterTexts);
                } else if (typeof data.typewriterTexts === 'string') {
                    setTypewriterTexts(data.typewriterTexts.split('\n').filter(t => t.trim()));
                }
            }

            // Load Social
            const socialSnap = await getDoc(doc(db, "portfolio", "social"));
            if (socialSnap.exists()) {
                const data = socialSnap.data().data || socialSnap.data();
                setSocial({
                    linkedin: data.linkedin || '',
                    github: data.github || '',
                    facebook: data.facebook || '',
                    email: data.email || ''
                });
            }

            // Load CV
            const cvSnap = await getDoc(doc(db, "portfolio", "cv"));
            if (cvSnap.exists()) {
                const data = cvSnap.data().data || cvSnap.data();
                setCv({
                    path: data.path || '',
                    filename: data.filename || ''
                });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Load Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTypewriter = async () => {
        setSaving(true);
        const { db } = await initFirebase();
        try {
            await setDoc(doc(db, "portfolio", "about"), { data: { typewriterTexts } }, { merge: true });
            Swal.fire({ icon: 'success', title: 'Saved!', text: 'Typewriter texts updated.', background: '#1a1a1a', color: '#fff', timer: 1500 });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSocial = async () => {
        setSaving(true);
        const { db } = await initFirebase();
        try {
            await setDoc(doc(db, "portfolio", "social"), { data: social }, { merge: true });
            Swal.fire({ icon: 'success', title: 'Saved!', text: 'Social links updated.', background: '#1a1a1a', color: '#fff', timer: 1500 });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setSaving(false);
        }
    };

    const handleCvFileClick = async () => {
        const file = await UploadService.openFilePicker('cv_upload', '.pdf,application/pdf');
        if (file) {
            setCv({ ...cv, path: file.name });
        }
    };

    const handleSaveCv = async () => {
        setSaving(true);
        const { db } = await initFirebase();
        try {
            let finalPath = cv.path;
            const pendingFile = UploadService.getPendingFile('cv_upload');
            if (pendingFile) {
                Swal.fire({
                    title: 'Uploading...',
                    text: 'Uploading CV to Cloudinary...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                    background: '#1a1a1a', color: '#fff'
                });
                finalPath = await UploadService.uploadPendingFile('cv_upload', 'portfolio');
                setCv(prev => ({ ...prev, path: finalPath }));
            }

            await setDoc(doc(db, "portfolio", "cv"), { data: { ...cv, path: finalPath } }, { merge: true });
            Swal.fire({ icon: 'success', title: 'Saved!', text: 'CV settings updated.', background: '#1a1a1a', color: '#fff', timer: 1500 });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setSaving(false);
        }
    };

    const updateTypewriter = (index, value) => {
        const updated = [...typewriterTexts];
        updated[index] = value;
        setTypewriterTexts(updated);
    };

    const addTypewriter = () => setTypewriterTexts([...typewriterTexts, '']);

    const removeTypewriter = (index) => {
        const updated = [...typewriterTexts];
        updated.splice(index, 1);
        setTypewriterTexts(updated);
    };

    const testCvDownload = () => {
        if (!cv.path) {
            Swal.fire({ icon: 'error', title: 'Missing Path', text: 'Please enter a CV path first.', background: '#1a1a1a', color: '#fff' });
            return;
        }
        const link = document.createElement('a');
        link.href = cv.path.startsWith('http') ? cv.path : `/${cv.path}`;
        link.download = cv.filename || 'CV.pdf';
        link.click();
        Swal.fire({ icon: 'success', title: 'Download Triggered', text: 'Your file download started.', backdrop: false, timer: 1500, background: '#1a1a1a', color: '#fff', showConfirmButton: false });
    };

    if (loading) return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Edit Home Section</h3>
                {/* Save button handled per-tab in original design but we can keep a global feeling if we want, or just leave it to the tabs as it is. */}
            </div>

            {/* Tabs */}
            <div className="flex gap-2.5 mb-6 bg-white/5 p-2.5 rounded-xl border border-white/10 flex-wrap sm:flex-nowrap">
                <button onClick={() => setActiveTab('typewriter')} className={`flex-1 min-w-[120px] py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'typewriter' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    <i className="fas fa-keyboard"></i> Typewriter
                </button>
                <button onClick={() => setActiveTab('social')} className={`flex-1 min-w-[120px] py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'social' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    <i className="fas fa-share-alt"></i> Social Links
                </button>
                <button onClick={() => setActiveTab('cv')} className={`flex-1 min-w-[120px] py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'cv' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    <i className="fas fa-file-pdf"></i> CV / Resume
                </button>
            </div>

            <div className="bg-transparent mt-2">
                {activeTab === 'typewriter' && (
                    <div className="flex flex-col gap-5">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[14px] font-medium text-text-secondary mb-2"><i className="fas fa-keyboard mr-2 text-brand-light"></i> Typewriter Texts</label>
                            <button onClick={handleSaveTypewriter} disabled={saving} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 disabled:opacity-50">
                                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Tab
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {typewriterTexts.map((text, idx) => (
                                <div key={idx} className="flex gap-4 items-center group">
                                    <input type="text" value={text} onChange={(e) => updateTypewriter(idx, e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="e.g., Flutter Developer..." />
                                    <button onClick={() => removeTypewriter(idx)} className="w-12 h-[46px] flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={addTypewriter} className="mt-2 py-3 px-4 text-[14px] font-medium bg-white/5 border border-white/20 border-dashed rounded-xl text-text-secondary hover:text-brand-light hover:border-brand-light transition-colors flex items-center justify-center gap-2 w-full text-center">
                            <i className="fas fa-plus"></i> Add Typewriter Text
                        </button>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[14px] font-medium text-text-secondary mb-2"><i className="fas fa-share-alt mr-2 text-brand-light"></i> Social Platforms</label>
                            <button onClick={handleSaveSocial} disabled={saving} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 disabled:opacity-50">
                                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Tab
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[14px] font-medium text-text-secondary mb-2"><i className="fab fa-linkedin-in text-blue-500 mr-2"></i> LinkedIn URL</label>
                                <input type="url" value={social.linkedin} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-text-secondary mb-2"><i className="fab fa-github text-white mr-2"></i> GitHub URL</label>
                                <input type="url" value={social.github} onChange={(e) => setSocial({ ...social, github: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="https://github.com/..." />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-text-secondary mb-2"><i className="fab fa-facebook-f text-blue-600 mr-2"></i> Facebook URL</label>
                                <input type="url" value={social.facebook} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="https://facebook.com/..." />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-text-secondary mb-2"><i className="fas fa-envelope text-red-500 mr-2"></i> Hero Email</label>
                                <input type="email" value={social.email} onChange={(e) => setSocial({ ...social, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="your@email.com" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cv' && (
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[14px] font-medium text-text-secondary mb-2"><i className="fas fa-file-pdf mr-2 text-brand-light"></i> CV File Configuration</label>
                            <button onClick={handleSaveCv} disabled={saving} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 disabled:opacity-50">
                                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Tab
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[14px] font-medium text-text-secondary mb-2">CV File</label>
                                <input type="text" readOnly onClick={handleCvFileClick} value={cv.path} className="cursor-pointer w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-brand-light transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="Click to select PDF..." />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-text-secondary mb-2">Download Filename</label>
                                <input type="text" value={cv.filename} onChange={(e) => setCv({ ...cv, filename: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="Ahmed_Abdelrahman_CV.pdf" />
                            </div>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-xl p-6 mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <i className="fas fa-file-pdf text-4xl text-red-500 opacity-80"></i>
                                <div>
                                    <div className="text-[14px] font-medium text-white mb-1">Current Focus Track: <span className="text-text-secondary font-normal ml-2 break-all">{cv.path || 'Not set'}</span></div>
                                    <div className="text-[14px] font-medium text-white">Downloads As: <span className="text-text-secondary font-normal ml-2 break-all">{cv.filename || 'Not set'}</span></div>
                                </div>
                            </div>
                            <button onClick={testCvDownload} className="py-2.5 px-5 bg-white/5 border border-white/10 rounded-xl text-[14px] text-white flex items-center gap-2 transition-colors hover:bg-white/10">
                                <i className="fas fa-download"></i> Test
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
