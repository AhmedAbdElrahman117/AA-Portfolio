/* ====================================
   AA Portfolio Dashboard - Upload Service
   ==================================== */

'use strict';

const UploadService = {
    // Cloudinary configuration (loaded from config.js)
    cloudinary: window.CONFIG ? window.CONFIG.cloudinary : {
        cloudName: 'db2hsfkzd',
        uploadPreset: 'portfolio_unsigned',
        apiKey: '864717488794595'
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
        }
    },
    
    // Upload file to Cloudinary from assets folder
    async uploadToCloudinary(filePath, folder = 'portfolio') {
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }
        
        try {
            const fetchPath = '../' + filePath;
            const response = await fetch(fetchPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error('File is empty');
            }
            
            return await this.uploadBlobToCloudinary(blob, folder, this.getFileName(filePath));
        } catch (error) {
            throw error;
        }
    },
    
    // Upload blob to Cloudinary
    async uploadBlobToCloudinary(blob, folder, filename) {
        const formData = new FormData();
        formData.append('file', blob, filename);
        formData.append('upload_preset', this.cloudinary.uploadPreset);
        formData.append('folder', folder);
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/auto/upload`,
            { method: 'POST', body: formData }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Cloudinary upload failed');
        }
        
        return data.secure_url;
    },
    
    // Check if URL is a Cloudinary URL
    isCloudinaryUrl(url) {
        return url && typeof url === 'string' && url.includes('res.cloudinary.com');
    },
    
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/resource_type/upload/vXXX/folder/filename.ext
    getPublicIdFromUrl(url) {
        if (!this.isCloudinaryUrl(url)) return null;
        
        try {
            const uploadMatch = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
            if (!uploadMatch) return null;
            
            let publicId = uploadMatch[1];
            const lastDotIndex = publicId.lastIndexOf('.');
            if (lastDotIndex > 0) {
                publicId = publicId.substring(0, lastDotIndex);
            }
            
            return publicId;
        } catch (error) {
            return null;
        }
    },
    
    // Generate SHA-1 signature for Cloudinary API authentication
    async generateSignature(params) {
        const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
        const stringToSign = sortedParams + this.cloudinary.apiSecret;
        
        const encoder = new TextEncoder();
        const data = encoder.encode(stringToSign);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    // Delete file from Cloudinary with proper authentication
    async deleteFromCloudinary(url) {
        if (!this.isCloudinaryUrl(url)) return false;
        
        const publicId = this.getPublicIdFromUrl(url);
        if (!publicId) return false;
        
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = { public_id: publicId, timestamp: timestamp };
            const signature = await this.generateSignature(params);
            
            const formData = new FormData();
            formData.append('public_id', publicId);
            formData.append('timestamp', timestamp.toString());
            formData.append('api_key', this.cloudinary.apiKey);
            formData.append('signature', signature);
            
            let resourceType = 'image';
            if (url.includes('/video/')) resourceType = 'video';
            else if (url.includes('/raw/')) resourceType = 'raw';
            
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/${resourceType}/destroy`,
                { method: 'POST', body: formData }
            );
            
            const data = await response.json();
            return data.result === 'ok' || data.result === 'not found';
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
    
    // Get filename from path
    getFileName(path) {
        return path.split('/').pop();
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
