/* ====================================
   AA Portfolio Dashboard - Upload Service
   ==================================== */

'use strict';

const UploadService = {
    // Backend API endpoints for file upload/delete
    apiEndpoints: {
        upload: 'https://cloudinary-uploader.ahmedaboelnaga713.workers.dev/upload',
        delete: 'https://cloudinary-uploader.ahmedaboelnaga713.workers.dev/delete'
    },
    
    // Firebase configuration (loaded from config.js)
    firebase: window.CONFIG ? window.CONFIG.firebase : {
        apiKey: "AIzaSyC1Hr7L6yp27w6E9wInccgpPFMSSrBRvwE",
        authDomain: "portfolio-e911a.firebaseapp.com",
        projectId: "portfolio-e911a",
        storageBucket: "portfolio-e911a.firebasestorage.app",
        messagingSenderId: "16738302709",
        appId: "1:16738302709:web:3a17868a9bbfa3ba0563bc",
        measurementId: "G-4HJNGVNDS5"
    },
    
    // Firebase app and db instances
    app: null,
    db: null,
    initPromise: null,
    
    // Initialize Firebase
    async initFirebase() {
        // If already initialized, return
        if (this.app && this.db) return;
        
        // If initialization is in progress, wait for it
        if (this.initPromise) {
            await this.initPromise;
            return;
        }
        
        // Start initialization
        this.initPromise = (async () => {
            try {
                const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
                const { getFirestore, collection, doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                
                this.app = initializeApp(this.firebase);
                this.db = getFirestore(this.app);
                this.firestoreMethods = { collection, doc, setDoc, getDoc };
            } catch (error) {
                this.initPromise = null;
                throw error;
            }
        })();
        
        await this.initPromise;
    },
    
    // Fetch data from Firebase with timeout
    async fetchFromFirebase(section) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout fetching ${section}`)), 10000);
        });
        
        const arraySections = ['projects', 'certificates', 'techSkills', 'softSkills', 'langSkills'];
        
        const fetchPromise = (async () => {
            try {
                await this.initFirebase();
                const { doc, getDoc } = this.firestoreMethods;
                const docRef = doc(this.db, 'portfolio', section);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    let result = docData.data || null;
                    
                    // Convert object to array if needed for array sections
                    if (result && arraySections.includes(section) && !Array.isArray(result)) {
                        result = Object.values(result);
                    }
                    
                    return result;
                }
                return null;
            } catch (error) {
                throw error;
            }
        })();
        
        return Promise.race([fetchPromise, timeoutPromise]);
    },
    
    // Save to Firebase
    async saveToFirebase(section, data) {
        try {
            await this.initFirebase();
            const { doc, setDoc } = this.firestoreMethods;
            const docRef = doc(this.db, 'portfolio', section);
            await setDoc(docRef, { data: data, updatedAt: new Date().toISOString() });
            return true;
        } catch (error) {
            throw error;
        }
    },
    
    // Show loading overlay
    showLoading(message = 'Uploading...') {
        let overlay = document.getElementById('uploadLoadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'uploadLoadingOverlay';
            overlay.className = 'upload-loading-overlay';
            overlay.innerHTML = `
                <div class="upload-loading-content">
                    <div class="upload-spinner"></div>
                    <p class="upload-loading-message">${message}</p>
                    <div class="upload-progress-container">
                        <div class="upload-progress-bar" id="uploadProgressBar"></div>
                    </div>
                    <p class="upload-progress-text" id="uploadProgressText">0%</p>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            overlay.querySelector('.upload-loading-message').textContent = message;
            overlay.style.display = 'flex';
        }
        if (window.Dashboard) window.Dashboard.lockScroll();
    },
    
    // Update progress
    updateProgress(percent, message) {
        const progressBar = document.getElementById('uploadProgressBar');
        const progressText = document.getElementById('uploadProgressText');
        const loadingMessage = document.querySelector('.upload-loading-message');
        
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressText) progressText.textContent = Math.round(percent) + '%';
        if (message && loadingMessage) loadingMessage.textContent = message;
    },
    
    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('uploadLoadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            if (window.Dashboard) window.Dashboard.unlockScroll();
        }
    },
    
    // Upload blob to backend (which uploads to Cloudinary)
    async uploadBlobToCloudinary(blob, folder, filename) {
        // Convert blob to base64
        const base64 = await this.blobToBase64(blob);
        
        const response = await fetch(this.apiEndpoints.upload, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file: base64,
                folder: folder,
                filename: filename
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Upload failed');
        }
        
        const data = await response.json();
        
        if (!data.secure_url) {
            throw new Error('Upload failed: No URL returned');
        }
        
        return data.secure_url;
    },
    
    // Convert blob to base64 string
    async blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },
    
    // Check if URL is a Cloudinary URL
    isCloudinaryUrl(url) {
        return url && typeof url === 'string' && url.includes('res.cloudinary.com');
    },
    
    // Delete file from backend (which deletes from Cloudinary)
    async deleteFromCloudinary(url) {
        if (!this.isCloudinaryUrl(url)) return false;
        
        try {
            const response = await fetch(this.apiEndpoints.delete, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: url
                })
            });
            
            // Consider both successful response and 404 as success
            // (file already deleted or doesn't exist)
            if (response.ok) {
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    },
    
    // Delete multiple files from Cloudinary
    async deleteMultipleFromCloudinary(urls) {
        const results = [];
        for (const url of urls) {
            if (this.isCloudinaryUrl(url)) {
                const result = await this.deleteFromCloudinary(url);
                results.push({ url, deleted: result });
            }
        }
        return results;
    },
    
    // ====================================
    // File Picker & Deferred Upload
    // ====================================
    
    // Store pending files (not yet uploaded)
    pendingFiles: new Map(), // inputId -> File object
    
    // Hidden file input element
    fileInput: null,
    currentInputTarget: null,
    
    // Create hidden file input
    createFileInput() {
        if (this.fileInput) return;
        
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'image/*,.pdf';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);
        
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file && this.currentInputTarget) return;
            
            // Store file for later upload
            const inputId = this.currentInputTarget.id || `input_${Date.now()}`;
            if (!this.currentInputTarget.id) this.currentInputTarget.id = inputId;
            
            this.pendingFiles.set(inputId, file);
            
            // Show file name in input
            this.currentInputTarget.value = file.name;
            this.currentInputTarget.dataset.pendingUpload = 'true';
            
            // Add visual indicator
            this.currentInputTarget.style.color = 'var(--gradient-start)';
            
            this.fileInput.value = ''; // Reset for next selection
        });
    },
    
    // Open file picker for a specific input (just selects, doesn't upload)
    openFilePicker(inputElement, accept = 'image/*,.pdf') {
        this.createFileInput();
        this.currentInputTarget = inputElement;
        this.fileInput.accept = accept;
        this.fileInput.click();
    },
    
    // Make an input field open file picker on click
    makeFilePickerInput(inputElement, accept = 'image/*') {
        if (!inputElement || inputElement.dataset.filepicker) return;
        
        inputElement.style.cursor = 'pointer';
        inputElement.readOnly = true;
        inputElement.dataset.filepicker = 'true';
        inputElement.placeholder = 'Click to select file...';
        
        inputElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.openFilePicker(inputElement, accept);
        });
    },
    
    // Upload a pending file and return the URL
    async uploadPendingFile(inputId, folder = 'portfolio') {
        const file = this.pendingFiles.get(inputId);
        if (!file) return null;
        
        try {
            const url = await this.uploadBlobToCloudinary(file, folder, file.name);
            this.pendingFiles.delete(inputId);
            return url;
        } catch (error) {
            throw error;
        }
    },
    
    // Check if input has a pending file
    hasPendingFile(inputId) {
        return this.pendingFiles.has(inputId);
    },
    
    // Initialize file picker inputs on page
    initFilePickerInputs() {
        // Profile image
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            this.makeFilePickerInput(profileImage, 'image/*');
        }
        
        // CV path
        const cvPath = document.getElementById('cvPath');
        if (cvPath) {
            this.makeFilePickerInput(cvPath, '.pdf,application/pdf');
        }
    },
    
    // Initialize modal file picker inputs (called when modal opens)
    initModalFilePickerInputs(type) {
        setTimeout(() => { // Wait for DOM to update
            switch (type) {
                case 'tech':
                    const skillImage = document.getElementById('modalSkillImage');
                    if (skillImage) this.makeFilePickerInput(skillImage, 'image/*');
                    break;
                    
                case 'project':
                    const projectImage = document.getElementById('modalProjectImage');
                    if (projectImage) this.makeFilePickerInput(projectImage, 'image/*');
                    this.initScreenshotFilePickers();
                    break;
                    
                case 'certificate':
                    const certImage = document.getElementById('modalCertImage');
                    if (certImage) this.makeFilePickerInput(certImage, 'image/*');
                    break;
            }
        }, 100);
    },
    
    // Initialize screenshot file pickers
    initScreenshotFilePickers() {
        const screenshotsList = document.getElementById('modalScreenshotsList');
        if (!screenshotsList) return;
        
        const items = screenshotsList.querySelectorAll('.modal-dynamic-item');
        items.forEach(item => {
            const input = item.querySelector('input');
            if (input && !input.dataset.filepicker) {
                this.makeFilePickerInput(input, 'image/*');
            }
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    UploadService.initFilePickerInputs();
});
