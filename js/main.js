/* ====================================
   AA Portfolio - Main JavaScript
   ==================================== */

'use strict';

// Add splash-active class synchronously to prevent flash
document.documentElement.classList.add('splash-active');
document.body.classList.add('splash-active');

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

// Cached layout measurements (prevent forced reflows)
let cachedNavHeight = 70;
let cachedBodyScrollHeight = 0;
let cachedWindowHeight = 0;
let animationFrameId = null;

// Initialize cached values
function updateCachedMeasurements() {
    // Use requestAnimationFrame to avoid forced reflow during initialization
    requestAnimationFrame(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) cachedNavHeight = navbar.offsetHeight;
        cachedBodyScrollHeight = document.body.scrollHeight;
        cachedWindowHeight = window.innerHeight;
    });
}

// ====================================
// Shimmer Skeleton Generators
// ====================================
function generateTechStackSkeleton() {
    const container = document.querySelector('.tech-stack');
    if (!container) return;

    container.innerHTML = Array(12).fill().map((_, i) => `
        <div class="tech-card-skeleton animate-on-scroll" style="--stagger: ${i}">
            <div class="shimmer shimmer-icon"></div>
            <div class="shimmer shimmer-label"></div>
        </div>
    `).join('');
}

function generateProjectsSkeleton() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    grid.innerHTML = Array(6).fill().map((_, i) => `
        <div class="project-card-skeleton animate-on-scroll" style="--stagger: ${i}">
            <div class="shimmer shimmer-project-image"></div>
            <div class="shimmer-project-info">
                <div class="shimmer shimmer-title"></div>
                <div class="shimmer shimmer-desc"></div>
                <div class="shimmer shimmer-desc short"></div>
                <div class="shimmer shimmer-btn"></div>
            </div>
        </div>
    `).join('');
}

function generateCertificatesSkeleton() {
    const grid = document.querySelector('.certificates-grid');
    if (!grid) return;

    grid.innerHTML = Array(6).fill().map((_, i) => `
        <div class="certificate-card-skeleton shimmer animate-on-scroll" style="--stagger: ${i}"></div>
    `).join('');
}

function generateSoftSkillsSkeleton() {
    const container = document.querySelector('.soft-skills');
    if (!container) return;

    container.innerHTML = Array(6).fill().map((_, i) => `
        <div class="skill-bar-skeleton animate-on-scroll" style="--stagger: ${i}">
            <div class="shimmer-skill-header">
                <div class="shimmer shimmer-skill-name"></div>
                <div class="shimmer shimmer-skill-percent"></div>
            </div>
            <div class="shimmer shimmer-progress"></div>
        </div>
    `).join('');
}

function generateLangSkillsSkeleton() {
    const container = document.querySelector('.language-skills');
    if (!container) return;

    container.innerHTML = Array(2).fill().map((_, i) => `
        <div class="language-card-skeleton animate-on-scroll" style="--stagger: ${i}">
            <div class="shimmer shimmer-circle"></div>
            <div class="shimmer shimmer-lang-name"></div>
            <div class="shimmer shimmer-lang-level"></div>
        </div>
    `).join('');
}

function generateAboutSkeleton() {
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image img');

    if (aboutImage) {
        aboutImage.style.opacity = '0';
    }

    if (aboutText) {
        aboutText.innerHTML = Array(4).fill().map(() => `
            <p>
                <span class="shimmer shimmer-text long"></span>
                <span class="shimmer shimmer-text long"></span>
                <span class="shimmer shimmer-text"></span>
            </p>
        `).join('');
    }
}

// Show all shimmer skeletons
function showAllSkeletons() {
    generateTechStackSkeleton();
    generateProjectsSkeleton();
    generateCertificatesSkeleton();
    generateSoftSkillsSkeleton();
    generateLangSkillsSkeleton();
    generateAboutSkeleton();
}

// ====================================
// CV Download Function
// ====================================
function downloadCV() {
    // Use dynamic CV data from Firebase
    const cvPath = cvData.path || 'assets/CV.pdf';
    const cvFilename = cvData.filename || 'Ahmed_Abdelrahman_CV.pdf';

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = cvFilename;
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
// Dynamic Content Update
// ====================================
function updateDynamicContent() {
    // Update social links
    if (!isSectionLoading('social')) {
        updateSocialLinks();
    }

    // Update about section
    if (!isSectionLoading('about')) {
        updateAboutSection();
    }

    // Update contact info
    if (!isSectionLoading('contact')) {
        updateContactInfo();
    }

    // Update soft skills
    if (!isSectionLoading('softSkills')) {
        generateSoftSkills();
    }

    // Update language skills
    if (!isSectionLoading('langSkills')) {
        generateLangSkills();
    }
}

function updateSocialLinks() {
    // Home section social buttons
    const socialButtons = document.querySelectorAll('.social-buttons .social-btn, .social-links a');

    socialButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        if (!icon) return;

        if (icon.classList.contains('fa-linkedin-in')) {
            btn.href = socialData.linkedin || '#';
        } else if (icon.classList.contains('fa-github')) {
            btn.href = socialData.github || '#';
        } else if (icon.classList.contains('fa-facebook-f')) {
            btn.href = socialData.facebook || '#';
        } else if (icon.classList.contains('fa-envelope')) {
            btn.href = 'mailto:' + (socialData.email || '');
        }
    });
}

function updateAboutSection() {
    // Update profile image with fade-in effect
    const profileImg = document.querySelector('.about-image img');
    if (profileImg && aboutData.profileImage) {
        profileImg.src = aboutData.profileImage;
        profileImg.style.opacity = '0';
        profileImg.onload = () => {
            profileImg.style.transition = 'opacity 0.5s ease';
            profileImg.style.opacity = '1';
        };
    }

    // Update about paragraphs
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        // Check if using new array format or old format
        if (Array.isArray(aboutData.paragraphs) && aboutData.paragraphs.length > 0) {
            // Clear existing paragraphs and add new ones with fade-in
            aboutText.innerHTML = aboutData.paragraphs
                .map((p, i) => `<p class="fade-in-content" style="animation-delay: ${i * 0.1}s">${p}</p>`)
                .join('');
        } else if (aboutData.aboutP1 || aboutData.aboutP2 || aboutData.aboutP3 || aboutData.aboutP4) {
            // Generate from old format (aboutP1, aboutP2, etc.)
            const paragraphs = [];
            if (aboutData.aboutP1) paragraphs.push(aboutData.aboutP1);
            if (aboutData.aboutP2) paragraphs.push(aboutData.aboutP2);
            if (aboutData.aboutP3) paragraphs.push(aboutData.aboutP3);
            if (aboutData.aboutP4) paragraphs.push(aboutData.aboutP4);

            aboutText.innerHTML = paragraphs
                .map((p, i) => `<p class="fade-in-content" style="animation-delay: ${i * 0.1}s">${p}</p>`)
                .join('');
        }
    }

    // Update typewriter texts if using new format
    if (Array.isArray(aboutData.typewriterTexts)) {
        window.typewriterTexts = aboutData.typewriterTexts;
    } else if (aboutData.typewriterTexts) {
        // Convert from old newline-separated format
        window.typewriterTexts = aboutData.typewriterTexts.split('\n').filter(t => t.trim());
    }
}

function updateContactInfo() {
    // Update contact section info
    // Note: h3 is child 1, so info-items are at positions 2, 3, 4
    const addressEl = document.querySelector('.info-item:nth-child(2) .info-text span:last-child');
    const phoneEl = document.querySelector('.info-item:nth-child(3) .info-text a');
    const emailEl = document.querySelector('.info-item:nth-child(4) .info-text a');

    if (addressEl) addressEl.textContent = contactInfo.address || 'Egypt, Cairo';
    if (phoneEl) {
        phoneEl.textContent = contactInfo.phone || '+20 100 051 2414';
        phoneEl.href = 'tel:' + (contactInfo.phone || '').replace(/\s/g, '');
    }
    if (emailEl) {
        emailEl.textContent = contactInfo.email || 'ahmedaboelnaga713@gmail.com';
        emailEl.href = 'mailto:' + (contactInfo.email || '');
    }
}

function generateSoftSkills() {
    const container = document.querySelector('.soft-skills');
    if (!container) return;

    // Check if data is loaded and is an array
    if (!softSkillsData || !Array.isArray(softSkillsData) || softSkillsData.length === 0) {
        generateSoftSkillsSkeleton();
        return;
    }

    container.innerHTML = softSkillsData.map((skill, index) => `
        <div class="skill-bar animate-on-scroll fade-in-content" style="--stagger: ${index}; animation-delay: ${index * 0.05}s">
            <div class="skill-info">
                <span>${skill.name}</span>
                <span>${skill.percentage}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress" data-progress="${skill.percentage}" style="--progress-color: ${skill.color};"></div>
            </div>
        </div>
    `).join('');
}

function generateLangSkills() {
    const container = document.querySelector('.language-skills');
    if (!container) return;

    // Check if data is loaded and is an array
    if (!langSkillsData || !Array.isArray(langSkillsData) || langSkillsData.length === 0) {
        generateLangSkillsSkeleton();
        return;
    }

    container.innerHTML = langSkillsData.map((skill, index) => `
        <div class="language-card animate-on-scroll fade-in-content" style="--stagger: ${index}; animation-delay: ${index * 0.1}s">
            <div class="circular-progress" data-progress="${skill.percentage}" style="--progress-color: ${skill.color};">
                <div class="progress-value">${skill.percentage}%</div>
            </div>
            <span class="language-name">${skill.name}</span>
            <span class="language-level">${skill.level}</span>
        </div>
    `).join('');
}

// ====================================
// Splash Screen
// ====================================

// Track splash screen state
let splashActive = true;

function hideSplashScreen() {
    // Ensure splash screen exists
    if (!splashScreen) {
        console.warn('Splash screen element not found, unlocking scroll immediately');
        document.documentElement.classList.remove('splash-active');
        document.body.classList.remove('splash-active');
        splashActive = false;
        return;
    }

    // Wait for all splash animations to complete (loader bar takes ~4s total)
    setTimeout(() => {
        splashScreen.classList.add('hide');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            // Allow scrolling again
            splashActive = false;
            // Remove splash-active class to re-enable scrolling
            document.documentElement.classList.remove('splash-active');
            document.body.classList.remove('splash-active');
            // Force scroll to top one more time
            window.scrollTo(0, 0);
            initAnimations();
        }, 1000);
    }, 4200);
}

// Failsafe: Ensure scrolling is re-enabled after max 6 seconds
setTimeout(() => {
    if (splashActive) {
        console.warn('Splash screen timeout - force unlocking scroll');
        document.documentElement.classList.remove('splash-active');
        document.body.classList.remove('splash-active');
        splashActive = false;
    }
}, 6000);

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
        if (animationFrameId) return;

        animationFrameId = requestAnimationFrame(() => {
            const sections = document.querySelectorAll('.section');
            const scrollPosition = window.scrollY + cachedNavHeight + window.innerHeight / 3;

            // Batch all layout reads together
            const sectionData = Array.from(sections).map(section => ({
                id: section.getAttribute('id'),
                top: section.offsetTop,
                height: section.offsetHeight
            }));

            // Find current section from batched data
            let currentSection = null;
            for (const data of sectionData) {
                if (scrollPosition >= data.top && scrollPosition < data.top + data.height) {
                    currentSection = data.id;
                    break;
                }
            }

            if (currentSection && currentSection !== lastSection) {
                lastSection = currentSection;
                updateActiveNav(currentSection);
            }

            animationFrameId = null;
        });
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
        requestAnimationFrame(() => {
            const sectionTop = section.offsetTop - cachedNavHeight;
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
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
    const maxScroll = cachedBodyScrollHeight - cachedWindowHeight;
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

    // Check if data is loaded
    if (!techStackData || !Array.isArray(techStackData) || techStackData.length === 0) {
        generateTechStackSkeleton();
        return;
    }

    techStackContainer.innerHTML = techStackData.map((tech, index) => {
        // image field contains the tech icon URL
        const imageSource = tech.image || '';
        return `
        <div class="tech-card animate-on-scroll fade-in-content" data-name="${tech.name}" style="--stagger: ${index}; animation-delay: ${index * 0.03}s">
            <img src="${imageSource}" alt="${tech.name}" loading="lazy" onerror="this.style.display='none'" crossorigin="anonymous">
            <span>${tech.name}</span>
        </div>
    `}).join('');
}

function generateProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Check if data is loaded
    if (!projectsData || Object.keys(projectsData).length === 0) {
        generateProjectsSkeleton();
        return;
    }

    projectsGrid.innerHTML = Object.values(projectsData).map((project, index) => {
        // image field is for the project thumbnail
        const imageSource = project.image || '';
        return `
        <div class="project-card animate-on-scroll fade-in-content" data-project="${project.id}" style="--stagger: ${index}; animation-delay: ${index * 0.08}s">
            <div class="project-image">
                <img src="${imageSource}" alt="${project.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><i class=\\'fas fa-image\\'></i></div>'" crossorigin="anonymous">
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="gradient-text">${project.title.split(' - ')[0]}</h3>
                </div>
                <div class="project-description">
                    <p>${project.description.substring(0, 100)}...</p>
                </div>
                <div class="project-footer">
                    <button class="btn btn-small gradient-btn view-details" data-project="${project.id}">
                        Details <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

function generateServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    // Check if data is loaded
    if (!servicesData || !Array.isArray(servicesData) || servicesData.length === 0) {
        return;
    }

    servicesGrid.innerHTML = servicesData.map((service, index) => `
        <div class="service-card animate-on-scroll fade-in-content" style="--stagger: ${index}; animation-delay: ${index * 0.08}s">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3 class="gradient-text">${service.title}</h3>
            <p>${service.description}</p>
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

    // Check if data is loaded
    if (!certificatesData || !Array.isArray(certificatesData) || certificatesData.length === 0) {
        generateCertificatesSkeleton();
        return;
    }

    certificatesGrid.innerHTML = certificatesData.map((cert, index) => {
        // image field is for displaying the certificate image
        const imageSource = cert.image || '';
        // url field is the link to the certificate (e.g., Udemy certificate page)
        const linkUrl = cert.url || cert.link || '#';
        return `
        <a href="${linkUrl}" target="_blank" class="certificate-card animate-on-scroll fade-in-content" style="--stagger: ${index}; animation-delay: ${index * 0.08}s" data-url="${linkUrl}">
            <div class="certificate-image">
                <img src="${imageSource}" alt="${cert.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><i class=\\'fas fa-certificate\\'></i></div>'" crossorigin="anonymous">
                <div class="certificate-overlay">
                    <span class="gradient-text">${cert.title}</span>
                    <span class="view-btn">View <i class="fas fa-external-link-alt"></i></span>
                </div>
            </div>
        </a>
    `}).join('');

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
        card.addEventListener('click', function (e) {
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
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.certificate-card') && activeCertificate) {
            activeCertificate.classList.remove('overlay-active');
            activeCertificate = null;
        }
    });
}

// ====================================
// Scroll Animations
// ====================================
let scrollObserver = null; // Global observer instance

function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Clear existing observer if any
    if (scrollObserver) {
        scrollObserver.disconnect();
    }

    scrollObserver = new IntersectionObserver((entries) => {
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
        rootMargin: '0px 0px -100px 0px'
    });

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

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
        let cardRect = null;

        card.addEventListener('mouseenter', () => {
            // Cache rect on mouse enter
            cardRect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
            if (!cardRect) cardRect = card.getBoundingClientRect();

            requestAnimationFrame(() => {
                const x = ((e.clientX - cardRect.left) / cardRect.width) * 100;
                const y = ((e.clientY - cardRect.top) / cardRect.height) * 100;

                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);

                // 3D tilt effect
                const centerX = cardRect.width / 2;
                const centerY = cardRect.height / 2;
                const rotateX = (e.clientY - cardRect.top - centerY) / 10;
                const rotateY = (e.clientX - cardRect.left - centerX) / 10;

                card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            cardRect = null; // Clear cache
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

            // Add click ripple effect with requestAnimationFrame
            requestAnimationFrame(() => {
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
            });

            // Update active tab button with animation
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.transform = '';
            });
            btn.classList.add('active');

            // Update active tab content with enhanced animation (no forced reflow)
            tabContents.forEach(content => {
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');

                    // Reset animation without forcing reflow
                    requestAnimationFrame(() => {
                        content.style.animation = 'none';
                        requestAnimationFrame(() => {
                            content.style.animation = 'tabFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        });
                    });

                    // Animate children with stagger
                    const cards = content.querySelectorAll('.project-card, .certificate-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            requestAnimationFrame(() => {
                                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            });
                        }, index * 70);
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

    // Lock scroll without changing position
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');

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
    // Unlock scroll
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
}

function generateProjectDetails(project) {
    // image field is the main project image
    const mainImageSource = project.image || '';

    return `
        <div class="project-details">
            <div class="project-header">
                <div class="project-header-image">
                    <img src="${mainImageSource}" alt="${project.title}" loading="lazy" crossorigin="anonymous">
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
                        ${project.screenshots.map((screenshot, index) => {
        // Handle both string URLs and objects with image/url properties from Firestore
        let screenshotUrl = '';
        if (typeof screenshot === 'string') {
            screenshotUrl = screenshot;
        } else if (screenshot && typeof screenshot === 'object') {
            screenshotUrl = screenshot.image || screenshot.url || '';
        }
        return screenshotUrl ? `
                            <div class="screenshot-item" data-index="${index}" data-src="${screenshotUrl}">
                                <img src="${screenshotUrl}" alt="Screenshot ${index + 1}" loading="lazy" crossorigin="anonymous">
                            </div>
                        ` : ''
    }).join('')}
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

    // Lock scroll without changing position

    const close = () => {
        viewer.style.opacity = '0';
        setTimeout(() => {
            viewer.remove();
            // Only restore scroll if modal is not open
            if (!projectModal.classList.contains('show')) {
                document.body.classList.remove('modal-open');
                document.documentElement.classList.remove('modal-open');
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

// Initialize cached measurements after DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCachedMeasurements);
} else {
    updateCachedMeasurements();
}

// Update on resize
window.addEventListener('resize', debounce(updateCachedMeasurements, 200), { passive: true });

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
        anchor.addEventListener('click', function (e) {
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
// Data Loaded Event Handler
// ====================================
function handleDataLoaded(event) {
    const { section } = event.detail;

    switch (section) {
        case 'social':
            updateSocialLinks();
            break;
        case 'about':
            updateAboutSection();
            break;
        case 'contact':
            updateContactInfo();
            break;
        case 'techSkills':
            generateTechStack();
            initTechCardEffects();
            break;
        case 'softSkills':
            generateSoftSkills();
            animateProgressBars();
            break;
        case 'langSkills':
            generateLangSkills();
            animateCircularProgress();
            break;
        case 'projects':
            generateProjects();
            break;
        case 'certificates':
            generateCertificates();
            break;
        case 'services':
            generateServices();
            break;
        case 'all':
            // Re-initialize animations for any new content
            initAnimations();
            break;
    }
}

// ====================================
// Initialize
// ====================================
// Disable scroll restoration and force scroll to top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top and prevent any scrolling
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Show shimmer skeletons while loading
    showAllSkeletons();

    // Listen for data loaded events
    window.addEventListener('portfolioDataLoaded', handleDataLoaded);

    // Try to update any already-loaded content
    updateDynamicContent();

    // Generate content if data is already available
    if (!isSectionLoading('techSkills')) generateTechStack();
    if (!isSectionLoading('projects')) generateProjects();
    if (!isSectionLoading('certificates')) generateCertificates();

    // Initialize all UI components
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

    // Initialize animations after a short delay to ensure all content is rendered
    setTimeout(() => {
        initAnimations();
        // Re-trigger animations when new content is loaded dynamically
        window.addEventListener('portfolioDataLoaded', () => {
            setTimeout(() => initAnimations(), 100);
        }, { once: false });
    }, 100);
});

// Additional failsafe on window load
window.addEventListener('load', () => {
    // Double-check that splash screen will be hidden
    setTimeout(() => {
        if (splashActive) {
            console.warn('Window load - ensuring splash unlocks');
            document.documentElement.classList.remove('splash-active');
            document.body.classList.remove('splash-active');
            splashActive = false;
        }
    }, 6500);
});

// Page visibility handling not needed
