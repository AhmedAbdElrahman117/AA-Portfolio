import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import { UploadService } from '../../../lib/uploadService';

export default function AboutManager() {
    const [profile, setProfile] = useState({ profileImage: '', fullName: '', paragraphs: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        const { db } = initFirebase();
        if (!db) return;

        try {
            const docRef = doc(db, "portfolio", "about");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data().data || docSnap.data();
                setProfile({
                    profileImage: data.profileImage || '',
                    fullName: data.fullName || '',
                    paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : []
                });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Load Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = async () => {
        const file = await UploadService.openFilePicker('about_profile', 'image/*');
        if (file) {
            setProfile({ ...profile, profileImage: file.name });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const { db } = initFirebase();

        try {
            let finalImage = profile.profileImage;
            const pendingFile = UploadService.getPendingFile('about_profile');

            if (pendingFile) {
                Swal.fire({
                    title: 'Uploading...',
                    text: 'Uploading profile image to Cloudinary...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                    background: '#1a1a1a', color: '#fff'
                });
                finalImage = await UploadService.uploadPendingFile('about_profile', 'portfolio');
                setProfile(prev => ({ ...prev, profileImage: finalImage }));
            }

            const docRef = doc(db, "portfolio", "about");
            await setDoc(docRef, { data: { ...profile, profileImage: finalImage } }, { merge: true });

            Swal.fire({
                icon: 'success', title: 'Saved!', text: 'About section updated.',
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3', timer: 1500
            });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setSaving(false);
        }
    };

    const updateParagraph = (index, value) => {
        const updated = [...profile.paragraphs];
        updated[index] = value;
        setProfile({ ...profile, paragraphs: updated });
    };

    const addParagraph = () => {
        setProfile({ ...profile, paragraphs: [...profile.paragraphs, ''] });
    };

    const removeParagraph = (index) => {
        const updated = [...profile.paragraphs];
        updated.splice(index, 1);
        setProfile({ ...profile, paragraphs: updated });
    };

    if (loading) return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Edit About Section</h3>
                <button onClick={handleSave} disabled={saving} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 disabled:opacity-50">
                    {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2.5 mb-6 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <button onClick={() => setActiveTab('profile')} className={`flex-1 flex justify-center items-center gap-2 py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'profile' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    <i className="fas fa-user-circle text-[16px]"></i> Profile
                </button>
                <button onClick={() => setActiveTab('paragraphs')} className={`flex-1 flex justify-center items-center gap-2 py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'paragraphs' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    <i className="fas fa-paragraph text-[16px]"></i> Paragraphs
                </button>
            </div>

            <div className="bg-transparent mt-2">
                {activeTab === 'profile' && (
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-[120px] h-[120px] rounded-lg bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 mt-7">
                            {profile.profileImage ? (
                                <img src={profile.profileImage.startsWith('http') ? profile.profileImage : `/${profile.profileImage}`} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <i className="fas fa-user text-4xl text-white/20"></i>
                            )}
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-5">
                            <div className="mb-4">
                                <label className="block text-[14px] font-medium text-text-secondary mb-2">Profile Image</label>
                                <input type="text" readOnly onClick={handleImageClick} value={profile.profileImage} className="cursor-pointer w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-brand-light transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="Click to select file..." />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[14px] font-medium text-text-secondary mb-2">Full Name</label>
                                <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="e.g., John Doe" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'paragraphs' && (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4">
                            {profile.paragraphs.map((p, idx) => (
                                <div key={idx} className="flex gap-4 items-start w-full group">
                                    <div className="flex-1">
                                        <textarea value={p} onChange={(e) => updateParagraph(idx, e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10 min-h-[120px] resize-y" placeholder="Enter paragraph HTML text..."></textarea>
                                    </div>
                                    <button onClick={() => removeParagraph(idx)} className="py-3 px-4 text-[14px] font-medium bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center focus:outline-none shrink-0 mt-0">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={addParagraph} className="mt-2 py-3 px-4 text-[14px] font-medium bg-white/5 border border-white/20 border-dashed rounded-xl text-text-secondary hover:text-brand-light hover:border-brand-light transition-colors flex items-center justify-center gap-2">
                            <i className="fas fa-plus"></i> Add Paragraph
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
