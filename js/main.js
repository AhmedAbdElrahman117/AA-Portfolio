/* ====================================
   AA Portfolio - Main JavaScript
   ==================================== */

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawer');
const navLinks = document.querySelectorAll('.nav-link');
const drawerLinks = document.querySelectorAll('.drawer-link');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const contactForm = document.getElementById('contactForm');
const toastContainer = document.getElementById('toastContainer');
const typewriterElement = document.getElementById('typewriter');

// State
let currentTypewriterIndex = 0;
let isTyping = false;

// ====================================
// CV Download Function
// ====================================
function downloadCV() {
    const cvPath = 'assets/CV.pdf';
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = 'Ahmed_Abdelrahman_CV.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('CV download started!', 'success');
}

// Make it available globally
window.downloadCV = downloadCV;

// ====================================
// Splash Screen
// ====================================
function hideSplashScreen() {
    // Wait for all splash animations to complete (loader bar takes ~4s total)
    setTimeout(() => {
        splashScreen.classList.add('hide');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            initAnimations();
        }, 1000);
    }, 4200);
}

// ====================================
// Navigation
// ====================================
function initNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        drawer.classList.add('open');
        drawerOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close drawer
    const closeDrawerHandler = () => {
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    closeDrawerBtn.addEventListener('click', closeDrawerHandler);
    drawerOverlay.addEventListener('click', closeDrawerHandler);

    // Nav link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            scrollToSection(section);
            updateActiveNav(section);
        });
    });

    // Drawer link click handlers
    drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            scrollToSection(section);
            updateActiveNav(section);
            closeDrawerHandler();
        });
    });

    // Scroll spy - only updates when scrolling stops (debounced)
    let lastSection = null;
    
    const updateSectionOnScrollStop = debounce(() => {
        const sections = document.querySelectorAll('.section');
        const navHeight = 70;
        const scrollPosition = window.scrollY + navHeight + window.innerHeight / 3;
        
        let currentSection = null;
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
                break;
            }
        }
        
        if (currentSection && currentSection !== lastSection) {
            lastSection = currentSection;
            updateActiveNav(currentSection);
        }
    }, 80); // 150ms after scroll stops
    
    window.addEventListener('scroll', updateSectionOnScrollStop, { passive: true });
    
    // Navbar background change on scroll - lightweight
    window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
    
    // Background animation on slower interval
    window.addEventListener('scroll', debounce(updateBackgroundPosition, 150), { passive: true });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.offsetTop - navHeight;
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNav(sectionId) {
    navLinks.forEach(link => {
        const isActive = link.getAttribute('data-section') === sectionId;
        link.classList.toggle('active', isActive);
    });
    drawerLinks.forEach(link => {
        const isActive = link.getAttribute('data-section') === sectionId;
        link.classList.toggle('active', isActive);
    });
}

function handleScroll() {
    const sections = document.querySelectorAll('.section');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.scrollY + navHeight + window.innerHeight / 3;

    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    if (currentSection) {
        updateActiveNav(currentSection);
    }

    // Update background circles position based on scroll
    updateBackgroundPosition();
    
    // Update navbar background on scroll
    updateNavbarOnScroll();
}

// ====================================
// Navbar Scroll Effect
// ====================================
function updateNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.boxShadow = 'none';
    }
}

// ====================================
// Background Animation
// ====================================
function updateBackgroundPosition() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

    const circles = document.querySelectorAll('.bg-circle');
    circles.forEach((circle, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const offset = scrollPercent * 80 * direction;
        const yOffset = scrollPercent * 40 * (index % 3 === 0 ? -1 : 1);
        circle.style.transform = `translate(${offset}px, ${yOffset}px)`;
    });
}

// ====================================
// Typewriter Effect
// ====================================
function initTypewriter() {
    typeWriter();
}

function typeWriter() {
    if (isTyping) return;
    
    const text = typewriterTexts[currentTypewriterIndex];
    let charIndex = 0;
    isTyping = true;

    // Clear current text
    typewriterElement.textContent = '';

    // Type text
    const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
            typewriterElement.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeInterval);
            // Wait before erasing
            setTimeout(() => eraseText(text), 2000);
        }
    }, 100);
}

function eraseText(text) {
    let charIndex = text.length;

    const eraseInterval = setInterval(() => {
        if (charIndex > 0) {
            typewriterElement.textContent = text.substring(0, charIndex - 1);
            charIndex--;
        } else {
            clearInterval(eraseInterval);
            // Move to next text
            currentTypewriterIndex = (currentTypewriterIndex + 1) % typewriterTexts.length;
            isTyping = false;
            // Start typing next text
            setTimeout(typeWriter, 500);
        }
    }, 50);
}

// ====================================
// Dynamic Content Generation
// ====================================
function generateTechStack() {
    const techStackContainer = document.querySelector('.tech-stack');
    if (!techStackContainer) return;
    
    techStackContainer.innerHTML = techStackData.map((tech, index) => `
        <div class="tech-card animate-on-scroll" data-name="${tech.name}" style="--stagger: ${index}">
            <img src="${tech.image}" alt="${tech.name}" loading="lazy" onerror="this.style.display='none'">
            <span>${tech.name}</span>
        </div>
    `).join('');
}

function generateProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = Object.values(projectsData).map((project, index) => `
        <div class="project-card animate-on-scroll" data-project="${project.id}" style="--stagger: ${index}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><i class=\\'fas fa-image\\'></i></div>'">
            </div>
            <div class="project-info">
                <h3 class="gradient-text">${project.title.split(' - ')[0]}</h3>
                <p>${project.description.substring(0, 100)}...</p>
                <button class="btn btn-small gradient-btn view-details" data-project="${project.id}">
                    Details <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Check if device is touch-enabled (mobile)
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (window.matchMedia('(hover: none) and (pointer: coarse)').matches);
}

function generateCertificates() {
    const certificatesGrid = document.querySelector('.certificates-grid');
    if (!certificatesGrid) return;
    
    certificatesGrid.innerHTML = certificatesData.map((cert, index) => `
        <a href="${cert.url}" target="_blank" class="certificate-card animate-on-scroll" style="--stagger: ${index}" data-url="${cert.url}">
            <div class="certificate-image">
                <img src="${cert.image}" alt="${cert.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><i class=\\'fas fa-certificate\\'></i></div>'">
                <div class="certificate-overlay">
                    <span class="gradient-text">${cert.title}</span>
                    <span class="view-btn">View <i class="fas fa-external-link-alt"></i></span>
                </div>
            </div>
        </a>
    `).join('');

    // Add two-tap behavior for mobile
    if (isTouchDevice()) {
        initCertificateTouchBehavior();
    }
}

// Two-tap behavior for certificates on mobile
function initCertificateTouchBehavior() {
    const certificates = document.querySelectorAll('.certificate-card');
    let activeCertificate = null;

    certificates.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only apply on touch devices
            if (!isTouchDevice()) return;

            // If this card already has overlay shown, allow the link to open
            if (this.classList.contains('overlay-active')) {
                // Let the default link behavior happen
                return;
            }

            // Prevent default link behavior on first tap
            e.preventDefault();

            // Remove active state from previously active certificate
            if (activeCertificate && activeCertificate !== this) {
                activeCertificate.classList.remove('overlay-active');
            }

            // Show overlay on this certificate
            this.classList.add('overlay-active');
            activeCertificate = this;
        });
    });

    // Close overlay when tapping outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.certificate-card') && activeCertificate) {
            activeCertificate.classList.remove('overlay-active');
            activeCertificate = null;
        }
    });
}

// ====================================
// Scroll Animations
// ====================================
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger progress bar animations
                if (entry.target.closest('.skills-subsection')) {
                    animateProgressBars();
                    animateCircularProgress();
                }
                
                // Add skill bar subsection animation class
                if (entry.target.classList.contains('skills-subsection')) {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
    
    // Initialize tech card mouse tracking
    initTechCardEffects();
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, 100 + (index * 200));
    });
}

function animateCircularProgress() {
    const circularProgress = document.querySelectorAll('.circular-progress');
    circularProgress.forEach((circle, index) => {
        const progress = circle.getAttribute('data-progress');
        setTimeout(() => {
            circle.style.setProperty('--progress', progress);
        }, 100 + (index * 300));
    });
}

// ====================================
// Tech Card Mouse Effects
// ====================================
function initTechCardEffects() {
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
            
            // 3D tilt effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (e.clientY - rect.top - centerY) / 10;
            const rotateY = (e.clientX - rect.left - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ====================================
// Portfolio Tabs
// ====================================
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = btn.getAttribute('data-tab');
            
            // Add click ripple effect
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'tab-ripple';
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: tabRipple 0.6s ease-out;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${e.clientX - rect.left - 50}px;
                top: ${e.clientY - rect.top - 50}px;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            
            // Update active tab button with animation
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.transform = '';
            });
            btn.classList.add('active');
            
            // Update active tab content with enhanced animation
            tabContents.forEach(content => {
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');
                    content.style.animation = 'none';
                    content.offsetHeight; // Trigger reflow
                    content.style.animation = 'tabFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    // Animate children with stagger
                    const cards = content.querySelectorAll('.project-card, .certificate-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 80);
                    });
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Re-initialize animations for newly visible content
            setTimeout(initAnimations, 100);
        });
    });
}

// ====================================
// Project Modal
// ====================================
function initProjectModal() {
    // View details buttons - use event delegation
    document.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-details');
        if (viewBtn) {
            e.stopPropagation();
            const projectId = viewBtn.getAttribute('data-project');
            openProjectModal(projectId);
        }
        
        const projectCard = e.target.closest('.project-card');
        if (projectCard && !e.target.closest('.view-details')) {
            const projectId = projectCard.getAttribute('data-project');
            openProjectModal(projectId);
        }
    });

    // Close modal
    modalClose.addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeProjectModal();
        }
    });
}

function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    modalBody.innerHTML = generateProjectDetails(project);
    projectModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Animate project sections with stagger effect
    setTimeout(() => {
        const sections = modalBody.querySelectorAll('.project-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            setTimeout(() => {
                section.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 150 + (index * 100));
        });
        
        // Animate stat items
        const statItems = modalBody.querySelectorAll('.stat-item');
        statItems.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'scale(0.8)';
            setTimeout(() => {
                stat.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                stat.style.opacity = '1';
                stat.style.transform = 'scale(1)';
            }, 300 + (index * 100));
        });
        
        // Animate tags with stagger
        const tags = modalBody.querySelectorAll('.tech-tag, .package-tag, .feature-tag');
        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px) scale(0.9)';
            setTimeout(() => {
                tag.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0) scale(1)';
            }, 400 + (index * 30));
        });
    }, 100);

    // Initialize screenshot gallery
    initScreenshotGallery();
}

function closeProjectModal() {
    projectModal.classList.remove('show');
    document.body.style.overflow = '';
}

function generateProjectDetails(project) {
    return `
        <div class="project-details">
            <div class="project-header">
                <div class="project-header-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-header-info">
                    <h2 class="gradient-text">${project.title}</h2>
                    <p>${project.description}</p>
                    <div class="project-stats">
                        <div class="stat-item">
                            <span class="stat-value gradient-text">${project.technologies.length}</span>
                            <span class="stat-label">Technologies</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value gradient-text">${project.packages.length}</span>
                            <span class="stat-label">Packages</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value gradient-text">${project.features.length}</span>
                            <span class="stat-label">Features</span>
                        </div>
                    </div>
                    <div class="project-links">
                        ${project.github ? `
                            <a href="${project.github}" target="_blank" class="btn btn-small gradient-btn">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                        ` : ''}
                        ${project.store ? `
                            <a href="${project.store}" target="_blank" class="btn btn-small btn-outline">
                                <i class="fas fa-store"></i> Store
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="project-section">
                <h3 class="gradient-text"><i class="fas fa-code"></i> Technologies</h3>
                <div class="tech-list">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
            </div>

            <div class="project-section">
                <h3 class="gradient-text"><i class="fas fa-cube"></i> Packages</h3>
                <div class="package-list">
                    ${project.packages.map(pkg => `
                        <span class="package-tag">${pkg}</span>
                    `).join('')}
                </div>
            </div>

            <div class="project-section">
                <h3 class="gradient-text"><i class="fas fa-star"></i> Key Features</h3>
                <div class="feature-list">
                    ${project.features.map(feature => `
                        <span class="feature-tag"><i class="fas fa-check-circle"></i> ${feature}</span>
                    `).join('')}
                </div>
            </div>

            ${project.screenshots && project.screenshots.length > 0 ? `
                <div class="project-section">
                    <h3 class="gradient-text"><i class="fas fa-images"></i> Screenshots (${project.screenshots.length})</h3>
                    <div class="screenshots-grid">
                        ${project.screenshots.map((screenshot, index) => `
                            <div class="screenshot-item" data-index="${index}" data-src="${screenshot}">
                                <img src="${screenshot}" alt="Screenshot ${index + 1}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function initScreenshotGallery() {
    const screenshots = document.querySelectorAll('.screenshot-item');
    screenshots.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            if (src) {
                openImageViewer(src);
            }
        });
    });
}

function openImageViewer(src) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = `
        <div class="image-viewer-backdrop"></div>
        <div class="image-viewer-content">
            <button class="image-viewer-close"><i class="fas fa-times"></i></button>
            <img src="${src}" alt="Screenshot">
        </div>
    `;
    
    // Apply styles
    viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const backdrop = viewer.querySelector('.image-viewer-backdrop');
    backdrop.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
    `;
    
    const content = viewer.querySelector('.image-viewer-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        z-index: 1;
        animation: scaleIn 0.3s ease;
    `;
    
    const closeBtn = viewer.querySelector('.image-viewer-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: linear-gradient(135deg, #2196F3, #673AB7);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        font-size: 18px;
        transition: transform 0.3s ease;
    `;
    
    const img = viewer.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    document.body.appendChild(viewer);
    document.body.style.overflow = 'hidden';
    
    const close = () => {
        viewer.style.opacity = '0';
        setTimeout(() => {
            viewer.remove();
            // Only restore scroll if modal is not open
            if (!projectModal.classList.contains('show')) {
                document.body.style.overflow = '';
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// ====================================
// Contact Form
// ====================================
function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Create mailto link
        const mailtoLink = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        
        window.location.href = mailtoLink;
        showToast('Opening email client...', 'success');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====================================
// Toast Notifications
// ====================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ====================================
// Utility Functions
// ====================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// throttle function removed - not used

// ====================================
// Smooth Scroll for anchor links
// ====================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                scrollToSection(targetId);
            }
        });
    });
}

// ====================================
// Keyboard Navigation
// ====================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Close drawer with Escape
        if (e.key === 'Escape') {
            if (drawer.classList.contains('open')) {
                drawer.classList.remove('open');
                drawerOverlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }
    });
}

// ====================================
// Preload Images
// ====================================
function preloadImages() {
    const images = [
        'assets/me.webp',
        ...Object.values(projectsData).map(p => p.image),
        ...techStackData.map(t => t.image)
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ====================================
// Particles Effect (Enhancement)
// ====================================
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 5 + 2}px;
        height: ${Math.random() * 5 + 2}px;
        background: linear-gradient(135deg, #2196F3, #673AB7);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        opacity: ${Math.random() * 0.5 + 0.2};
        left: ${Math.random() * 100}vw;
        top: 100vh;
        animation: floatUp ${Math.random() * 10 + 10}s linear infinite;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 20000);
}

function initParticles() {
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create particles periodically
    setInterval(createParticle, 3000);
    
    // Create initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 500);
    }
}

// ====================================
// Initialize
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    // Generate dynamic content first
    generateTechStack();
    generateProjects();
    generateCertificates();
    
    // Then initialize everything
    hideSplashScreen();
    initNavigation();
    initTypewriter();
    initTabs();
    initProjectModal();
    initContactForm();
    initSmoothScroll();
    initKeyboardNavigation();
    preloadImages();
    initParticles();
});

// Page visibility handling not needed
