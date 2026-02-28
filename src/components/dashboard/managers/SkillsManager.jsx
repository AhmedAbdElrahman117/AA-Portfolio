import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import { UploadService } from '../../../lib/uploadService';

export default function SkillsManager() {
    const [activeTab, setActiveTab] = useState('tech');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form lists
    const [techSkills, setTechSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [langSkills, setLangSkills] = useState([]);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        const { db } = initFirebase();
        if (!db) return;

        try {
            // Load Tech Skills
            const techSnap = await getDoc(doc(db, "portfolio", "techSkills"));
            if (techSnap.exists()) {
                const fsData = techSnap.data().data || techSnap.data();
                setTechSkills(Array.isArray(fsData) ? fsData : (fsData.techSkills || []));
            }

            // Load Soft Skills
            const softSnap = await getDoc(doc(db, "portfolio", "softSkills"));
            if (softSnap.exists()) {
                const fsData = softSnap.data().data || softSnap.data();
                setSoftSkills(Array.isArray(fsData) ? fsData : (fsData.softSkills || []));
            }

            // Load Lang Skills
            const langSnap = await getDoc(doc(db, "portfolio", "langSkills"));
            if (langSnap.exists()) {
                const fsData = langSnap.data().data || langSnap.data();
                setLangSkills(Array.isArray(fsData) ? fsData : (fsData.langSkills || []));
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Load Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    const saveToFirebase = async (tab, list) => {
        const { db } = initFirebase();
        try {
            if (tab === 'tech') {
                await setDoc(doc(db, "portfolio", "techSkills"), { data: list }, { merge: true });
            } else if (tab === 'soft') {
                await setDoc(doc(db, "portfolio", "softSkills"), { data: list }, { merge: true });
            } else if (tab === 'lang') {
                await setDoc(doc(db, "portfolio", "langSkills"), { data: list }, { merge: true });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message, background: '#1a1a1a', color: '#fff' });
        }
    };

    const deleteSkill = (index) => {
        Swal.fire({
            title: 'Delete Skill?',
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
                if (activeTab === 'tech') { const u = [...techSkills]; u.splice(index, 1); setTechSkills(u); await saveToFirebase('tech', u); }
                if (activeTab === 'soft') { const u = [...softSkills]; u.splice(index, 1); setSoftSkills(u); await saveToFirebase('soft', u); }
                if (activeTab === 'lang') { const u = [...langSkills]; u.splice(index, 1); setLangSkills(u); await saveToFirebase('lang', u); }
                Swal.fire({ icon: 'success', title: 'Deleted', text: 'Skill removed successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    const openSkillModal = (index = -1) => {
        const isEdit = index >= 0;
        const currentList = activeTab === 'tech' ? techSkills : activeTab === 'soft' ? softSkills : langSkills;

        let defaultSkill = {};
        if (activeTab === 'tech') defaultSkill = { name: '', image: '' };
        if (activeTab === 'soft') defaultSkill = { name: '', percentage: 90, color: '#2196F3' };
        if (activeTab === 'lang') defaultSkill = { name: '', level: 'Fluent', percentage: 90, color: '#9C27B0' };

        const skill = isEdit ? currentList[index] : defaultSkill;

        let htmlContent = `
            <div class="flex flex-col gap-5 text-left mt-4">
                <div>
                    <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Skill Name</label>
                    <input id="swal-name" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${skill.name || ''}" placeholder="e.g. React">
                </div>
        `;

        if (activeTab === 'tech') {
            htmlContent += `
                <div>
                    <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Image File</label>
                    <input id="swal-image" readonly class="cursor-pointer w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${skill.image || ''}" placeholder="Click to select image...">
                </div>
            `;
        }

        if (activeTab === 'soft' || activeTab === 'lang') {
            htmlContent += `
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Proficiency (%)</label>
                        <input id="swal-percentage" type="number" min="0" max="100" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${skill.percentage || 0}">
                    </div>
                    <div class="w-20">
                        <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Color</label>
                        <input id="swal-color" type="color" class="w-full h-[46px] bg-black/40 border border-white/10 rounded-xl cursor-pointer p-1" value="${skill.color || '#2196F3'}">
                    </div>
                </div>
            `;
        }

        if (activeTab === 'lang') {
            htmlContent += `
                <div>
                    <label class="block text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">Fluency Level</label>
                    <input id="swal-level" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all" value="${skill.level || ''}" placeholder="e.g. Native / Fluent / B2">
                </div>
            `;
        }

        htmlContent += `</div>`;

        Swal.fire({
            title: isEdit ? 'Edit Skill' : 'Add Skill',
            html: htmlContent,
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
                        const file = await UploadService.openFilePicker('skill_image', 'image/*');
                        if (file) {
                            imgInput.value = file.name;
                            imgInput.style.color = '#2196F3';
                        }
                    });
                }
            },
            preConfirm: async () => {
                const res = {
                    name: document.getElementById('swal-name').value
                };
                if (activeTab === 'tech') {
                    let finalImage = document.getElementById('swal-image').value;
                    const pendingFile = UploadService.getPendingFile('skill_image');

                    if (pendingFile) {
                        Swal.showLoading();
                        try {
                            finalImage = await UploadService.uploadPendingFile('skill_image', 'portfolio');
                        } catch (e) {
                            Swal.showValidationMessage(`Upload failed: ${e.message}`);
                            return false;
                        }
                    }
                    res.image = finalImage;
                }
                if (activeTab === 'soft' || activeTab === 'lang') {
                    res.percentage = parseInt(document.getElementById('swal-percentage').value, 10);
                    res.color = document.getElementById('swal-color').value;
                }
                if (activeTab === 'lang') {
                    res.level = document.getElementById('swal-level').value;
                }
                return res;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedSkill = {
                    ...skill,
                    ...result.value,
                    id: isEdit ? skill.id : Date.now()
                };

                const updateList = async (list, setter, tabName) => {
                    const updated = [...list];
                    if (isEdit) updated[index] = updatedSkill;
                    else updated.unshift(updatedSkill);
                    setter(updated);
                    await saveToFirebase(tabName, updated);
                };

                if (activeTab === 'tech') await updateList(techSkills, setTechSkills, 'tech');
                if (activeTab === 'soft') await updateList(softSkills, setSoftSkills, 'soft');
                if (activeTab === 'lang') await updateList(langSkills, setLangSkills, 'lang');
                Swal.fire({ icon: 'success', title: 'Saved', text: 'Skill saved successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    if (loading) return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    const currentList = activeTab === 'tech' ? techSkills : activeTab === 'soft' ? softSkills : langSkills;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Manage Skills</h3>
                <div className="flex gap-3">
                    <button onClick={() => openSkillModal(-1)} className="bg-gradient-to-r from-brand-light to-brand-dark hover:brightness-110 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-[0_4px_15px_rgba(33,150,243,0.3)] text-sm flex items-center gap-2">
                        <i className="fas fa-plus"></i> Add {activeTab === 'tech' ? 'Tech' : activeTab === 'soft' ? 'Soft' : 'Language'} Skill
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2.5 mb-7 bg-white/5 p-2.5 rounded-xl border border-white/10 flex-wrap sm:flex-nowrap">
                <button onClick={() => setActiveTab('tech')} className={`flex-1 min-w-[120px] py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'tech' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    Tech Stack
                </button>
                <button onClick={() => setActiveTab('soft')} className={`flex-1 min-w-[120px] py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'soft' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    Soft Skills
                </button>
                <button onClick={() => setActiveTab('lang')} className={`flex-1 min-w-[120px] py-3.5 px-4 sm:px-7 rounded-lg text-[14px] font-medium transition-all duration-300 hover:bg-white/5 hover:text-white hover:-translate-y-[2px] ${activeTab === 'lang' ? 'bg-gradient-to-br from-brand-light to-brand-dark text-white shadow-[0_4px_15px_rgba(33,150,243,0.3)]' : 'bg-transparent text-text-secondary border-none'}`}>
                    Languages
                </button>
            </div>

            {activeTab === 'tech' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-2 auto-rows-max" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {currentList.map((skill, idx) => (
                        <div key={skill.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:-translate-y-[5px] hover:border-brand-light transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] items-center text-center">
                            <div className="w-[80px] h-[80px] shrink-0 mb-2">
                                {skill.image ? (
                                    <img src={skill.image.startsWith('http') ? skill.image : `/${skill.image}`} alt={skill.name} className="w-full h-full object-contain drop-shadow-lg" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black/50 text-white/20 rounded-lg">
                                        <i className="fas fa-code text-2xl"></i>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-start w-full">
                                <h4 className="text-[14px] font-semibold text-white">{skill.name || 'Unnamed Skill'}</h4>
                            </div>
                            <div className="flex gap-2 w-full mt-auto shrink-0">
                                <button onClick={() => openSkillModal(idx)} className="flex-1 py-2 px-3 text-[12px] font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-light">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => deleteSkill(idx)} className="flex-1 py-2 px-3 text-[12px] font-medium bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {currentList.length === 0 && (
                        <div className="col-span-full py-8 text-center text-text-muted italic bg-white/5 border border-dashed border-white/10 rounded-lg">
                            <p className="text-sm">No tech skills added yet.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-3 mt-2">
                    {currentList.map((skill, idx) => (
                        <div key={skill.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-brand-light transition-all duration-300">
                            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
                                <span className="text-[14px] font-medium min-w-[150px] text-white shrink-0">{skill.name}</span>
                                {activeTab === 'lang' && skill.level && (
                                    <span className="text-text-muted text-[12px] sm:mr-4 whitespace-nowrap shrink-0">{skill.level}</span>
                                )}
                                <div className="w-full sm:flex-1 h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden mt-2 sm:mt-0 shrink-0">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${skill.percentage}%`, background: skill.color || 'linear-gradient(90deg, #2196F3, #673AB7)' }}></div>
                                </div>
                                <span className="text-[14px] font-semibold text-brand-light min-w-[50px] text-right shrink-0">{skill.percentage}%</span>
                            </div>
                            <div className="flex gap-2 shrink-0 self-end sm:self-auto mt-3 sm:mt-0">
                                <button onClick={() => openSkillModal(idx)} className="py-2 px-3 text-[12px] font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-light">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => deleteSkill(idx)} className="py-2 px-3 text-[12px] font-medium bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {currentList.length === 0 && (
                        <div className="py-8 text-center text-text-muted italic bg-white/5 border border-dashed border-white/10 rounded-lg">
                            <p className="text-sm">No skills added yet for this category.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
