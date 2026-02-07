/* ====================================
   AA Portfolio Dashboard - Main JavaScript
   ==================================== */

const Dashboard = {
    // Storage keys
    storageKeys: {
        social: 'aa_portfolio_social',
        about: 'aa_portfolio_about',
        cv: 'aa_portfolio_cv',
        techSkills: 'aa_portfolio_tech_skills',
        softSkills: 'aa_portfolio_soft_skills',
        langSkills: 'aa_portfolio_lang_skills',
        projects: 'aa_portfolio_projects',
        certificates: 'aa_portfolio_certificates',
        services: 'aa_portfolio_services',
        contact: 'aa_portfolio_contact'
    },
    
    // Current editing item
    currentEditItem: null,
    currentEditType: null,
    
    // Firebase data cache
    firebaseData: {},
    loadedSections: new Set(),
    
    // Initialize dashboard
    async init() {
        this.bindNavigation();
        this.bindForms();
        this.bindSkillsTabs();
        this.bindHomeTabs();
        this.bindAboutTabs();
        this.bindImageViewer();
        this.bindAddButtons();
        this.bindModal();
        this.bindSidebar();
        this.bindDeleteDialog();
        this.bindResultDialog();
        
        // Load the initial active section (home)
        await this.loadSectionData('home');
        Analytics.renderStats();
    },
    
    // ====================================
    // Navigation
    // ====================================
    
    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');
        const sectionTitle = document.getElementById('sectionTitle');
        
        navItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                
                // Update active nav
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                
                // Show section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(`${section}Section`).classList.add('active');
                
                // Update title
                sectionTitle.textContent = item.querySelector('span').textContent;
                
                // Close sidebar on mobile
                document.querySelector('.sidebar').classList.remove('open');
                const overlay = document.getElementById('sidebarOverlay');
                if (overlay) overlay.classList.remove('show');
                
                // Load section data from Firebase if not already loaded
                await this.loadSectionData(section);
                
                // Refresh data if analytics
                if (section === 'analytics') {
                    Analytics.renderStats();
                }
            });
        });
    },
    
    bindSidebar() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        const closeSidebar = () => {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('show');
        };
        
        const openSidebar = () => {
            sidebar.classList.add('open');
            if (overlay) overlay.classList.add('show');
        };
        
        toggle.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
        
        // Close on overlay click
        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target) && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    },
    
    // ====================================
    // Forms
    // ====================================
    
    bindForms() {
        // Social form
        document.getElementById('socialForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSocial();
        });
        
        // Social form field error clearing
        ['linkedinUrl', 'githubUrl', 'facebookUrl', 'socialEmail'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.clearFieldError(id));
        });
        
        // About section field error clearing
        ['profileImage', 'fullName'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.clearFieldError(id));
        });
        
        // Add typewriter text button
        document.getElementById('addTypewriterText').addEventListener('click', () => {
            this.addTypewriterItem('');
        });
        
        // Save typewriter button
        document.getElementById('saveTypewriter').addEventListener('click', () => {
            this.saveAbout();
        });
        
        // Add paragraph button
        document.getElementById('addParagraph').addEventListener('click', () => {
            this.addParagraphItem('');
        });
        
        // Save paragraphs button
        document.getElementById('saveParagraphs').addEventListener('click', () => {
            this.saveAbout();
        });
        
        // Save profile button
        document.getElementById('saveProfile').addEventListener('click', () => {
            this.saveAbout();
        });
        
        // CV form
        document.getElementById('cvForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCV();
        });
        
        // CV form field error clearing
        ['cvPath', 'cvFilename'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.clearFieldError(id));
        });
        
        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });
        
        // Contact form field error clearing
        ['contactAddress', 'contactPhone', 'contactEmail'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.clearFieldError(id));
        });
    },
    
    bindSkillsTabs() {
        const tabs = document.querySelectorAll('.skill-tab');
        const contents = document.querySelectorAll('.skill-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(`${target}SkillsTab`).classList.add('active');
            });
        });
    },
    
    bindAboutTabs() {
        const tabs = document.querySelectorAll('.about-tab');
        const contents = document.querySelectorAll('.about-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.aboutTab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(`about${target.charAt(0).toUpperCase() + target.slice(1)}Tab`).classList.add('active');
            });
        });
    },
    
    bindHomeTabs() {
        const tabs = document.querySelectorAll('.home-tab');
        const contents = document.querySelectorAll('.home-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.homeTab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(`home${target.charAt(0).toUpperCase() + target.slice(1)}Tab`).classList.add('active');
            });
        });
    },
    
    bindImageViewer() {
        const modal = document.getElementById('imageViewerModal');
        const closeBtn = document.getElementById('closeImageViewer');
        const backdrop = modal.querySelector('.image-viewer-backdrop');
        const previewBtn = document.getElementById('profilePreviewBtn');
        
        // Open image viewer when preview button is clicked
        previewBtn.addEventListener('click', () => {
            const imagePath = document.getElementById('profileImage').value;
            if (imagePath) {
                // Build the full URL
                let imgSrc = imagePath;
                if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://') && !imagePath.startsWith('data:')) {
                    imgSrc = '../' + imagePath;
                }
                this.openImageViewer(imgSrc);
            } else {
                this.showToast('No image to preview. Enter a valid image path first.', 'error');
            }
        });
        
        // Close modal
        closeBtn.addEventListener('click', () => this.closeImageViewer());
        backdrop.addEventListener('click', () => this.closeImageViewer());
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.closeImageViewer();
            }
        });
        
        // Test CV download button
        document.getElementById('testCvDownload').addEventListener('click', () => {
            this.testCvDownload();
        });
    },
    
    openImageViewer(src) {
        const modal = document.getElementById('imageViewerModal');
        const img = document.getElementById('imageViewerImg');
        img.src = src;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    },
    
    closeImageViewer() {
        const modal = document.getElementById('imageViewerModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    },
    
    testCvDownload() {
        const cvPath = document.getElementById('cvPath').value;
        const cvFilename = document.getElementById('cvFilename').value || 'CV.pdf';
        
        if (!cvPath) {
            this.showToast('Please enter a CV path first.', 'error');
            return;
        }
        
        // Create download link
        const link = document.createElement('a');
        link.href = cvPath.startsWith('http') ? cvPath : '../' + cvPath;
        link.download = cvFilename;
        link.click();
        
        this.showToast('Download started!', 'success');
    },
    
    bindAddButtons() {
        // Tech skill
        document.getElementById('addTechSkill').addEventListener('click', () => {
            this.openModal('tech', null);
        });
        
        // Soft skill
        document.getElementById('addSoftSkill').addEventListener('click', () => {
            this.openModal('soft', null);
        });
        
        // Language skill
        document.getElementById('addLangSkill').addEventListener('click', () => {
            this.openModal('lang', null);
        });
        
        // Project
        document.getElementById('addProject').addEventListener('click', () => {
            this.openModal('project', null);
        });
        
        // Certificate
        document.getElementById('addCertificate').addEventListener('click', () => {
            this.openModal('certificate', null);
        });
        
        // Service
        document.getElementById('addService').addEventListener('click', () => {
            this.openModal('service', null);
        });
    },
    
    bindModal() {
        const modal = document.getElementById('itemModal');
        const closeBtn = document.getElementById('modalClose');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },
    
    // ====================================
    // Data Loading
    // ====================================
    
    // Section to Firebase keys mapping
    sectionToFirebaseKeys: {
        home: ['social', 'about', 'cv'],  // about contains typewriter texts
        about: ['about', 'cv'],
        skills: ['techSkills', 'softSkills', 'langSkills'],
        projects: ['projects'],
        certificates: ['certificates'],
        services: ['services'],
        contact: ['contact'],
        analytics: []
    },
    
    // Show inline loading in a section
    showSectionLoading(sectionId) {
        const section = document.getElementById(`${sectionId}Section`);
        if (!section) return;
        
        // Add loading class and overlay
        let loader = section.querySelector('.section-loading');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'section-loading';
            loader.innerHTML = `
                <div class="section-loading-content">
                    <div class="upload-spinner"></div>
                    <p>Loading data...</p>
                </div>
            `;
            section.appendChild(loader);
        }
        loader.style.display = 'flex';
    },
    
    hideSectionLoading(sectionId) {
        const section = document.getElementById(`${sectionId}Section`);
        if (!section) return;
        
        const loader = section.querySelector('.section-loading');
        if (loader) loader.style.display = 'none';
    },
    
    // Load section data from Firebase
    async loadSectionData(sectionId) {
        // Skip if already loaded
        if (this.loadedSections.has(sectionId)) {
            return;
        }
        
        const firebaseKeys = this.sectionToFirebaseKeys[sectionId] || [];
        
        // If no Firebase keys for this section, just load into UI
        if (firebaseKeys.length === 0) {
            this.loadSectionIntoUI(sectionId);
            this.loadedSections.add(sectionId);
            return;
        }
        
        // Show loading
        this.showSectionLoading(sectionId);
        
        try {
            if (typeof UploadService !== 'undefined') {
                // Fetch each key from Firebase and store in cache
                for (const key of firebaseKeys) {
                    const rawData = await UploadService.fetchFromFirebase(key);
                    if (rawData) {
                        // Unwrap Firebase {data: ..., updatedAt: ...} structure
                        this.firebaseData[key] = rawData.data !== undefined ? rawData.data : rawData;
                    }
                }
            }
            
            // Load into UI from cache
            this.loadSectionIntoUI(sectionId);
            this.loadedSections.add(sectionId);
            
        } catch (error) {
            console.error(`Failed to load ${sectionId} from Firebase:`, error);
            this.hideSectionLoading(sectionId);
            this.showToast(`Failed to load ${sectionId}: ${error.message}`, 'error');
            // Still load UI with empty data
            this.loadSectionIntoUI(sectionId);
            return;
        } finally {
            this.hideSectionLoading(sectionId);
        }
    },
    
    // Load section data into UI from cache
    loadSectionIntoUI(sectionId) {
        switch (sectionId) {
            case 'home':
                this.loadSocial();
                this.loadHomeTypewriter();
                this.loadCV();
                break;
            case 'about':
                this.loadAbout();
                this.loadCV();
                break;
            case 'skills':
                this.loadTechSkills();
                this.loadSoftSkills();
                this.loadLangSkills();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'certificates':
                this.loadCertificates();
                break;
            case 'services':
                this.loadServices();
                break;
            case 'contact':
                this.loadContact();
                break;
        }
    },
    
    // Get data from in-memory cache (loaded from Firebase)
    getData(key) {
        // Extract section name from storage key (e.g., 'aa_portfolio_social' -> 'social')
        const section = Object.keys(this.storageKeys).find(k => this.storageKeys[k] === key);
        if (section && this.firebaseData[section] !== undefined) {
            return this.firebaseData[section];
        }
        return null;
    },
    
    // Save data to in-memory cache and sync to Firebase
    saveData(key, data) {
        const section = Object.keys(this.storageKeys).find(k => this.storageKeys[k] === key);
        if (section) {
            this.firebaseData[section] = data;
        }
    },
    
    // Get data directly by section name
    getDataBySection(section) {
        return this.firebaseData[section] || null;
    },
    
    // Save data directly by section name
    saveDataBySection(section, data) {
        this.firebaseData[section] = data;
    },
    
    // ====================================
    // Social Links
    // ====================================
    
    loadSocial() {
        const data = this.getData(this.storageKeys.social) || {
            linkedin: 'https://www.linkedin.com/in/ahmed-abo-el-naga-b200892a5/',
            github: 'https://github.com/AhmedAbdElrahman117',
            facebook: 'https://www.facebook.com/lorr.ahmed.37/',
            email: 'ahmedaboelnaga713@gmail.com'
        };
        
        document.getElementById('linkedinUrl').value = data.linkedin || '';
        document.getElementById('githubUrl').value = data.github || '';
        document.getElementById('facebookUrl').value = data.facebook || '';
        document.getElementById('socialEmail').value = data.email || '';
    },
    
    async saveSocial() {
        // Clear previous errors
        this.clearFieldError('linkedinUrl');
        this.clearFieldError('githubUrl');
        this.clearFieldError('facebookUrl');
        this.clearFieldError('socialEmail');
        
        const linkedin = document.getElementById('linkedinUrl').value.trim();
        const github = document.getElementById('githubUrl').value.trim();
        const facebook = document.getElementById('facebookUrl').value.trim();
        const email = document.getElementById('socialEmail').value.trim();
        
        // Validation
        let hasError = false;
        
        // URL validation helper
        const isValidUrl = (url) => {
            if (!url) return true; // Optional fields
            try { new URL(url); return true; } catch { return false; }
        };
        
        if (linkedin && !isValidUrl(linkedin)) {
            this.showFieldError('linkedinUrl', 'Please enter a valid URL');
            hasError = true;
        }
        
        if (github && !isValidUrl(github)) {
            this.showFieldError('githubUrl', 'Please enter a valid URL');
            hasError = true;
        }
        
        if (facebook && !isValidUrl(facebook)) {
            this.showFieldError('facebookUrl', 'Please enter a valid URL');
            hasError = true;
        }
        
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showFieldError('socialEmail', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (hasError) return;
        
        const data = {
            linkedin: linkedin,
            github: github,
            facebook: facebook,
            email: email
        };
        
        this.saveData(this.storageKeys.social, data);
        
        try {
            if (typeof UploadService !== 'undefined') {
                UploadService.showLoading('Saving to Firebase...');
                await UploadService.saveToFirebase('social', data);
                UploadService.hideLoading();
                this.showResultDialog('success', 'Saved Successfully', 'Social links have been saved to the cloud.');
            } else {
                this.showToast('Social links saved locally', 'success');
            }
        } catch (error) {
            if (typeof UploadService !== 'undefined') UploadService.hideLoading();
            this.showResultDialog('error', 'Save Failed', 'Could not save to Firebase: ' + error.message);
        }
    },
    
    // ====================================
    // About Section
    // ====================================
    
    // Load only typewriter texts for Home section
    loadHomeTypewriter() {
        const data = this.getData(this.storageKeys.about) || this.getDefaultAboutData();
        
        const typewriterTexts = Array.isArray(data.typewriterTexts) 
            ? data.typewriterTexts 
            : (data.typewriterTexts || '').split('\n').filter(t => t.trim());
        
        const typewriterList = document.getElementById('typewriterList');
        typewriterList.innerHTML = '';
        typewriterTexts.forEach(text => this.addTypewriterItem(text));
    },
    
    loadAbout() {
        const data = this.getData(this.storageKeys.about) || this.getDefaultAboutData();
        
        document.getElementById('profileImage').value = data.profileImage || '';
        document.getElementById('fullName').value = data.fullName || '';
        
        // Load typewriter texts as array
        const typewriterTexts = Array.isArray(data.typewriterTexts) 
            ? data.typewriterTexts 
            : (data.typewriterTexts || '').split('\n').filter(t => t.trim());
        
        const typewriterList = document.getElementById('typewriterList');
        typewriterList.innerHTML = '';
        typewriterTexts.forEach(text => this.addTypewriterItem(text));
        
        // Load paragraphs as array
        let paragraphs = [];
        if (Array.isArray(data.paragraphs)) {
            paragraphs = data.paragraphs;
        } else {
            // Convert from old format (aboutP1, aboutP2, etc.)
            for (let i = 1; i <= 10; i++) {
                if (data[`aboutP${i}`]) {
                    paragraphs.push(data[`aboutP${i}`]);
                }
            }
        }
        
        const paragraphsList = document.getElementById('paragraphsList');
        paragraphsList.innerHTML = '';
        paragraphs.forEach(text => this.addParagraphItem(text));
    },
    
    getDefaultAboutData() {
        return {
            profileImage: 'assets/me.webp',
            fullName: 'Ahmed Abdelrahman',
            typewriterTexts: ['Ahmed Abdelrahman', 'Flutter Developer'],
            paragraphs: [
                "Hello! I'm <strong class=\"gradient-text\">Ahmed Abdelrahman</strong>, a passionate Flutter developer with a strong foundation in building cross-platform mobile applications.",
                "I specialize in creating beautiful, responsive, and performant mobile apps using Flutter and Dart. My experience spans across various domains including e-commerce, social media, education, and productivity applications.",
                "I'm constantly learning and staying up-to-date with the latest technologies and best practices in mobile development. I believe in writing clean, maintainable code and creating exceptional user experiences.",
                "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community."
            ]
        };
    },
    
    addTypewriterItem(text = '') {
        const list = document.getElementById('typewriterList');
        const item = document.createElement('div');
        item.className = 'dynamic-list-item';
        item.innerHTML = `
            <input type="text" value="${this.escapeHtml(text)}" placeholder="Enter typewriter text...">
            <button type="button" class="btn-delete" onclick="Dashboard.removeListItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        list.appendChild(item);
        
        // Add change listener for auto-save
        item.querySelector('input').addEventListener('change', () => this.saveAbout());
    },
    
    addParagraphItem(text = '') {
        const list = document.getElementById('paragraphsList');
        const item = document.createElement('div');
        item.className = 'dynamic-list-item';
        item.innerHTML = `
            <textarea rows="3" placeholder="Enter paragraph text...">${this.escapeHtml(text)}</textarea>
            <button type="button" class="btn-delete" onclick="Dashboard.removeListItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        list.appendChild(item);
        
        // Add change listener for auto-save
        item.querySelector('textarea').addEventListener('change', () => this.saveAbout());
    },
    
    removeListItem(button) {
        const item = button.closest('.dynamic-list-item');
        const isTypewriter = item.closest('#typewriterList') !== null;
        const itemType = isTypewriter ? 'Typewriter Text' : 'Paragraph';
        
        this.showDeleteDialog(`Delete ${itemType}?`, `This ${itemType.toLowerCase()} will be permanently removed.`, () => {
            item.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                item.remove();
                this.saveAbout();
            }, 300);
        });
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Field validation helpers (Flutter-like)
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Add error class
        formGroup.classList.add('has-error');
        field.classList.add('has-error');
        
        // Remove existing error message if any
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert after the field or input-with-btn container
        const inputContainer = field.closest('.input-with-btn') || field;
        inputContainer.insertAdjacentElement('afterend', errorDiv);
        
        // Scroll field into view
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        field.focus();
    },
    
    showListError(listId, message) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        const formGroup = list.closest('.form-group');
        if (!formGroup) return;
        
        // Add error class
        formGroup.classList.add('has-error');
        list.classList.add('has-error');
        
        // Remove existing error message if any
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add error message after the add button
        const addButton = formGroup.querySelector('.btn-outline');
        if (addButton) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            addButton.insertAdjacentElement('afterend', errorDiv);
        }
        
        // Scroll list into view
        list.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    
    clearListError(listId) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        const formGroup = list.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('has-error');
        list.classList.remove('has-error');
        
        const errorDiv = formGroup.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    },
    
    clearAllFieldErrors() {
        document.querySelectorAll('.form-group.has-error').forEach(group => {
            group.classList.remove('has-error');
        });
        document.querySelectorAll('.has-error').forEach(el => {
            el.classList.remove('has-error');
        });
        document.querySelectorAll('.field-error').forEach(el => {
            el.remove();
        });
    },

    // Get proper image source (handles both absolute URLs and relative paths)
    getImageSrc(path) {
        if (!path) return '../icons/portfolio.png';
        // If it's already an absolute URL, return as is
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        // Otherwise, prepend ../ for relative paths
        return '../' + path;
    },
    
    // Modal dynamic list helpers
    addModalListItem(listId, placeholder = '') {
        const list = document.getElementById(listId);
        const item = document.createElement('div');
        item.className = 'modal-dynamic-item';
        item.innerHTML = `
            <input type="text" value="" placeholder="${placeholder}">
            <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
        `;
        list.appendChild(item);
        
        const input = item.querySelector('input');
        input.focus();
        
        // Make screenshot fields clickable file pickers
        if (listId === 'modalScreenshotsList' && typeof UploadService !== 'undefined') {
            UploadService.makeFilePickerInput(input, 'image/*');
        }
    },
    
    removeModalListItem(button) {
        const item = button.closest('.modal-dynamic-item');
        const list = item.parentElement;
        let itemType = 'Item';
        
        // Lists that require at least one item
        const requiredLists = ['modalTechList', 'modalPackagesList', 'modalFeaturesList'];
        
        if (list.id === 'modalTechList') itemType = 'Technology';
        else if (list.id === 'modalPackagesList') itemType = 'Package';
        else if (list.id === 'modalFeaturesList') itemType = 'Feature';
        else if (list.id === 'modalScreenshotsList') itemType = 'Screenshot';
        
        // Check if this is a required list and if it's the last item
        if (requiredLists.includes(list.id)) {
            const itemCount = list.querySelectorAll('.modal-dynamic-item').length;
            if (itemCount <= 1) {
                this.showToast(`At least one ${itemType.toLowerCase()} is required`, 'error');
                return;
            }
        }
        
        this.showDeleteDialog(`Delete ${itemType}?`, `This ${itemType.toLowerCase()} will be removed from the list.`, () => {
            item.style.animation = 'fadeOut 0.2s ease forwards';
            setTimeout(() => item.remove(), 200);
        });
    },
    
    getModalListValues(listId) {
        const list = document.getElementById(listId);
        if (!list) return [];
        const inputs = list.querySelectorAll('.modal-dynamic-item input');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value);
    },
    
    async saveAbout() {
        // Clear previous errors
        this.clearFieldError('profileImage');
        this.clearFieldError('fullName');
        
        const profileImageInput = document.getElementById('profileImage');
        let profileImage = profileImageInput.value.trim();
        const fullName = document.getElementById('fullName').value.trim();
        
        // Check for pending file upload
        const hasPendingFile = typeof UploadService !== 'undefined' && UploadService.hasPendingFile(profileImageInput.id);
        
        // Validation (before upload)
        let hasError = false;
        
        if (!profileImage && !hasPendingFile) {
            this.showFieldError('profileImage', 'Please provide a profile image path or upload a file');
            hasError = true;
        }
        
        if (!fullName) {
            this.showFieldError('fullName', 'Please enter your full name');
            hasError = true;
        }
        
        if (hasError) return;
        
        if (hasPendingFile) {
            UploadService.showLoading('Uploading profile image...');
            UploadService.updateProgress(10, 'Preparing upload...');
            
            try {
                // Get old image URL for deletion
                const currentData = this.getData(this.storageKeys.about);
                const oldImageUrl = currentData?.profileImage;
                
                // Delete old image from Cloudinary if it exists
                if (oldImageUrl) {
                    UploadService.updateProgress(20, 'Deleting old image...');
                    await UploadService.deleteFromCloudinary(oldImageUrl);
                }
                
                UploadService.updateProgress(40, 'Uploading to Cloudinary...');
                profileImage = await UploadService.uploadPendingFile(profileImageInput.id, 'portfolio');
                profileImageInput.value = profileImage;
                profileImageInput.style.color = '';
                UploadService.updateProgress(70, 'Saving to Firebase...');
            } catch (error) {
                UploadService.hideLoading();
                this.showToast('Upload failed: ' + error.message, 'error');
                return;
            }
        }
        
        // Collect typewriter texts
        const typewriterInputs = document.querySelectorAll('#typewriterList .dynamic-list-item input');
        const typewriterTexts = Array.from(typewriterInputs)
            .map(input => input.value.trim())
            .filter(text => text);
        
        // Collect paragraphs
        const paragraphInputs = document.querySelectorAll('#paragraphsList .dynamic-list-item textarea');
        const paragraphs = Array.from(paragraphInputs)
            .map(textarea => textarea.value.trim())
            .filter(text => text);
        
        const data = {
            profileImage: profileImage,
            fullName: fullName,
            typewriterTexts: typewriterTexts,
            paragraphs: paragraphs
        };
        
        this.saveData(this.storageKeys.about, data);
        
        // Sync to Firebase
        try {
            if (typeof UploadService !== 'undefined') {
                if (!hasPendingFile) {
                    UploadService.showLoading('Saving to Firebase...');
                }
                await UploadService.saveToFirebase('about', data);
                UploadService.updateProgress(100, 'Done!');
                setTimeout(() => {
                    UploadService.hideLoading();
                    this.showResultDialog('success', 'Saved Successfully', 'About section has been saved to the cloud.');
                }, 300);
            } else {
                this.showToast('About section saved locally', 'success');
            }
        } catch (error) {
            if (typeof UploadService !== 'undefined') UploadService.hideLoading();
            this.showResultDialog('error', 'Save Failed', 'Could not save to Firebase: ' + error.message);
        }
    },

    // ====================================
    
    loadCV() {
        const data = this.getData(this.storageKeys.cv) || {
            path: 'assets/CV.pdf',
            filename: 'Ahmed_Abdelrahman_CV.pdf'
        };
        
        document.getElementById('cvPath').value = data.path || '';
        document.getElementById('cvFilename').value = data.filename || '';
        document.getElementById('currentCvPath').textContent = data.path || 'assets/CV.pdf';
        document.getElementById('currentCvFilename').textContent = data.filename || 'CV.pdf';
    },
    
    async saveCV() {
        // Clear previous errors
        this.clearFieldError('cvPath');
        this.clearFieldError('cvFilename');
        
        const cvPathInput = document.getElementById('cvPath');
        let cvPath = cvPathInput.value.trim();
        const cvFilename = document.getElementById('cvFilename').value.trim();
        
        // Validation (check before upload)
        let hasError = false;
        
        const hasPendingFile = typeof UploadService !== 'undefined' && UploadService.hasPendingFile(cvPathInput.id);
        
        if (!cvPath && !hasPendingFile) {
            this.showFieldError('cvPath', 'Please provide a CV file path or upload a file');
            hasError = true;
        }
        
        if (!cvFilename) {
            this.showFieldError('cvFilename', 'Please enter a download filename');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Check for pending file upload
        if (hasPendingFile) {
            UploadService.showLoading('Uploading CV...');
            UploadService.updateProgress(10, 'Preparing upload...');
            
            try {
                // Get old CV URL for deletion
                const currentData = this.getData(this.storageKeys.cv);
                const oldCvUrl = currentData?.path;
                
                // Delete old CV from Cloudinary if it exists
                if (oldCvUrl) {
                    UploadService.updateProgress(20, 'Deleting old file...');
                    await UploadService.deleteFromCloudinary(oldCvUrl);
                }
                
                UploadService.updateProgress(40, 'Uploading to Cloudinary...');
                cvPath = await UploadService.uploadPendingFile(cvPathInput.id, 'portfolio/cv');
                
                // Add fl_attachment transformation for direct download
                if (cvPath && cvPath.includes('/upload/')) {
                    cvPath = cvPath.replace('/upload/', '/upload/fl_attachment/');
                }
                
                cvPathInput.value = cvPath;
                cvPathInput.style.color = '';
                UploadService.updateProgress(70, 'Saving to Firebase...');
            } catch (error) {
                UploadService.hideLoading();
                this.showToast('Upload failed: ' + error.message, 'error');
                return;
            }
        }
        
        const data = {
            path: cvPath,
            filename: cvFilename
        };
        
        this.saveData(this.storageKeys.cv, data);
        document.getElementById('currentCvPath').textContent = data.path;
        document.getElementById('currentCvFilename').textContent = data.filename;
        
        // Sync to Firebase
        try {
            if (typeof UploadService !== 'undefined') {
                if (!hasPendingFile) {
                    UploadService.showLoading('Saving to Firebase...');
                }
                await UploadService.saveToFirebase('cv', data);
                UploadService.updateProgress(100, 'Done!');
                setTimeout(() => {
                    UploadService.hideLoading();
                    this.showResultDialog('success', 'Saved Successfully', 'CV settings have been saved to the cloud.');
                }, 300);
            } else {
                this.showToast('CV settings saved locally', 'success');
            }
        } catch (error) {
            if (typeof UploadService !== 'undefined') UploadService.hideLoading();
            this.showResultDialog('error', 'Save Failed', 'Could not save to Firebase: ' + error.message);
        }
    },
    
    // ====================================
    // Tech Skills
    // ====================================
    
    getDefaultTechSkills() {
        return [
            { id: 1, name: 'Dart', image: 'assets/TechStack/dart.png' },
            { id: 2, name: 'Flutter', image: 'assets/TechStack/Flutter.png' },
            { id: 3, name: 'Firebase', image: 'assets/TechStack/firebase.png' },
            { id: 4, name: 'Kotlin', image: 'assets/TechStack/Kotlin.png' },
            { id: 5, name: 'C++', image: 'assets/TechStack/Cpp.png' },
            { id: 6, name: 'Qt', image: 'assets/TechStack/qt.png' },
            { id: 7, name: 'MySQL', image: 'assets/TechStack/mySql.png' },
            { id: 8, name: 'PostgreSQL', image: 'assets/TechStack/Postgresql.png' },
            { id: 9, name: 'SQLite', image: 'assets/TechStack/sqlite.png' },
            { id: 10, name: 'Supabase', image: 'assets/TechStack/supabase.png' },
            { id: 11, name: 'GitHub', image: 'assets/TechStack/github.png' },
            { id: 12, name: 'Postman', image: 'assets/TechStack/postman.png' },
            { id: 13, name: 'Figma', image: 'assets/TechStack/figma.png' },
            { id: 14, name: 'Android', image: 'assets/TechStack/android.png' },
            { id: 15, name: 'REST API', image: 'assets/TechStack/API.png' },
            { id: 16, name: 'GetX', image: 'assets/TechStack/getx.png' },
            { id: 17, name: 'GitHub Actions', image: 'assets/TechStack/githubActions.png' },
            { id: 18, name: 'Google Maps', image: 'assets/TechStack/google_maps.png' }
        ];
    },
    
    loadTechSkills() {
        let skills = this.getData(this.storageKeys.techSkills) || this.getDefaultTechSkills();
        if (!Array.isArray(skills)) skills = this.getDefaultTechSkills();
        this.renderTechSkills(skills);
    },
    
    renderTechSkills(skills) {
        const container = document.getElementById('techSkillsList');
        if (!Array.isArray(skills)) skills = [];
        
        if (skills.length === 0) {
            container.innerHTML = '<p class="empty-message">No tech skills added yet.</p>';
            return;
        }
        
        container.innerHTML = skills.map(skill => `
            <div class="item-card" data-id="${skill.id}">
                <div class="item-card-image">
                    <img src="${this.getImageSrc(skill.image)}" alt="${skill.name}" onerror="this.src='../icons/portfolio.png'">
                </div>
                <div class="item-card-info">
                    <h4>${skill.name}</h4>
                </div>
                <div class="item-card-actions">
                    <button class="btn btn-outline btn-small" onclick="Dashboard.editTechSkill(${skill.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="Dashboard.deleteTechSkill(${skill.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    editTechSkill(id) {
        const skills = this.getData(this.storageKeys.techSkills) || this.getDefaultTechSkills();
        const skill = skills.find(s => s.id === id);
        if (skill) {
            this.openModal('tech', skill);
        }
    },
    
    deleteTechSkill(id) {
        this.showDeleteDialog('Delete Tech Skill?', 'This skill will be permanently removed from your portfolio.', async () => {
            try {
                if (typeof UploadService !== 'undefined') {
                    UploadService.showLoading('Deleting...');
                }
                
                let skills = this.getData(this.storageKeys.techSkills) || this.getDefaultTechSkills();
                const skillToDelete = skills.find(s => s.id === id);
                
                // Delete image from Cloudinary if it exists
                if (skillToDelete?.image && typeof UploadService !== 'undefined') {
                    await UploadService.deleteFromCloudinary(skillToDelete.image);
                }
                
                skills = skills.filter(s => s.id !== id);
                this.saveData(this.storageKeys.techSkills, skills);
                this.renderTechSkills(skills);
                
                // Sync with Firebase
                await this.syncToFirebase('techSkills');
                
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('success', 'Deleted Successfully', 'Tech skill has been removed.');
            } catch (error) {
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('error', 'Delete Failed', 'Could not delete: ' + error.message);
            }
        });
    },
    
    saveTechSkill(formData) {
        let skills = this.getData(this.storageKeys.techSkills) || this.getDefaultTechSkills();
        
        if (this.currentEditItem) {
            // Update existing
            const index = skills.findIndex(s => s.id === this.currentEditItem.id);
            if (index !== -1) {
                skills[index] = { ...this.currentEditItem, ...formData };
            }
        } else {
            // Add new
            const newId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1;
            skills.push({ id: newId, ...formData });
        }
        
        this.saveData(this.storageKeys.techSkills, skills);
        this.renderTechSkills(skills);
        this.closeModal();
    },
    
    // ====================================
    // Soft Skills
    // ====================================
    
    getDefaultSoftSkills() {
        return [
            { id: 1, name: 'Teamwork', percentage: 96, color: '#FFC107' },
            { id: 2, name: 'Leadership', percentage: 98, color: '#2196F3' },
            { id: 3, name: 'Problem Solving', percentage: 95, color: '#795548' },
            { id: 4, name: 'Time Management', percentage: 92, color: '#009688' },
            { id: 5, name: 'Mentoring', percentage: 90, color: '#E91E63' },
            { id: 6, name: 'Communication', percentage: 94, color: '#FF9800' }
        ];
    },
    
    loadSoftSkills() {
        let skills = this.getData(this.storageKeys.softSkills) || this.getDefaultSoftSkills();
        if (!Array.isArray(skills)) skills = this.getDefaultSoftSkills();
        this.renderSoftSkills(skills);
    },
    
    renderSoftSkills(skills) {
        const container = document.getElementById('softSkillsList');
        if (!Array.isArray(skills)) skills = [];
        
        if (skills.length === 0) {
            container.innerHTML = '<p class="empty-message">No soft skills added yet.</p>';
            return;
        }
        
        container.innerHTML = skills.map(skill => `
            <div class="list-item" data-id="${skill.id}">
                <div class="list-item-info">
                    <span class="list-item-name">${skill.name}</span>
                    <div class="list-item-progress">
                        <div class="list-item-progress-bar" style="width: ${skill.percentage}%; background: ${skill.color || 'var(--gradient-start)'}"></div>
                    </div>
                    <span class="list-item-value">${skill.percentage}%</span>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-outline btn-small" onclick="Dashboard.editSoftSkill(${skill.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="Dashboard.deleteSoftSkill(${skill.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    editSoftSkill(id) {
        const skills = this.getData(this.storageKeys.softSkills) || this.getDefaultSoftSkills();
        const skill = skills.find(s => s.id === id);
        if (skill) {
            this.openModal('soft', skill);
        }
    },
    
    deleteSoftSkill(id) {
        this.showDeleteDialog('Delete Soft Skill?', 'This skill will be permanently removed from your portfolio.', async () => {
            try {
                if (typeof UploadService !== 'undefined') {
                    UploadService.showLoading('Deleting...');
                }
                
                let skills = this.getData(this.storageKeys.softSkills) || this.getDefaultSoftSkills();
                skills = skills.filter(s => s.id !== id);
                this.saveData(this.storageKeys.softSkills, skills);
                this.renderSoftSkills(skills);
                
                // Sync with Firebase
                await this.syncToFirebase('softSkills');
                
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('success', 'Deleted Successfully', 'Soft skill has been removed.');
            } catch (error) {
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('error', 'Delete Failed', 'Could not delete: ' + error.message);
            }
        });
    },
    
    saveSoftSkill(formData) {
        let skills = this.getData(this.storageKeys.softSkills) || this.getDefaultSoftSkills();
        
        if (this.currentEditItem) {
            const index = skills.findIndex(s => s.id === this.currentEditItem.id);
            if (index !== -1) {
                skills[index] = { ...this.currentEditItem, ...formData };
            }
        } else {
            const newId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1;
            skills.push({ id: newId, ...formData });
        }
        
        this.saveData(this.storageKeys.softSkills, skills);
        this.renderSoftSkills(skills);
        this.closeModal();
    },
    
    // ====================================
    // Language Skills
    // ====================================
    
    getDefaultLangSkills() {
        return [
            { id: 1, name: 'Arabic', level: 'Native', percentage: 100, color: '#3F51B5' },
            { id: 2, name: 'English', level: 'Fluent', percentage: 95, color: '#9C27B0' }
        ];
    },
    
    loadLangSkills() {
        let skills = this.getData(this.storageKeys.langSkills) || this.getDefaultLangSkills();
        if (!Array.isArray(skills)) skills = this.getDefaultLangSkills();
        this.renderLangSkills(skills);
    },
    
    renderLangSkills(skills) {
        const container = document.getElementById('langSkillsList');
        if (!Array.isArray(skills)) skills = [];
        
        if (skills.length === 0) {
            container.innerHTML = '<p class="empty-message">No language skills added yet.</p>';
            return;
        }
        
        container.innerHTML = skills.map(skill => `
            <div class="list-item" data-id="${skill.id}">
                <div class="list-item-info">
                    <span class="list-item-name">${skill.name}</span>
                    <span style="color: var(--text-muted); margin-right: 16px;">${skill.level}</span>
                    <div class="list-item-progress">
                        <div class="list-item-progress-bar" style="width: ${skill.percentage}%; background: ${skill.color || 'var(--gradient-start)'}"></div>
                    </div>
                    <span class="list-item-value">${skill.percentage}%</span>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-outline btn-small" onclick="Dashboard.editLangSkill(${skill.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="Dashboard.deleteLangSkill(${skill.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    editLangSkill(id) {
        const skills = this.getData(this.storageKeys.langSkills) || this.getDefaultLangSkills();
        const skill = skills.find(s => s.id === id);
        if (skill) {
            this.openModal('lang', skill);
        }
    },
    
    deleteLangSkill(id) {
        this.showDeleteDialog('Delete Language?', 'This language will be permanently removed from your portfolio.', async () => {
            try {
                if (typeof UploadService !== 'undefined') {
                    UploadService.showLoading('Deleting...');
                }
                
                let skills = this.getData(this.storageKeys.langSkills) || this.getDefaultLangSkills();
                skills = skills.filter(s => s.id !== id);
                this.saveData(this.storageKeys.langSkills, skills);
                this.renderLangSkills(skills);
                
                // Sync with Firebase
                await this.syncToFirebase('langSkills');
                
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('success', 'Deleted Successfully', 'Language has been removed.');
            } catch (error) {
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('error', 'Delete Failed', 'Could not delete: ' + error.message);
            }
        });
    },
    
    saveLangSkill(formData) {
        let skills = this.getData(this.storageKeys.langSkills) || this.getDefaultLangSkills();
        
        if (this.currentEditItem) {
            const index = skills.findIndex(s => s.id === this.currentEditItem.id);
            if (index !== -1) {
                skills[index] = { ...this.currentEditItem, ...formData };
            }
        } else {
            const newId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1;
            skills.push({ id: newId, ...formData });
        }
        
        this.saveData(this.storageKeys.langSkills, skills);
        this.renderLangSkills(skills);
        this.closeModal();
    },
    
    // ====================================
    // Projects
    // ====================================
    
    getDefaultProjects() {
        return [
            {
                id: 'uccd',
                title: 'UCCD - Courses Management System',
                description: 'A comprehensive university course management system with role-based access control. It allows administrators to manage courses, instructors can create and manage content, and students can enroll and track their progress.',
                image: 'assets/uccd/UCCDLOGO.png',
                technologies: ['Flutter', 'Dart', 'Firebase', 'Bloc', 'Clean Architecture'],
                packages: ['flutter_bloc', 'firebase_core', 'firebase_auth', 'cloud_firestore', 'get_it', 'dartz', 'equatable'],
                features: ['Role-based access control (Admin, Instructor, Student)', 'Course creation and management', 'Student enrollment system', 'Progress tracking and analytics', 'Real-time notifications', 'Offline support with local caching'],
                screenshots: ['assets/uccd/1.jpg', 'assets/uccd/2.jpg', 'assets/uccd/3.jpg', 'assets/uccd/4.jpg', 'assets/uccd/5.jpg', 'assets/uccd/6.jpg'],
                github: 'https://github.com/AhmedAbdElrahman117/uccd',
                store: null
            },
            {
                id: 'chat',
                title: 'Chat App',
                description: 'A real-time peer-to-peer chat application built with Flutter and Firebase. Features instant messaging, online status, typing indicators, and media sharing capabilities.',
                image: 'assets/chat/logo.png',
                technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'MVVM'],
                packages: ['firebase_core', 'firebase_auth', 'cloud_firestore', 'firebase_storage', 'provider', 'image_picker', 'cached_network_image'],
                features: ['Real-time messaging', 'Online/Offline status indicators', 'Typing indicators', 'Image and file sharing', 'Push notifications', 'Message read receipts'],
                screenshots: ['assets/chat/1.png', 'assets/chat/2.png', 'assets/chat/3.png', 'assets/chat/4.png'],
                github: 'https://github.com/AhmedAbdElrahman117/chat-app',
                store: null
            },
            {
                id: 'qurany',
                title: 'Qurany',
                description: 'A beautiful Quran application with audio playback, translations, and bookmarking features. Designed with a focus on user experience and accessibility.',
                image: 'assets/qurany/Logo.png',
                technologies: ['Flutter', 'Dart', 'SQLite', 'Bloc', 'API Integration'],
                packages: ['flutter_bloc', 'sqflite', 'just_audio', 'audio_session', 'shared_preferences', 'dio'],
                features: ['Complete Quran text with Tajweed', 'Multiple reciters audio', 'Translations in multiple languages', 'Bookmarking and notes', 'Search functionality', 'Daily verse notifications'],
                screenshots: ['assets/qurany/1.png', 'assets/qurany/2.png', 'assets/qurany/3.png', 'assets/qurany/4.png'],
                github: 'https://github.com/AhmedAbdElrahman117/qurany',
                store: null
            },
            {
                id: 'attend_sys',
                title: 'Attendance System',
                description: 'A GPS-based employee attendance tracking system. Employees can check in and out using their location, and managers can monitor attendance records and generate reports.',
                image: 'assets/attend_sys/icon.png',
                technologies: ['Flutter', 'Dart', 'Supabase', 'Bloc', 'GPS'],
                packages: ['flutter_bloc', 'supabase_flutter', 'geolocator', 'google_maps_flutter', 'workmanager', 'fl_chart'],
                features: ['GPS-based check-in/check-out', 'Geofencing for location verification', 'Attendance history and reports', 'Leave management', 'Manager dashboard', 'Export reports to PDF/Excel'],
                screenshots: ['assets/attend_sys/1.png', 'assets/attend_sys/2.png', 'assets/attend_sys/3.png'],
                github: 'https://github.com/AhmedAbdElrahman117/attendance-system',
                store: null
            },
            {
                id: 'auth',
                title: 'Auth App',
                description: 'An authentication application demonstrating various login methods including email/password, Google Sign-In, Facebook Login, and phone authentication.',
                image: 'assets/auth/logo.png',
                technologies: ['Flutter', 'Dart', 'Firebase', 'Provider'],
                packages: ['firebase_auth', 'google_sign_in', 'flutter_facebook_auth', 'provider', 'flutter_secure_storage'],
                features: ['Email/Password authentication', 'Google Sign-In', 'Facebook Login', 'Phone number authentication', 'Password reset functionality', 'Secure token storage'],
                screenshots: ['assets/auth/1.png', 'assets/auth/2.png', 'assets/auth/3.png'],
                github: 'https://github.com/AhmedAbdElrahman117/auth-app',
                store: null
            },
            {
                id: 'my_news',
                title: 'News App',
                description: 'A news aggregator application that fetches news from various sources. Users can browse by categories, search for specific topics, and bookmark articles for later reading.',
                image: 'assets/my_news/icon.png',
                technologies: ['Flutter', 'Dart', 'REST API', 'Bloc', 'Hive'],
                packages: ['flutter_bloc', 'dio', 'hive', 'cached_network_image', 'webview_flutter', 'share_plus'],
                features: ['Browse news by categories', 'Search functionality', 'Bookmark articles', 'Share articles', 'Offline reading mode', 'Dark/Light theme support'],
                screenshots: ['assets/my_news/1.png'],
                github: 'https://github.com/AhmedAbdElrahman117/news-app',
                store: null
            }
        ];
    },
    
    loadProjects() {
        let projects = this.getData(this.storageKeys.projects) || this.getDefaultProjects();
        if (!Array.isArray(projects)) {
            projects = this.getDefaultProjects();
        }
        this.renderProjects(projects);
    },
    
    renderProjects(projects) {
        const container = document.getElementById('projectsList');
        
        // Safety check - ensure projects is an array
        if (!Array.isArray(projects)) {
            projects = [];
        }
        
        if (projects.length === 0) {
            container.innerHTML = '<p class="empty-message">No projects added yet.</p>';
            return;
        }
        
        container.innerHTML = projects.map(project => `
            <div class="item-card" data-id="${project.id}">
                <div class="item-card-image large">
                    <img src="${this.getImageSrc(project.image)}" alt="${project.title}" onerror="this.src='../icons/portfolio.png'">
                </div>
                <div class="item-card-info">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                </div>
                <div class="item-card-actions">
                    <button class="btn btn-outline btn-small" onclick="Dashboard.editProject('${project.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="Dashboard.deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    editProject(id) {
        const projects = this.getData(this.storageKeys.projects) || this.getDefaultProjects();
        const project = projects.find(p => p.id === id);
        if (project) {
            this.openModal('project', project);
        }
    },
    
    deleteProject(id) {
        this.showDeleteDialog('Delete Project?', 'This project and all its details will be permanently removed.', async () => {
            try {
                if (typeof UploadService !== 'undefined') {
                    UploadService.showLoading('Deleting project...');
                }
                
                let projects = this.getData(this.storageKeys.projects) || this.getDefaultProjects();
                const projectToDelete = projects.find(p => p.id === id);
                
                // Delete files from Cloudinary
                if (projectToDelete && typeof UploadService !== 'undefined') {
                    const urlsToDelete = [];
                    if (projectToDelete.image) urlsToDelete.push(projectToDelete.image);
                    if (projectToDelete.screenshots?.length) {
                        urlsToDelete.push(...projectToDelete.screenshots);
                    }
                    if (urlsToDelete.length > 0) {
                        await UploadService.deleteMultipleFromCloudinary(urlsToDelete);
                    }
                }
                
                projects = projects.filter(p => p.id !== id);
                this.saveData(this.storageKeys.projects, projects);
                this.renderProjects(projects);
                
                // Sync with Firebase
                await this.syncToFirebase('projects');
                
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('success', 'Deleted Successfully', 'Project has been removed.');
            } catch (error) {
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('error', 'Delete Failed', 'Could not delete: ' + error.message);
            }
        });
    },
    
    saveProject(formData) {
        let projects = this.getData(this.storageKeys.projects) || this.getDefaultProjects();
        
        if (this.currentEditItem) {
            const index = projects.findIndex(p => p.id === this.currentEditItem.id);
            if (index !== -1) {
                projects[index] = { ...this.currentEditItem, ...formData };
            }
        } else {
            const newId = formData.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
            projects.push({ id: newId, ...formData });
        }
        
        this.saveData(this.storageKeys.projects, projects);
        this.renderProjects(projects);
        this.closeModal();
    },
    
    // ====================================
    // Certificates
    // ====================================
    
    getDefaultCertificates() {
        return [
            { id: 1, title: 'Dart & Flutter Beginner', image: 'assets/Certificates/beginner.jpg', url: 'https://www.udemy.com/certificate/UC-12345' },
            { id: 2, title: 'Bloc & MVVM', image: 'assets/Certificates/BlocAndMVVM.jpg', url: 'https://www.udemy.com/certificate/UC-12346' },
            { id: 3, title: 'Git & GitHub', image: 'assets/Certificates/gitAndGithub.jpg', url: 'https://www.udemy.com/certificate/UC-12347' },
            { id: 4, title: 'Payment Integration', image: 'assets/Certificates/paymentIntegration.jpg', url: 'https://www.udemy.com/certificate/UC-12348' },
            { id: 5, title: 'Responsive UI', image: 'assets/Certificates/responsiveUI.jpg', url: 'https://www.udemy.com/certificate/UC-12349' },
            { id: 6, title: 'Clean Architecture', image: 'assets/Certificates/CleanArchitecture.jpg', url: 'https://www.udemy.com/certificate/UC-12350' }
        ];
    },
    
    loadCertificates() {
        let certs = this.getData(this.storageKeys.certificates) || this.getDefaultCertificates();
        if (!Array.isArray(certs)) certs = this.getDefaultCertificates();
        this.renderCertificates(certs);
    },
    
    renderCertificates(certs) {
        const container = document.getElementById('certificatesList');
        if (!Array.isArray(certs)) certs = [];
        
        if (certs.length === 0) {
            container.innerHTML = '<p class="empty-message">No certificates added yet.</p>';
            return;
        }
        
        container.innerHTML = certs.map(cert => `
            <div class="item-card" data-id="${cert.id}">
                <div class="item-card-image large">
                    <img src="${this.getImageSrc(cert.image)}" alt="${cert.title}" onerror="this.src='../icons/portfolio.png'">
                </div>
                <div class="item-card-info">
                    <h4>${cert.title}</h4>
                </div>
                <div class="item-card-actions">
                    <button class="btn btn-outline btn-small" onclick="Dashboard.editCertificate(${cert.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="Dashboard.deleteCertificate(${cert.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    editCertificate(id) {
        const certs = this.getData(this.storageKeys.certificates) || this.getDefaultCertificates();
        const cert = certs.find(c => c.id === id);
        if (cert) {
            this.openModal('certificate', cert);
        }
    },
    
    deleteCertificate(id) {
        this.showDeleteDialog('Delete Certificate?', 'This certificate will be permanently removed from your portfolio.', async () => {
            try {
                if (typeof UploadService !== 'undefined') {
                    UploadService.showLoading('Deleting...');
                }
                
                let certs = this.getData(this.storageKeys.certificates) || this.getDefaultCertificates();
                const certToDelete = certs.find(c => c.id === id);
                
                // Delete image from Cloudinary if it exists
                if (certToDelete?.image && typeof UploadService !== 'undefined') {
                    await UploadService.deleteFromCloudinary(certToDelete.image);
                }
                
                certs = certs.filter(c => c.id !== id);
                this.saveData(this.storageKeys.certificates, certs);
                this.renderCertificates(certs);
                
                // Sync with Firebase
                await this.syncToFirebase('certificates');
                
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('success', 'Deleted Successfully', 'Certificate has been removed.');
            } catch (error) {
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('error', 'Delete Failed', 'Could not delete: ' + error.message);
            }
        });
    },
    
    saveCertificate(formData) {
        let certs = this.getData(this.storageKeys.certificates) || this.getDefaultCertificates();
        
        if (this.currentEditItem) {
            const index = certs.findIndex(c => c.id === this.currentEditItem.id);
            if (index !== -1) {
                certs[index] = { ...this.currentEditItem, ...formData };
            }
        } else {
            const newId = certs.length > 0 ? Math.max(...certs.map(c => c.id)) + 1 : 1;
            certs.push({ id: newId, ...formData });
        }
        
        this.saveData(this.storageKeys.certificates, certs);
        this.renderCertificates(certs);
        this.closeModal();
    },
    
    // ====================================
    // Services
    // ====================================
    
    getDefaultServices() {
        return [
            { id: 1, title: 'Cross-Platform Mobile App Development', description: 'Building beautiful, high-performance mobile applications for both iOS and Android using Flutter framework.', icon: 'fas fa-mobile-alt' },
            { id: 2, title: 'UI/UX Implementation', description: 'Transforming design mockups into pixel-perfect, responsive user interfaces with smooth animations and interactions.', icon: 'fas fa-paint-brush' },
            { id: 3, title: 'Performance Optimization', description: 'Optimizing app performance for faster load times, smoother animations, and better battery efficiency.', icon: 'fas fa-tachometer-alt' },
            { id: 4, title: 'Payment Integration', description: 'Integrating secure payment gateways including Stripe, PayPal, and local payment methods into mobile applications.', icon: 'fas fa-credit-card' },
            { id: 5, title: 'App Maintenance & Support', description: 'Providing ongoing maintenance, bug fixes, feature updates, and technical support for existing applications.', icon: 'fas fa-wrench' },
            { id: 6, title: 'Deployment & Localization', description: 'Publishing apps to Google Play Store and Apple App Store with multi-language support and regional adaptations.', icon: 'fas fa-globe' }
        ];
    },
    
    loadServices() {
        let services = this.getData(this.storageKeys.services) || this.getDefaultServices();
        if (!Array.isArray(services)) services = this.getDefaultServices();
        this.renderServices(services);
    },
    
    renderServices(services) {
        const container = document.getElementById('servicesList');
        if (!Array.isArray(services)) services = [];
        
        if (services.length === 0) {
            container.innerHTML = '<p class="empty-message">No services added yet.</p>';
            return;
        }
        
        container.innerHTML = services.map(service => `
            <div class="item-card" data-id="${service.id}">
                <div class="item-card-icon">
                    <i class="${service.icon || 'fas fa-cog'}"></i>
                </div>
                <div class="item-card-info">
                    <h4>${service.title}</h4>
                    <p class="item-card-description">${service.description.substring(0, 80)}...</p>
                </div>
                <div class="item-card-actions">
                    <button class="btn btn-outline btn-small" onclick="Dashboard.editService(${service.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="Dashboard.deleteService(${service.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    editService(id) {
        const services = this.getData(this.storageKeys.services) || this.getDefaultServices();
        const service = services.find(s => s.id === id);
        if (service) {
            this.openModal('service', service);
        }
    },
    
    deleteService(id) {
        this.showDeleteDialog('Delete Service?', 'This service will be permanently removed from your portfolio.', async () => {
            try {
                if (typeof UploadService !== 'undefined') {
                    UploadService.showLoading('Deleting...');
                }
                
                let services = this.getData(this.storageKeys.services) || this.getDefaultServices();
                services = services.filter(s => s.id !== id);
                this.saveData(this.storageKeys.services, services);
                this.renderServices(services);
                
                // Sync with Firebase
                await this.syncToFirebase('services');
                
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('success', 'Deleted Successfully', 'Service has been removed.');
            } catch (error) {
                if (typeof UploadService !== 'undefined') UploadService.hideLoading();
                this.showResultDialog('error', 'Delete Failed', 'Could not delete: ' + error.message);
            }
        });
    },
    
    saveService(formData) {
        let services = this.getData(this.storageKeys.services) || this.getDefaultServices();
        
        if (this.currentEditItem) {
            const index = services.findIndex(s => s.id === this.currentEditItem.id);
            if (index !== -1) {
                services[index] = { ...this.currentEditItem, ...formData };
            }
        } else {
            const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
            services.push({ id: newId, ...formData });
        }
        
        this.saveData(this.storageKeys.services, services);
        this.renderServices(services);
        this.closeModal();
    },
    
    // ====================================
    // Contact Info
    // ====================================
    
    loadContact() {
        const data = this.getData(this.storageKeys.contact) || {
            address: 'Egypt, Cairo',
            phone: '+20 100 051 2414',
            email: 'ahmedaboelnaga713@gmail.com'
        };
        
        document.getElementById('contactAddress').value = data.address || '';
        document.getElementById('contactPhone').value = data.phone || '';
        document.getElementById('contactEmail').value = data.email || '';
    },
    
    async saveContact() {
        // Clear previous errors
        this.clearFieldError('contactAddress');
        this.clearFieldError('contactPhone');
        this.clearFieldError('contactEmail');
        
        const address = document.getElementById('contactAddress').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        
        // Validation
        let hasError = false;
        
        if (!address) {
            this.showFieldError('contactAddress', 'Please enter your address');
            hasError = true;
        }
        
        if (!phone) {
            this.showFieldError('contactPhone', 'Please enter your phone number');
            hasError = true;
        }
        
        if (!email) {
            this.showFieldError('contactEmail', 'Please enter your email address');
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showFieldError('contactEmail', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (hasError) return;
        
        const data = {
            address: address,
            phone: phone,
            email: email
        };
        
        this.saveData(this.storageKeys.contact, data);
        
        try {
            if (typeof UploadService !== 'undefined') {
                UploadService.showLoading('Saving to Firebase...');
                await UploadService.saveToFirebase('contact', data);
                UploadService.hideLoading();
                this.showResultDialog('success', 'Saved Successfully', 'Contact info has been saved to the cloud.');
            } else {
                this.showToast('Contact info saved locally', 'success');
            }
        } catch (error) {
            if (typeof UploadService !== 'undefined') UploadService.hideLoading();
            this.showResultDialog('error', 'Save Failed', 'Could not save to Firebase: ' + error.message);
        }
    },
    
    // ====================================
    // Modal
    // ====================================
    
    openModal(type, item) {
        this.currentEditType = type;
        this.currentEditItem = item;
        
        const modal = document.getElementById('itemModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        let formHtml = '';
        const isEdit = item !== null;
        
        switch (type) {
            case 'tech':
                title.textContent = isEdit ? 'Edit Tech Skill' : 'Add Tech Skill';
                formHtml = `
                    <form id="modalForm">
                        <div class="form-group">
                            <label>Skill Name</label>
                            <input type="text" id="modalSkillName" required value="${item?.name || ''}" placeholder="e.g., Flutter, React, Python">
                            <small class="field-hint">Enter the technology or skill name</small>
                        </div>
                        <div class="form-group">
                            <label>Image Path or URL</label>
                            <input type="text" id="modalSkillImage" required value="${item?.image || ''}" placeholder="assets/TechStack/example.png or https://...">
                            <small class="field-hint">Local path (assets/...) or full URL to the skill icon</small>
                        </div>
                        <button type="submit" class="btn gradient-btn btn-full">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Skill
                        </button>
                    </form>
                `;
                break;
                
            case 'soft':
                title.textContent = isEdit ? 'Edit Soft Skill' : 'Add Soft Skill';
                formHtml = `
                    <form id="modalForm">
                        <div class="form-group">
                            <label>Skill Name</label>
                            <input type="text" id="modalSkillName" required value="${item?.name || ''}" placeholder="e.g., Teamwork, Leadership, Problem Solving">
                            <small class="field-hint">Enter the soft skill name</small>
                        </div>
                        <div class="form-group">
                            <label>Proficiency Percentage</label>
                            <input type="number" id="modalSkillPercentage" required min="0" max="100" value="${item?.percentage || 50}" placeholder="0-100">
                            <small class="field-hint">Your proficiency level from 0 to 100</small>
                        </div>
                        ${this.createColorInput('modalSkillColor', item?.color || '#2196F3', 'Progress Bar Color')}
                        <button type="submit" class="btn gradient-btn btn-full">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Skill
                        </button>
                    </form>
                `;
                break;
                
            case 'lang':
                title.textContent = isEdit ? 'Edit Language' : 'Add Language';
                formHtml = `
                    <form id="modalForm">
                        <div class="form-group">
                            <label>Language Name</label>
                            <input type="text" id="modalLangName" required value="${item?.name || ''}" placeholder="e.g., English, Arabic, German">
                            <small class="field-hint">Enter the language name</small>
                        </div>
                        <div class="form-group">
                            <label>Proficiency Level</label>
                            <select id="modalLangLevel" required>
                                <option value="" disabled ${!item?.level ? 'selected' : ''}>Select proficiency level</option>
                                <option value="Beginner" ${item?.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                                <option value="Elementary" ${item?.level === 'Elementary' ? 'selected' : ''}>Elementary</option>
                                <option value="Intermediate" ${item?.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                                <option value="Advanced" ${item?.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                                <option value="Fluent" ${item?.level === 'Fluent' ? 'selected' : ''}>Fluent</option>
                                <option value="Native" ${item?.level === 'Native' ? 'selected' : ''}>Native</option>
                            </select>
                            <small class="field-hint">Select your proficiency level in this language</small>
                        </div>
                        <div class="form-group">
                            <label>Proficiency Percentage</label>
                            <input type="number" id="modalLangPercentage" required min="0" max="100" value="${item?.percentage || 50}" placeholder="0-100">
                            <small class="field-hint">Your proficiency level from 0 to 100</small>
                        </div>
                        ${this.createColorInput('modalLangColor', item?.color || '#2196F3', 'Progress Bar Color')}
                        <button type="submit" class="btn gradient-btn btn-full">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Language
                        </button>
                    </form>
                `;
                break;
                
            case 'project':
                title.textContent = isEdit ? 'Edit Project' : 'Add Project';
                const features = item?.features || [];
                const screenshots = item?.screenshots || [];
                const technologies = item?.technologies || [];
                const packages = item?.packages || [];
                formHtml = `
                    <form id="modalForm">
                        <div class="form-group">
                            <label>Project Title</label>
                            <input type="text" id="modalProjectTitle" required value="${item?.title || ''}" placeholder="e.g., E-commerce App">
                            <small class="field-hint">Enter the name of your project</small>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="modalProjectDesc" required rows="3" placeholder="Describe what this project does...">${item?.description || ''}</textarea>
                            <small class="field-hint">Brief description of the project's purpose and features</small>
                        </div>
                        <div class="form-group">
                            <label>Image Path or URL</label>
                            <input type="text" id="modalProjectImage" required value="${item?.image || ''}" placeholder="assets/project/logo.png or https://...">
                            <small class="field-hint">Local path or URL to the project logo/thumbnail</small>
                        </div>
                        <div class="form-group">
                            <label>Technologies <span class="required-hint">(at least 1 required)</span></label>
                            <div class="modal-dynamic-list" id="modalTechList">
                                ${technologies.length > 0 ? technologies.map(tech => `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="${this.escapeHtml(tech)}" placeholder="e.g., Flutter">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `).join('') : `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="" placeholder="e.g., Flutter">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `}
                            </div>
                            <button type="button" class="btn btn-outline btn-small" onclick="Dashboard.addModalListItem('modalTechList', 'e.g., Flutter')">
                                <i class="fas fa-plus"></i> Add Technology
                            </button>
                        </div>
                        <div class="form-group">
                            <label>Packages <span class="required-hint">(at least 1 required)</span></label>
                            <div class="modal-dynamic-list" id="modalPackagesList">
                                ${packages.length > 0 ? packages.map(pkg => `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="${this.escapeHtml(pkg)}" placeholder="e.g., flutter_bloc">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `).join('') : `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="" placeholder="e.g., flutter_bloc">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `}
                            </div>
                            <button type="button" class="btn btn-outline btn-small" onclick="Dashboard.addModalListItem('modalPackagesList', 'e.g., flutter_bloc')">
                                <i class="fas fa-plus"></i> Add Package
                            </button>
                        </div>
                        <div class="form-group">
                            <label>Key Features <span class="required-hint">(at least 1 required)</span></label>
                            <div class="modal-dynamic-list" id="modalFeaturesList">
                                ${features.length > 0 ? features.map(feature => `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="${this.escapeHtml(feature)}" placeholder="e.g., User authentication">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `).join('') : `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="" placeholder="e.g., User authentication">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `}
                            </div>
                            <button type="button" class="btn btn-outline btn-small" onclick="Dashboard.addModalListItem('modalFeaturesList', 'e.g., User authentication')">
                                <i class="fas fa-plus"></i> Add Feature
                            </button>
                        </div>
                        <div class="form-group">
                            <label>Screenshots (optional)</label>
                            <div class="modal-dynamic-list" id="modalScreenshotsList">
                                ${screenshots.map(screenshot => `
                                    <div class="modal-dynamic-item">
                                        <input type="text" value="${this.escapeHtml(screenshot)}" placeholder="assets/project/1.png">
                                        <button type="button" class="btn-delete-modal" onclick="Dashboard.removeModalListItem(this)"><i class="fas fa-times"></i></button>
                                    </div>
                                `).join('') || ''}
                            </div>
                            <button type="button" class="btn btn-outline btn-small" onclick="Dashboard.addModalListItem('modalScreenshotsList', 'assets/project/1.png')">
                                <i class="fas fa-plus"></i> Add Screenshot
                            </button>
                        </div>
                        <div class="form-group">
                            <label>GitHub URL</label>
                            <input type="url" id="modalProjectGithub" value="${item?.github || ''}" placeholder="https://github.com/username/repo">
                            <small class="field-hint">Link to the project's GitHub repository</small>
                        </div>
                        <div class="form-group">
                            <label>Store URL (optional)</label>
                            <input type="url" id="modalProjectStore" value="${item?.store || ''}" placeholder="https://play.google.com/store/apps/...">
                            <small class="field-hint">Link to app store (Play Store, App Store, etc.)</small>
                        </div>
                        <button type="submit" class="btn gradient-btn btn-full">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Project
                        </button>
                    </form>
                `;
                break;
                
            case 'certificate':
                title.textContent = isEdit ? 'Edit Certificate' : 'Add Certificate';
                formHtml = `
                    <form id="modalForm">
                        <div class="form-group">
                            <label>Certificate Title</label>
                            <input type="text" id="modalCertTitle" required value="${item?.title || ''}" placeholder="e.g., Flutter Development Bootcamp">
                            <small class="field-hint">Name of the certificate or course</small>
                        </div>
                        <div class="form-group">
                            <label>Image Path or URL</label>
                            <input type="text" id="modalCertImage" required value="${item?.image || ''}" placeholder="assets/Certificates/example.jpg or https://...">
                            <small class="field-hint">Local path or URL to the certificate image</small>
                        </div>
                        <div class="form-group">
                            <label>Certificate URL</label>
                            <input type="url" id="modalCertUrl" required value="${item?.url || ''}" placeholder="https://www.udemy.com/certificate/...">
                            <small class="field-hint">Link to verify the certificate online</small>
                        </div>
                        <button type="submit" class="btn gradient-btn btn-full">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Certificate
                        </button>
                    </form>
                `;
                break;
                
            case 'service':
                title.textContent = isEdit ? 'Edit Service' : 'Add Service';
                formHtml = `
                    <form id="modalForm">
                        <div class="form-group">
                            <label>Service Title</label>
                            <input type="text" id="modalServiceTitle" required value="${item?.title || ''}" placeholder="e.g., Mobile App Development">
                            <small class="field-hint">Name of the service you offer</small>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="modalServiceDesc" required rows="3" placeholder="Describe what this service includes...">${item?.description || ''}</textarea>
                            <small class="field-hint">Brief description of the service</small>
                        </div>
                        <div class="form-group">
                            <label>Icon Class (Font Awesome)</label>
                            <input type="text" id="modalServiceIcon" required value="${item?.icon || ''}" placeholder="e.g., fas fa-mobile-alt">
                            <small class="field-hint">Font Awesome icon class. Browse icons at <a href="https://fontawesome.com/icons" target="_blank">fontawesome.com/icons</a></small>
                            <div class="icon-preview" id="serviceIconPreview">
                                <i class="${item?.icon || 'fas fa-cog'}"></i>
                                <span>Preview</span>
                            </div>
                        </div>
                        <button type="submit" class="btn gradient-btn btn-full">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Service
                        </button>
                    </form>
                `;
                break;
        }
        
        body.innerHTML = formHtml;
        modal.classList.add('show');
        
        // Initialize uploadable fields for this modal type
        if (typeof UploadService !== 'undefined') {
            UploadService.initModalFilePickerInputs(type);
        }
        
        // Bind form submission with validation
        const form = document.getElementById('modalForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(form)) {
                this.handleModalSubmit();
            }
        });
        
        // Clear errors on input
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) {
                    group.classList.remove('has-error');
                    input.classList.remove('has-error');
                    const error = group.querySelector('.field-error');
                    if (error) error.remove();
                    
                    // Also clear list errors if typing in a list item
                    const list = group.querySelector('.modal-dynamic-list');
                    if (list) {
                        list.classList.remove('has-error');
                    }
                }
            });
        });
        
        // Add icon preview update for service modal
        if (type === 'service') {
            const iconInput = document.getElementById('modalServiceIcon');
            const iconPreview = document.getElementById('serviceIconPreview');
            if (iconInput && iconPreview) {
                iconInput.addEventListener('input', () => {
                    const iconClass = iconInput.value.trim() || 'fas fa-cog';
                    iconPreview.innerHTML = `<i class="${iconClass}"></i><span>Preview</span>`;
                });
            }
        }
    },
    
    closeModal() {
        document.getElementById('itemModal').classList.remove('show');
        this.currentEditItem = null;
        this.currentEditType = null;
    },
    
    async handleModalSubmit() {
        let formData = {};
        
        // Show loading if there are pending files
        const hasPendingFiles = typeof UploadService !== 'undefined' && UploadService.pendingFiles.size > 0;
        if (hasPendingFiles) {
            UploadService.showLoading('Uploading files...');
            UploadService.updateProgress(10, 'Uploading to Cloudinary...');
        }
        
        try {
            // Clear previous errors
            this.clearAllFieldErrors();
            
            switch (this.currentEditType) {
                case 'tech':
                    // Validate required fields BEFORE any uploads
                    const techSkillName = document.getElementById('modalSkillName').value.trim();
                    const skillImageInput = document.getElementById('modalSkillImage');
                    const skillImageValue = skillImageInput.value.trim();
                    
                    if (!techSkillName) {
                        this.showFieldError('modalSkillName', 'Please enter a skill name');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (!skillImageValue && !UploadService.hasPendingFile(skillImageInput.id)) {
                        this.showFieldError('modalSkillImage', 'Please add an image for the skill');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    
                    let skillImage = skillImageValue;
                    
                    // Upload if pending and delete old file if editing
                    if (typeof UploadService !== 'undefined' && UploadService.hasPendingFile(skillImageInput.id)) {
                        // Delete old image from Cloudinary if editing
                        if (this.currentEditItem?.image) {
                            await UploadService.deleteFromCloudinary(this.currentEditItem.image);
                        }
                        skillImage = await UploadService.uploadPendingFile(skillImageInput.id, 'portfolio/techstack');
                    }
                    
                    formData = {
                        name: techSkillName,
                        image: skillImage
                    };
                    await this.saveTechSkillWithFirebase(formData);
                    break;
                    
                case 'soft':
                    // Validate required fields
                    const softSkillName = document.getElementById('modalSkillName').value.trim();
                    if (!softSkillName) {
                        this.showFieldError('modalSkillName', 'Please enter a skill name');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    
                    formData = {
                        name: softSkillName,
                        percentage: parseInt(document.getElementById('modalSkillPercentage').value),
                        color: this.getColorValue('modalSkillColor')
                    };
                    await this.saveSoftSkillWithFirebase(formData);
                    break;
                    
                case 'lang':
                    // Validate required fields
                    const langName = document.getElementById('modalLangName').value.trim();
                    if (!langName) {
                        this.showFieldError('modalLangName', 'Please enter a language name');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    
                    formData = {
                        name: langName,
                        level: document.getElementById('modalLangLevel').value,
                        percentage: parseInt(document.getElementById('modalLangPercentage').value),
                        color: this.getColorValue('modalLangColor')
                    };
                    await this.saveLangSkillWithFirebase(formData);
                    break;
                    
                case 'project':
                    // Validate required fields BEFORE any uploads
                    const projectTitle = document.getElementById('modalProjectTitle').value.trim();
                    const projectDesc = document.getElementById('modalProjectDesc').value.trim();
                    const projectImageInput = document.getElementById('modalProjectImage');
                    const projectImageValue = projectImageInput.value.trim();
                    const techValues = this.getModalListValues('modalTechList');
                    const packageValues = this.getModalListValues('modalPackagesList');
                    const featureValues = this.getModalListValues('modalFeaturesList');
                    
                    if (!projectTitle) {
                        this.showFieldError('modalProjectTitle', 'Please enter a project title');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (!projectDesc) {
                        this.showFieldError('modalProjectDesc', 'Please enter a project description');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (!projectImageValue && !UploadService.hasPendingFile(projectImageInput.id)) {
                        this.showFieldError('modalProjectImage', 'Please add an image for the project');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (techValues.length === 0) {
                        this.showListError('modalTechList', 'Please add at least one technology');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (packageValues.length === 0) {
                        this.showListError('modalPackagesList', 'Please add at least one package');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (featureValues.length === 0) {
                        this.showListError('modalFeaturesList', 'Please add at least one key feature');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    
                    let projectImage = projectImageValue;
                    
                    // Upload project image if pending and delete old file if editing
                    if (typeof UploadService !== 'undefined' && UploadService.hasPendingFile(projectImageInput.id)) {
                        // Delete old image from Cloudinary if editing
                        if (this.currentEditItem?.image) {
                            await UploadService.deleteFromCloudinary(this.currentEditItem.image);
                        }
                        projectImage = await UploadService.uploadPendingFile(projectImageInput.id, 'portfolio/projects');
                    }
                    
                    // Collect old screenshots that are being replaced (for deletion)
                    const oldScreenshots = this.currentEditItem?.screenshots || [];
                    
                    // Upload screenshot files if pending
                    const screenshotInputs = document.querySelectorAll('#modalScreenshotsList .modal-dynamic-item input');
                    const screenshots = [];
                    for (const input of screenshotInputs) {
                        let screenshotUrl = input.value.trim();
                        if (screenshotUrl) {
                            if (typeof UploadService !== 'undefined' && UploadService.hasPendingFile(input.id)) {
                                screenshotUrl = await UploadService.uploadPendingFile(input.id, 'portfolio/projects/screenshots');
                            }
                            screenshots.push(screenshotUrl);
                        }
                    }
                    
                    // Delete old screenshots that are no longer in the new list
                    if (typeof UploadService !== 'undefined' && oldScreenshots.length > 0) {
                        const screenshotsToDelete = oldScreenshots.filter(s => !screenshots.includes(s));
                        if (screenshotsToDelete.length > 0) {
                            await UploadService.deleteMultipleFromCloudinary(screenshotsToDelete);
                        }
                    }
                    
                    formData = {
                        title: projectTitle,
                        description: projectDesc,
                        image: projectImage,
                        technologies: techValues,
                        packages: packageValues,
                        features: featureValues,
                        screenshots: screenshots,
                        github: document.getElementById('modalProjectGithub').value || null,
                        store: document.getElementById('modalProjectStore').value || null
                    };
                    
                    await this.saveProjectWithFirebase(formData);
                    break;
                    
                case 'certificate':
                    // Validate required fields BEFORE any uploads
                    const certTitle = document.getElementById('modalCertTitle').value.trim();
                    const certImageInput = document.getElementById('modalCertImage');
                    const certImageValue = certImageInput.value.trim();
                    
                    if (!certTitle) {
                        this.showFieldError('modalCertTitle', 'Please enter a certificate title');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (!certImageValue && !UploadService.hasPendingFile(certImageInput.id)) {
                        this.showFieldError('modalCertImage', 'Please add an image for the certificate');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    
                    let certImage = certImageValue;
                    
                    // Upload if pending and delete old file if editing
                    if (typeof UploadService !== 'undefined' && UploadService.hasPendingFile(certImageInput.id)) {
                        // Delete old image from Cloudinary if editing
                        if (this.currentEditItem?.image) {
                            await UploadService.deleteFromCloudinary(this.currentEditItem.image);
                        }
                        certImage = await UploadService.uploadPendingFile(certImageInput.id, 'portfolio/certificates');
                    }
                    
                    formData = {
                        title: certTitle,
                        image: certImage,
                        url: document.getElementById('modalCertUrl').value
                    };
                    await this.saveCertificateWithFirebase(formData);
                    break;
                    
                case 'service':
                    // Validate required fields
                    const serviceTitle = document.getElementById('modalServiceTitle').value.trim();
                    const serviceDesc = document.getElementById('modalServiceDesc').value.trim();
                    const serviceIcon = document.getElementById('modalServiceIcon').value.trim();
                    
                    if (!serviceTitle) {
                        this.showFieldError('modalServiceTitle', 'Please enter a service title');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (!serviceDesc) {
                        this.showFieldError('modalServiceDesc', 'Please enter a service description');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    if (!serviceIcon) {
                        this.showFieldError('modalServiceIcon', 'Please enter an icon class');
                        if (hasPendingFiles) UploadService.hideLoading();
                        return;
                    }
                    
                    formData = {
                        title: serviceTitle,
                        description: serviceDesc,
                        icon: serviceIcon
                    };
                    await this.saveServiceWithFirebase(formData);
                    break;
            }
            
            if (hasPendingFiles) {
                UploadService.hideLoading();
            }
            
            // Show success dialog
            const itemType = this.currentEditType === 'tech' ? 'Tech Skill' :
                            this.currentEditType === 'soft' ? 'Soft Skill' :
                            this.currentEditType === 'lang' ? 'Language' :
                            this.currentEditType === 'project' ? 'Project' :
                            this.currentEditType === 'certificate' ? 'Certificate' :
                            this.currentEditType === 'service' ? 'Service' : 'Item';
            this.showResultDialog('success', 'Saved Successfully', `${itemType} has been saved to the cloud.`);
            
        } catch (error) {
            console.error('Save error:', error);
            if (typeof UploadService !== 'undefined') {
                UploadService.hideLoading();
            }
            this.showResultDialog('error', 'Save Failed', 'Could not save: ' + error.message);
        }
    },
    
    // Save methods with Firebase sync
    async saveTechSkillWithFirebase(formData) {
        this.saveTechSkill(formData);
        await this.syncToFirebase('techSkills');
    },
    
    async saveSoftSkillWithFirebase(formData) {
        this.saveSoftSkill(formData);
        await this.syncToFirebase('softSkills');
    },
    
    async saveLangSkillWithFirebase(formData) {
        this.saveLangSkill(formData);
        await this.syncToFirebase('langSkills');
    },
    
    async saveProjectWithFirebase(formData) {
        this.saveProject(formData);
        await this.syncToFirebase('projects');
    },
    
    async saveCertificateWithFirebase(formData) {
        this.saveCertificate(formData);
        await this.syncToFirebase('certificates');
    },
    
    async saveServiceWithFirebase(formData) {
        this.saveService(formData);
        await this.syncToFirebase('services');
    },
    
    async syncToFirebase(section) {
        if (typeof UploadService === 'undefined') return;
        
        const data = this.getData(this.storageKeys[section]);
        if (data) {
            await UploadService.saveToFirebase(section, data);
        }
    },
    
    // ====================================
    // Toast Notifications
    // ====================================
    
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // ====================================
    // Delete Confirmation Dialog
    // ====================================
    
    pendingDelete: null,
    
    showDeleteDialog(title, message, callback, confirmBtn = { icon: 'fa-trash', text: 'Delete' }) {
        const dialog = document.getElementById('deleteDialog');
        document.getElementById('deleteDialogTitle').textContent = title || 'Delete Item?';
        document.getElementById('deleteDialogMessage').textContent = message || 'Are you sure you want to delete this item? This action cannot be undone.';
        
        // Update confirm button text/icon
        const confirmBtnEl = document.getElementById('deleteDialogConfirm');
        confirmBtnEl.innerHTML = `<i class="fas ${confirmBtn.icon}"></i> ${confirmBtn.text}`;
        
        this.pendingDelete = callback;
        dialog.classList.add('show');
    },
    
    hideDeleteDialog() {
        const dialog = document.getElementById('deleteDialog');
        dialog.classList.remove('show');
        this.pendingDelete = null;
        
        // Reset confirm button to default
        const confirmBtnEl = document.getElementById('deleteDialogConfirm');
        confirmBtnEl.innerHTML = '<i class="fas fa-trash"></i> Delete';
    },
    
    bindDeleteDialog() {
        const dialog = document.getElementById('deleteDialog');
        const cancelBtn = document.getElementById('deleteDialogCancel');
        const confirmBtn = document.getElementById('deleteDialogConfirm');
        
        cancelBtn.addEventListener('click', () => this.hideDeleteDialog());
        
        confirmBtn.addEventListener('click', () => {
            if (this.pendingDelete) {
                this.pendingDelete();
            }
            this.hideDeleteDialog();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hideDeleteDialog();
            }
        });
    },
    
    // ====================================
    // Result Dialog (Success/Failure)
    // ====================================
    
    resultDialogCallback: null,
    
    showResultDialog(type, title, message, callback = null) {
        const dialog = document.getElementById('resultDialog');
        const icon = document.getElementById('resultDialogIcon');
        const titleEl = document.getElementById('resultDialogTitle');
        const messageEl = document.getElementById('resultDialogMessage');
        
        // Set icon based on type
        icon.className = `result-dialog-icon ${type}`;
        if (type === 'success') {
            icon.innerHTML = '<i class="fas fa-check-circle"></i>';
        } else {
            icon.innerHTML = '<i class="fas fa-times-circle"></i>';
        }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        this.resultDialogCallback = callback;
        
        dialog.classList.add('show');
    },
    
    hideResultDialog() {
        const dialog = document.getElementById('resultDialog');
        dialog.classList.remove('show');
        
        if (this.resultDialogCallback) {
            this.resultDialogCallback();
            this.resultDialogCallback = null;
        }
    },
    
    bindResultDialog() {
        const dialog = document.getElementById('resultDialog');
        const okBtn = document.getElementById('resultDialogOk');
        
        if (okBtn) {
            okBtn.addEventListener('click', () => this.hideResultDialog());
        }
        
        if (dialog) {
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    this.hideResultDialog();
                }
            });
        }
    },

    // ====================================
    // Form Validation
    // ====================================
    
    validateForm(form) {
        let isValid = true;
        const formGroups = form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            // Remove existing errors
            group.classList.remove('has-error');
            const existingError = group.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            const input = group.querySelector('input[required], textarea[required], select[required]');
            if (input && !input.value.trim()) {
                isValid = false;
                group.classList.add('has-error');
                
                const label = group.querySelector('label');
                const fieldName = label ? label.textContent.trim() : 'This field';
                
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = `${fieldName} is required`;
                group.appendChild(errorMsg);
            }
        });
        
        return isValid;
    },
    
    // ====================================
    // Hex Color Input Helpers
    // ====================================
    
    createColorInput(id, value = '#2196F3', label = 'Color') {
        return `
            <div class="form-group">
                <label>${label}</label>
                <div class="color-input-wrapper">
                    <div class="color-preview" id="${id}Preview" style="background: ${value}" onclick="document.getElementById('${id}Picker').click()"></div>
                    <input type="text" id="${id}" value="${value}" placeholder="#RRGGBB" maxlength="7" oninput="Dashboard.updateColorPreview('${id}')">
                    <input type="color" id="${id}Picker" class="color-picker-hidden" value="${value}" onchange="Dashboard.syncColorFromPicker('${id}')">
                </div>
                <small class="field-hint">Enter hex color code (e.g., #2196F3) or click the preview to pick</small>
            </div>
        `;
    },
    
    updateColorPreview(id) {
        const input = document.getElementById(id);
        const preview = document.getElementById(id + 'Preview');
        const picker = document.getElementById(id + 'Picker');
        
        let value = input.value.trim();
        if (!value.startsWith('#')) value = '#' + value;
        
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            preview.style.background = value;
            picker.value = value;
        }
    },
    
    syncColorFromPicker(id) {
        const input = document.getElementById(id);
        const preview = document.getElementById(id + 'Preview');
        const picker = document.getElementById(id + 'Picker');
        
        input.value = picker.value.toUpperCase();
        preview.style.background = picker.value;
    },
    
    getColorValue(id) {
        const input = document.getElementById(id);
        let value = input.value.trim();
        if (!value.startsWith('#')) value = '#' + value;
        return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#2196F3';
    }
};

// Make Dashboard available globally
window.Dashboard = Dashboard;
