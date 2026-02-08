/* ====================================
   Configuration Template
   ==================================== 
   
   INSTRUCTIONS:
   1. Copy this file and rename it to: config.js
   2. Fill in your actual API keys and credentials
   3. NEVER commit config.js to git (it's in .gitignore)
   4. Run 'npm run build' to obfuscate all files
*/

const CONFIG = {
    // Firebase Configuration
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.firebasestorage.app",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    },
    
    // Cloudinary Configuration (for image uploads)
    cloudinary: {
        cloudName: "YOUR_CLOUD_NAME",
        uploadPreset: "YOUR_UPLOAD_PRESET",
        // WARNING: API Secret should NEVER be in client-side code
        // Use unsigned uploads with upload preset instead
        apiKey: "YOUR_API_KEY"
        // DO NOT include apiSecret here - it belongs on a backend server
    },
    
    // Dashboard Authentication
    // RECOMMENDATION: Implement proper backend authentication
    admin: {
        username: "YOUR_ADMIN_USERNAME",
        password: "YOUR_ADMIN_PASSWORD"
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
