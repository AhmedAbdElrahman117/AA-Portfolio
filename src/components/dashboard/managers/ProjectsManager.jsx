import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import { UploadService } from '../../../lib/uploadService';
import DraggableList from '../DraggableList';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [orderChanged, setOrderChanged] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        const { db } = initFirebase();
        if (!db) return;

        try {
            const docRef = doc(db, "portfolio", "projects");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fsData = docSnap.data().data || docSnap.data();
                if (Array.isArray(fsData)) {
                    setProjects(fsData.map(p => ({
                        ...p,
                        tags: p.technologies || p.tags || [],
                        details: p.details || p.description
                    })));
                }
            }
        } catch (error) {
            console.error("Error loading projects", error);
            Swal.fire('Error', 'Failed to load projects.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveToFirebase = async (updatedProjects) => {
        const { db } = initFirebase();
        try {
            const docRef = doc(db, "portfolio", "projects");
            // Re-normalize for save
            const savePayload = updatedProjects.map(p => ({
                ...p,
                technologies: p.tags,
                description: p.description
            }));
            await updateDoc(docRef, { data: savePayload });
        } catch (error) {
            console.error("Error saving projects", error);
            Swal.fire('Error', 'Failed to save projects.', 'error');
        }
    };

    const handleReorder = (newItems) => {
        setProjects(newItems);
        setOrderChanged(true);
    };

    const saveOrder = async () => {
        setSaving(true);
        await saveToFirebase(projects);
        setOrderChanged(false);
        setSaving(false);
        Swal.fire({ icon: 'success', title: 'Order Saved', text: 'Project order updated.', background: '#1a1a1a', color: '#fff', timer: 1000 });
    };

    const deleteProject = (index) => {
        Swal.fire({
            title: 'Delete Project?',
            text: "This action cannot be undone!",
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
                const newProjects = [...projects];
                newProjects.splice(index, 1);
                setProjects(newProjects);
                await saveToFirebase(newProjects);
                Swal.fire({ icon: 'success', title: 'Deleted', text: 'Project deleted successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    const openProjectModal = (index = -1) => {
        const isEdit = index >= 0;
        const proj = isEdit ? projects[index] : {
            title: '', description: '', image: '', tags: [], github: ''
        };

        const escapeHtml = (unsafe) => {
            if (!unsafe) return '';
            return unsafe
                .toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const features = proj.features || [];
        const screenshots = proj.screenshots || [];
        const technologies = proj.technologies || proj.tags || [];
        const packages = proj.packages || [];

        Swal.fire({
            title: isEdit ? 'Edit Project' : 'Add Project',
            html: `
            <div class="swal-form text-left mt-4 flex flex-col gap-4">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Project Title</label>
                    <input type="text" id="modalProjectTitle" class="swal2-input !w-full !m-0 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all h-[46px]" required value="${escapeHtml(proj.title)}" placeholder="e.g., E-commerce App">
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Description</label>
                    <textarea id="modalProjectDesc" class="swal2-textarea !w-full !m-0 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all min-h-[100px]" required placeholder="Describe what this project does...">${escapeHtml(proj.description)}</textarea>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Image File</label>
                    <input type="text" id="modalProjectImage" readonly class="cursor-pointer swal2-input !w-full !m-0 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all h-[46px]" required value="${escapeHtml(proj.image)}" placeholder="Click to select image...">
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Technologies (at least 1 required)</label>
                    <div class="modal-dynamic-list flex flex-col gap-2" id="modalTechList">
                        ${technologies.length > 0 ? technologies.map(tech => `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="${escapeHtml(tech)}" placeholder="e.g., Flutter">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `).join('') : `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="" placeholder="e.g., Flutter">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `}
                    </div>
                    <button type="button" id="btnAddTech" class="self-start text-xs font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 px-3 py-1.5 transition-colors flex items-center gap-1.5">
                        <i class="fas fa-plus"></i> Add Technology
                    </button>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Packages (at least 1 required)</label>
                    <div class="modal-dynamic-list flex flex-col gap-2" id="modalPackagesList">
                        ${packages.length > 0 ? packages.map(pkg => `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="${escapeHtml(pkg)}" placeholder="e.g., flutter_bloc">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `).join('') : `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="" placeholder="e.g., flutter_bloc">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `}
                    </div>
                    <button type="button" id="btnAddPackage" class="self-start text-xs font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 px-3 py-1.5 transition-colors flex items-center gap-1.5">
                        <i class="fas fa-plus"></i> Add Package
                    </button>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Key Features (at least 1 required)</label>
                    <div class="modal-dynamic-list flex flex-col gap-2" id="modalFeaturesList">
                        ${features.length > 0 ? features.map(feature => `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="${escapeHtml(feature)}" placeholder="e.g., User authentication">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `).join('') : `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="" placeholder="e.g., User authentication">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `}
                    </div>
                    <button type="button" id="btnAddFeature" class="self-start text-xs font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 px-3 py-1.5 transition-colors flex items-center gap-1.5">
                        <i class="fas fa-plus"></i> Add Feature
                    </button>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Screenshots (optional)</label>
                    <div class="modal-dynamic-list flex flex-col gap-2" id="modalScreenshotsList">
                        ${screenshots.map(screenshot => `
                            <div class="modal-dynamic-item flex gap-2">
                                <input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" readonly style="cursor: pointer" value="${escapeHtml(screenshot)}" placeholder="Click to select screenshot...">
                                <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                            </div>
                        `).join('') || ''}
                    </div>
                    <button type="button" id="btnAddScreenshot" class="self-start text-xs font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 px-3 py-1.5 transition-colors flex items-center gap-1.5">
                        <i class="fas fa-plus"></i> Add Screenshot
                    </button>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">GitHub URL</label>
                    <input type="url" id="modalProjectGithub" class="swal2-input !w-full !m-0 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all font-mono text-sm h-[46px]" value="${proj.github || ''}" placeholder="https://github.com/username/repo">
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs text-text-muted uppercase tracking-wider font-medium">Store URL (optional)</label>
                    <input type="url" id="modalProjectStore" class="swal2-input !w-full !m-0 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light transition-all font-mono text-sm h-[46px]" value="${proj.store || ''}" placeholder="https://play.google.com/store/apps/...">
                </div>
            </div>
            `,
            background: '#1a1a1a',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: '#2196F3',
            cancelButtonColor: '#333',
            customClass: {
                popup: 'rounded-2xl border border-white/10 shadow-2xl bg-black/90 backdrop-blur-xl',
                htmlContainer: 'overflow-visible !text-left'
            },
            width: '600px',
            didOpen: () => {
                const addModalListItem = (listId, placeholder) => {
                    const list = document.getElementById(listId);
                    if (!list) return;

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'modal-dynamic-item flex gap-2 mt-2';
                    const isScreenshot = listId === 'modalScreenshotsList';

                    const inputHtml = isScreenshot ?
                        `<input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" readonly style="cursor: pointer" value="" placeholder="${placeholder}">` :
                        `<input type="text" class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-light" value="" placeholder="${placeholder}">`;

                    itemDiv.innerHTML = `
                        ${inputHtml}
                        <button type="button" class="btn-delete-modal w-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"><i class="fas fa-times"></i></button>
                    `;
                    list.appendChild(itemDiv);

                    // Add delete listener natively
                    itemDiv.querySelector('.btn-delete-modal').addEventListener('click', function () {
                        this.closest('.modal-dynamic-item').remove();
                    });

                    // Add screenshot upload listener if applicable
                    if (isScreenshot) {
                        const inputField = itemDiv.querySelector('input');
                        inputField.addEventListener('click', async () => {
                            const file = await UploadService.openFilePicker('project_screenshots', 'image/*');
                            if (file) {
                                inputField.value = file.name;
                                inputField.setAttribute('data-pending', 'true');
                                inputField.style.color = '#2196F3';
                            }
                        });
                    }
                };

                // Bind Add buttons
                document.getElementById('btnAddTech')?.addEventListener('click', () => addModalListItem('modalTechList', 'e.g., Flutter'));
                document.getElementById('btnAddPackage')?.addEventListener('click', () => addModalListItem('modalPackagesList', 'e.g., flutter_bloc'));
                document.getElementById('btnAddFeature')?.addEventListener('click', () => addModalListItem('modalFeaturesList', 'e.g., User authentication'));
                document.getElementById('btnAddScreenshot')?.addEventListener('click', () => addModalListItem('modalScreenshotsList', 'Click to select screenshot...'));

                // Bind initial delete buttons universally
                document.querySelectorAll('.btn-delete-modal').forEach(btn => {
                    btn.addEventListener('click', function () {
                        this.closest('.modal-dynamic-item').remove();
                    });
                });

                // Attach main project image picker
                const imgInput = document.getElementById('modalProjectImage');
                if (imgInput) {
                    imgInput.addEventListener('click', async () => {
                        const file = await UploadService.openFilePicker('project_image', 'image/*');
                        if (file) {
                            imgInput.value = file.name;
                            imgInput.style.color = '#2196F3';
                        }
                    });
                }

                // Attach existing screenshots to upload picker
                document.querySelectorAll('#modalScreenshotsList input').forEach(input => {
                    input.addEventListener('click', async () => {
                        const file = await UploadService.openFilePicker('project_screenshots', 'image/*');
                        if (file) {
                            input.value = file.name;
                            input.setAttribute('data-pending', 'true');
                            input.style.color = '#2196F3';
                        }
                    });
                });
            },
            preConfirm: async () => {
                let finalImage = document.getElementById('modalProjectImage').value;
                const pendingFile = UploadService.getPendingFile('project_image');

                if (pendingFile) {
                    Swal.showLoading();
                    try {
                        finalImage = await UploadService.uploadPendingFile('project_image', 'portfolio');
                    } catch (e) {
                        Swal.showValidationMessage(`Upload failed: ${e.message}`);
                        return false;
                    }
                }

                // Parse standard arrays
                const technologies = Array.from(document.querySelectorAll('#modalTechList input')).map(el => el.value.trim()).filter(Boolean);
                const packages = Array.from(document.querySelectorAll('#modalPackagesList input')).map(el => el.value.trim()).filter(Boolean);
                const features = Array.from(document.querySelectorAll('#modalFeaturesList input')).map(el => el.value.trim()).filter(Boolean);

                if (technologies.length === 0) { Swal.showValidationMessage('At least 1 Technology is required.'); return false; }
                if (packages.length === 0) { Swal.showValidationMessage('At least 1 Package is required.'); return false; }
                if (features.length === 0) { Swal.showValidationMessage('At least 1 Feature is required.'); return false; }

                // Process screenshots strictly simulating the original multi-file logic
                const screenshotInputs = Array.from(document.querySelectorAll('#modalScreenshotsList input'));
                const finalScreenshots = [];

                for (let i = 0; i < screenshotInputs.length; i++) {
                    const inp = screenshotInputs[i];
                    if (inp.getAttribute('data-pending') === 'true') {
                        // The file has just been opened/attached internally and needs Cloudinary execution
                        try {
                            Swal.showLoading();
                            Swal.update({ title: `Uploading screenshot ${i + 1}...` });
                            const url = await UploadService.uploadPendingFile('project_screenshots', 'portfolio');
                            finalScreenshots.push(url);
                        } catch (e) {
                            console.warn("Screenshot upload ignored/failed", e);
                        }
                    } else if (inp.value.trim().length > 0) {
                        finalScreenshots.push(inp.value.trim()); // Preserve existing unaltered url
                    }
                }

                return {
                    title: document.getElementById('modalProjectTitle').value,
                    description: document.getElementById('modalProjectDesc').value,
                    image: finalImage,
                    technologies: technologies,
                    tags: technologies, // alias for backwards compat internally
                    packages: packages,
                    features: features,
                    screenshots: finalScreenshots,
                    github: document.getElementById('modalProjectGithub').value,
                    store: document.getElementById('modalProjectStore').value,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newProjects = [...projects];
                const updatedProj = {
                    ...proj,
                    ...result.value,
                    id: isEdit ? proj.id : Date.now()
                };

                if (isEdit) {
                    newProjects[index] = updatedProj;
                } else {
                    newProjects.unshift(updatedProj);
                }
                setProjects(newProjects);
                await saveToFirebase(newProjects);
                Swal.fire({ icon: 'success', title: 'Saved', text: 'Project saved successfully.', background: '#1a1a1a', color: '#fff', timer: 1000 });
            }
        });
    };

    if (loading) return <div className="p-xl text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Manage Projects</h3>
                <div className="flex gap-3">
                    {orderChanged && (
                        <button onClick={saveOrder} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
                            <i className={saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'}></i> {saving ? 'Saving...' : 'Save Order'}
                        </button>
                    )}
                    <button onClick={() => openProjectModal(-1)} className="bg-gradient-to-r from-brand-light to-brand-dark hover:brightness-110 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-[0_4px_15px_rgba(33,150,243,0.3)] text-sm flex items-center gap-2">
                        <i className="fas fa-plus"></i> Add Project
                    </button>
                </div>
            </div>

            <DraggableList
                items={projects}
                onReorder={handleReorder}
                getItemId={(item, i) => item.id ?? i}
                renderItem={(project, idx) => (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-brand-light/50 transition-all duration-300">
                        <div className="w-[80px] h-[60px] shrink-0 bg-black/40 rounded overflow-hidden">
                            {project.image ? (
                                <img src={project.image.startsWith('http') ? project.image : `/${project.image}`} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <i className="fas fa-image text-2xl"></i>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{project.title || 'Untitled Project'}</h4>
                            <p className="text-xs text-text-secondary truncate">{project.description}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => openProjectModal(idx)} className="py-2 px-3 text-xs font-medium border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-light">
                                <i className="fas fa-edit"></i> Edit
                            </button>
                            <button onClick={() => deleteProject(idx)} className="py-2 px-3 text-xs font-medium bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                )}
            />

            {projects.length === 0 && (
                <div className="py-8 text-center text-text-muted italic bg-white/5 border border-dashed border-white/10 rounded-lg">
                    <p className="text-sm">No projects added yet.</p>
                </div>
            )}
        </div>
    );
}
