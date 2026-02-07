/* ====================================
   AA Portfolio Dashboard - Authentication
   ==================================== */

const Auth = {
    // Default credentials (in production, use proper backend authentication)
    defaultCredentials: {
        username: 'admin',
        password: 'admin'
    },
    
    // Session key
    sessionKey: 'aa_dashboard_session',
    credentialsKey: 'aa_dashboard_credentials',
    
    // Initialize
    init() {
        this.loadCredentials();
        this.checkSession();
        this.bindEvents();
    },
    
    // Load custom credentials if set
    loadCredentials() {
        const saved = localStorage.getItem(this.credentialsKey);
        if (saved) {
            try {
                const creds = JSON.parse(saved);
                this.defaultCredentials = creds;
            } catch (e) {
                console.error('Failed to load credentials');
            }
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
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            if (usernameInput) {
                usernameInput.addEventListener('input', () => this.clearFieldError('username'));
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
    handleLogin() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const errorEl = document.getElementById('loginError');
        
        // Clear previous errors
        this.clearAllFieldErrors();
        errorEl.classList.add('hidden');
        
        // Validate fields
        let hasError = false;
        
        if (!username) {
            this.showFieldError('username', 'Please enter your username');
            hasError = true;
        }
        
        if (!password) {
            this.showFieldError('password', 'Please enter your password');
            hasError = true;
        }
        
        if (hasError) return;
        
        if (username === this.defaultCredentials.username && 
            password === this.defaultCredentials.password) {
            // Create session
            const session = {
                username: username,
                loginTime: Date.now(),
                expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            
            this.showDashboard(username);
        } else {
            // Show field-level errors for invalid credentials
            this.showFieldError('username', 'Invalid username or password');
            this.showFieldError('password', 'Invalid username or password');
            
            // Shake animation
            const container = document.querySelector('.login-container');
            container.style.animation = 'shake 0.5s ease';
            setTimeout(() => container.style.animation = '', 500);
        }
    },
    
    // Handle logout
    handleLogout() {
        // Show confirmation dialog before logging out
        if (typeof Dashboard !== 'undefined' && Dashboard.showDeleteDialog) {
            Dashboard.showDeleteDialog(
                'Logout',
                'Are you sure you want to log out?',
                () => {
                    localStorage.removeItem(this.sessionKey);
                    this.showLogin();
                },
                { icon: 'fa-sign-out-alt', text: 'Logout' }
            );
        } else {
            // Fallback to native confirm
            if (confirm('Are you sure you want to log out?')) {
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
    },
    
    // Update credentials
    updateCredentials(username, password) {
        const creds = { username, password };
        localStorage.setItem(this.credentialsKey, JSON.stringify(creds));
        this.defaultCredentials = creds;
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
