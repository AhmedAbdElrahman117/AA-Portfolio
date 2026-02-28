/* ====================================
   AA Portfolio Dashboard - Authentication
   ==================================== */

'use strict';

const Auth = {
    // Firebase Auth
    auth: null,
    firebaseApp: null,
    
    // Session key
    sessionKey: 'aa_dashboard_session',
    
    // Email domain
    emailDomain: '@aa.com',
    
    // Initialize
    async init() {
        await this.initFirebase();
        this.checkSession();
        this.bindEvents();
    },
    
    // Initialize Firebase Auth
    async initFirebase() {
        if (this.auth) return;
        
        try {
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            const firebaseConfig = window.CONFIG ? window.CONFIG.firebase : {
                apiKey: "AIzaSyC1Hr7L6yp27w6E9wInccgpPFMSSrBRvwE",
                authDomain: "portfolio-e911a.firebaseapp.com",
                projectId: "portfolio-e911a",
                storageBucket: "portfolio-e911a.firebasestorage.app",
                messagingSenderId: "16738302709",
                appId: "1:16738302709:web:3a17868a9bbfa3ba0563bc",
                measurementId: "G-4HJNGVNDS5"
            };
            
            this.firebaseApp = initializeApp(firebaseConfig);
            this.auth = getAuth(this.firebaseApp);
            this.firebaseMethods = { signInWithEmailAndPassword, onAuthStateChanged, signOut };
            
            // Listen for auth state changes
            this.firebaseMethods.onAuthStateChanged(this.auth, (user) => {
                if (user) {
                    this.handleAuthSuccess(user);
                }
            });
        } catch (error) {
            // Silent error handling
        }
    },
    
    // Check if user is already logged in
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                const data = JSON.parse(session);
                const now = Date.now();
                // Session expires after 24 hours
                if (data.expiry && data.expiry > now) {
                    this.showDashboard(data.username);
                    return true;
                } else {
                    localStorage.removeItem(this.sessionKey);
                }
            } catch (e) {
                localStorage.removeItem(this.sessionKey);
            }
        }
        return false;
    },
    
    // Bind login form events
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
            
            // Clear field errors on input
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (emailInput) {
                emailInput.addEventListener('input', () => this.clearFieldError('email'));
            }
            if (passwordInput) {
                passwordInput.addEventListener('input', () => this.clearFieldError('password'));
            }
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    },
    
    // Field validation helpers (Flutter-like)
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('has-error');
        field.classList.add('has-error');
        
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        field.insertAdjacentElement('afterend', errorDiv);
        field.focus();
    },
    
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('has-error');
        field.classList.remove('has-error');
        
        const errorDiv = formGroup.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    },
    
    clearAllFieldErrors() {
        document.querySelectorAll('#loginForm .form-group.has-error').forEach(group => {
            group.classList.remove('has-error');
        });
        document.querySelectorAll('#loginForm .has-error').forEach(el => {
            el.classList.remove('has-error');
        });
        document.querySelectorAll('#loginForm .field-error').forEach(el => {
            el.remove();
        });
    },
    
    // Handle login
    async handleLogin() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailUsername = emailInput.value.trim();
        const password = passwordInput.value;
        const errorEl = document.getElementById('loginError');
        
        // Clear previous errors
        this.clearAllFieldErrors();
        errorEl.classList.add('hidden');
        
        // Validate fields
        let hasError = false;
        
        if (!emailUsername) {
            this.showFieldError('email', 'Please enter your email');
            hasError = true;
        }
        
        if (!password) {
            this.showFieldError('password', 'Please enter your password');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Construct full email with domain
        const fullEmail = emailUsername + this.emailDomain;
        
        try {
            // Show loading state
            const submitBtn = document.querySelector('#loginForm button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            
            // Sign in with Firebase
            await this.firebaseMethods.signInWithEmailAndPassword(this.auth, fullEmail, password);
            
            // Success handled by onAuthStateChanged listener
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        } catch (error) {
            // Restore button state
            const submitBtn = document.querySelector('#loginForm button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            
            // Handle errors
            let errorMessage = 'Invalid email or password';
            
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection';
            }
            
            // Show field-level errors
            this.showFieldError('email', errorMessage);
            this.showFieldError('password', errorMessage);
            
            // Shake animation
            const container = document.querySelector('.login-container');
            container.style.animation = 'shake 0.5s ease';
            setTimeout(() => container.style.animation = '', 500);
        }
    },
    
    // Handle successful authentication
    handleAuthSuccess(user) {
        // Create session
        const session = {
            email: user.email,
            uid: user.uid,
            loginTime: Date.now(),
            expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        
        // Extract username from email (before @aa.com)
        const username = user.email.split('@')[0];
        this.showDashboard(username);
    },
    
    // Handle logout
    async handleLogout() {
        // Show confirmation dialog before logging out
        if (typeof Dashboard !== 'undefined' && Dashboard.showDeleteDialog) {
            Dashboard.showDeleteDialog(
                'Logout',
                'Are you sure you want to log out?',
                async () => {
                    try {
                        await this.firebaseMethods.signOut(this.auth);
                    } catch (error) {
                        // Silent error handling
                    }
                    localStorage.removeItem(this.sessionKey);
                    this.showLogin();
                },
                { icon: 'fa-sign-out-alt', text: 'Logout' }
            );
        } else {
            // Fallback to native confirm
            if (confirm('Are you sure you want to log out?')) {
                try {
                    await this.firebaseMethods.signOut(this.auth);
                } catch (error) {
                    // Silent error handling
                }
                localStorage.removeItem(this.sessionKey);
                this.showLogin();
            }
        }
    },
    
    // Show dashboard
    showDashboard(username) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('adminName').textContent = username;
        
        // Initialize dashboard
        if (typeof Dashboard !== 'undefined') {
            Dashboard.init();
        }
    },
    
    // Show login screen
    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginForm').reset();
    }
};

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
