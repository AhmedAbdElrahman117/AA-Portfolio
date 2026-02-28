// src/lib/uploadService.js

export const UploadService = {
    apiEndpoints: {
        upload: 'https://cloudinary-uploader.ahmedaboelnaga713.workers.dev/upload',
        delete: 'https://cloudinary-uploader.ahmedaboelnaga713.workers.dev/delete'
    },
    pendingFiles: new Map(),

    async blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },

    async uploadBlobToCloudinary(blob, folder, filename) {
        const base64 = await this.blobToBase64(blob);
        const response = await fetch(this.apiEndpoints.upload, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64, folder: folder, filename: filename })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Upload failed');
        }
        const data = await response.json();
        if (!data.secure_url) throw new Error('Upload failed: No URL returned');
        return data.secure_url;
    },

    async deleteFromCloudinary(url) {
        if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return false;
        try {
            const response = await fetch(this.apiEndpoints.delete, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link: url })
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    openFilePicker(inputId, accept = 'image/*,.pdf') {
        return new Promise((resolve) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = accept;
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.pendingFiles.set(inputId, file);
                    resolve(file);
                } else {
                    resolve(null);
                }
                document.body.removeChild(fileInput);
            });

            // Handle cancellation (not perfectly reliable across all browsers, but better than nothing)
            window.addEventListener('focus', () => {
                setTimeout(() => {
                    if (document.body.contains(fileInput)) {
                        document.body.removeChild(fileInput);
                        resolve(null);
                    }
                }, 1000);
            }, { once: true });

            fileInput.click();
        });
    },

    getPendingFile(inputId) {
        return this.pendingFiles.get(inputId);
    },

    clearPendingFile(inputId) {
        this.pendingFiles.delete(inputId);
    },

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
    }
};
