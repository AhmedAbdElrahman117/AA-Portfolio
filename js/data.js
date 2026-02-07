/* ====================================
   AA Portfolio - Firebase Data Loading
   ==================================== */

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1Hr7L6yp27w6E9wInccgpPFMSSrBRvwE",
    authDomain: "portfolio-e911a.firebaseapp.com",
    projectId: "portfolio-e911a",
    storageBucket: "portfolio-e911a.firebasestorage.app",
    messagingSenderId: "16738302709",
    appId: "1:16738302709:web:3a17868a9bbfa3ba0563bc",
    measurementId: "G-4HJNGVNDS5"
};

// Default data (used when Firebase has no data)
const defaultData = {
    social: {
        linkedin: 'https://www.linkedin.com/in/ahmed-abo-el-naga-b200892a5/',
        github: 'https://github.com/AhmedAbdElrahman117',
        facebook: 'https://www.facebook.com/lorr.ahmed.37/',
        email: 'ahmedaboelnaga713@gmail.com'
    },
    about: {
        profileImage: 'assets/me.webp',
        fullName: 'Ahmed Abdelrahman',
        typewriterTexts: ['Ahmed Abdelrahman', 'Flutter Developer'],
        paragraphs: [
            "Hello! I'm <strong class=\"gradient-text\">Ahmed Abdelrahman</strong>, a passionate Flutter developer with a strong foundation in building cross-platform mobile applications.",
            "I specialize in creating beautiful, responsive, and performant mobile apps using Flutter and Dart. My experience spans across various domains including e-commerce, social media, education, and productivity applications.",
            "I'm constantly learning and staying up-to-date with the latest technologies and best practices in mobile development. I believe in writing clean, maintainable code and creating exceptional user experiences.",
            "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community."
        ]
    },
    cv: { path: 'assets/CV.pdf', filename: 'Ahmed_Abdelrahman_CV.pdf' },
    contact: { address: 'Egypt, Cairo', phone: '+20 100 051 2414', email: 'ahmedaboelnaga713@gmail.com' },
    techSkills: [
        { name: 'Dart', image: 'assets/TechStack/dart.png' },
        { name: 'Flutter', image: 'assets/TechStack/Flutter.png' },
        { name: 'Firebase', image: 'assets/TechStack/firebase.png' },
        { name: 'Kotlin', image: 'assets/TechStack/Kotlin.png' },
        { name: 'C++', image: 'assets/TechStack/Cpp.png' },
        { name: 'Qt', image: 'assets/TechStack/qt.png' },
        { name: 'MySQL', image: 'assets/TechStack/mySql.png' },
        { name: 'PostgreSQL', image: 'assets/TechStack/Postgresql.png' },
        { name: 'SQLite', image: 'assets/TechStack/sqlite.png' },
        { name: 'Supabase', image: 'assets/TechStack/supabase.png' },
        { name: 'GitHub', image: 'assets/TechStack/github.png' },
        { name: 'Postman', image: 'assets/TechStack/postman.png' },
        { name: 'Figma', image: 'assets/TechStack/figma.png' },
        { name: 'Android', image: 'assets/TechStack/android.png' },
        { name: 'REST API', image: 'assets/TechStack/API.png' },
        { name: 'GetX', image: 'assets/TechStack/getx.png' },
        { name: 'GitHub Actions', image: 'assets/TechStack/githubActions.png' },
        { name: 'Google Maps', image: 'assets/TechStack/google_maps.png' }
    ],
    softSkills: [
        { id: 1, name: 'Teamwork', percentage: 96, color: '#FFC107' },
        { id: 2, name: 'Leadership', percentage: 98, color: '#2196F3' },
        { id: 3, name: 'Problem Solving', percentage: 95, color: '#795548' },
        { id: 4, name: 'Time Management', percentage: 92, color: '#009688' },
        { id: 5, name: 'Mentoring', percentage: 90, color: '#E91E63' },
        { id: 6, name: 'Communication', percentage: 94, color: '#FF9800' }
    ],
    langSkills: [
        { id: 1, name: 'Arabic', level: 'Native', percentage: 100, color: '#3F51B5' },
        { id: 2, name: 'English', level: 'Fluent', percentage: 95, color: '#9C27B0' }
    ],
    projects: [
        { id: 'uccd', title: 'UCCD - Courses Management System', description: 'A comprehensive university course management system with role-based access control.', image: 'assets/uccd/UCCDLOGO.png', technologies: ['Flutter', 'Dart', 'Firebase', 'Bloc'], packages: ['flutter_bloc', 'firebase_core'], features: ['Role-based access', 'Course management'], screenshots: ['assets/uccd/1.jpg'], github: 'https://github.com/AhmedAbdElrahman117/uccd' },
        { id: 'chat', title: 'Chat App', description: 'A real-time peer-to-peer chat application built with Flutter and Firebase.', image: 'assets/chat/logo.png', technologies: ['Flutter', 'Firebase'], packages: ['firebase_core'], features: ['Real-time messaging'], screenshots: ['assets/chat/1.png'], github: 'https://github.com/AhmedAbdElrahman117/chat-app' },
        { id: 'qurany', title: 'Qurany', description: 'A beautiful Quran application with audio playback and translations.', image: 'assets/qurany/Logo.png', technologies: ['Flutter', 'SQLite'], packages: ['sqflite'], features: ['Quran text', 'Audio'], screenshots: ['assets/qurany/1.png'], github: 'https://github.com/AhmedAbdElrahman117/qurany' },
        { id: 'attend_sys', title: 'Attendance System', description: 'A GPS-based employee attendance tracking system.', image: 'assets/attend_sys/icon.png', technologies: ['Flutter', 'Supabase'], packages: ['supabase_flutter'], features: ['GPS check-in'], screenshots: ['assets/attend_sys/1.png'], github: 'https://github.com/AhmedAbdElrahman117/attendance-system' },
        { id: 'auth', title: 'Auth App', description: 'An authentication app demonstrating various login methods.', image: 'assets/auth/logo.png', technologies: ['Flutter', 'Firebase'], packages: ['firebase_auth'], features: ['Multiple auth methods'], screenshots: ['assets/auth/1.png'], github: 'https://github.com/AhmedAbdElrahman117/auth-app' },
        { id: 'my_news', title: 'News App', description: 'A news aggregator application.', image: 'assets/my_news/icon.png', technologies: ['Flutter', 'REST API'], packages: ['dio'], features: ['News categories'], screenshots: ['assets/my_news/1.png'], github: 'https://github.com/AhmedAbdElrahman117/news-app' }
    ],
    certificates: [
        { id: 'beginner', title: 'Dart & Flutter Beginner', image: 'assets/Certificates/beginner.jpg', url: '#' },
        { id: 'bloc_mvvm', title: 'Bloc & MVVM', image: 'assets/Certificates/BlocAndMVVM.jpg', url: '#' },
        { id: 'git_github', title: 'Git & GitHub', image: 'assets/Certificates/gitAndGithub.jpg', url: '#' },
        { id: 'payment_integration', title: 'Payment Integration', image: 'assets/Certificates/paymentIntegration.jpg', url: '#' },
        { id: 'responsive_ui', title: 'Responsive UI', image: 'assets/Certificates/responsiveUI.jpg', url: '#' },
        { id: 'clean_architecture', title: 'Clean Architecture', image: 'assets/Certificates/CleanArchitecture.jpg', url: '#' }
    ],
    services: [
        { id: 1, title: 'Cross-Platform Mobile App Development', description: 'Building beautiful, high-performance mobile applications for both iOS and Android using Flutter framework.', icon: 'fas fa-mobile-alt' },
        { id: 2, title: 'UI/UX Implementation', description: 'Transforming design mockups into pixel-perfect, responsive user interfaces with smooth animations and interactions.', icon: 'fas fa-paint-brush' },
        { id: 3, title: 'Performance Optimization', description: 'Optimizing app performance for faster load times, smoother animations, and better battery efficiency.', icon: 'fas fa-tachometer-alt' },
        { id: 4, title: 'Payment Integration', description: 'Integrating secure payment gateways including Stripe, PayPal, and local payment methods into mobile applications.', icon: 'fas fa-credit-card' },
        { id: 5, title: 'App Maintenance & Support', description: 'Providing ongoing maintenance, bug fixes, feature updates, and technical support for existing applications.', icon: 'fas fa-wrench' },
        { id: 6, title: 'Deployment & Localization', description: 'Publishing apps to Google Play Store and Apple App Store with multi-language support and regional adaptations.', icon: 'fas fa-globe' }
    ]
};

// Data state - initialized with defaults
let projectsData = {};
defaultData.projects.forEach(p => { projectsData[p.id] = p; });
let certificatesData = [...defaultData.certificates];
let servicesData = [...defaultData.services];
let contactInfo = { ...defaultData.contact };
let techStackData = [...defaultData.techSkills];
let softSkillsData = [...defaultData.softSkills];
let langSkillsData = [...defaultData.langSkills];
let aboutData = { ...defaultData.about };
let socialData = { ...defaultData.social };
let cvData = { ...defaultData.cv };
let typewriterTexts = [...defaultData.about.typewriterTexts];

// Loading states for each section
const loadingState = {
    social: true,
    about: true,
    cv: true,
    techSkills: true,
    softSkills: true,
    langSkills: true,
    projects: true,
    certificates: true,
    services: true,
    contact: true,
    isAllLoaded: false
};

// Firebase instance references
let firebaseApp = null;
let firebaseDb = null;
let firestoreMethods = null;
let portfolioUnsubscribers = [];

// Initialize Firebase
async function initFirebase() {
    if (firebaseDb) return;
    
    try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, doc, getDoc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const apps = getApps();
        firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
        firebaseDb = getFirestore(firebaseApp);
        firestoreMethods = { doc, getDoc, onSnapshot };
    } catch (error) {
        console.error('Firebase init failed:', error);
        throw error;
    }
}

// Fetch a single document from Firebase (one-time, kept for compatibility)
async function fetchDocument(collectionName, docId) {
    try {
        await initFirebase();
        const { doc, getDoc } = firestoreMethods;
        
        const docRef = doc(firebaseDb, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch ${collectionName}/${docId}:`, error);
        return null;
    }
}

// Subscribe to a document with real-time updates
function subscribeToDocument(collectionName, docId, callback) {
    const { doc, onSnapshot } = firestoreMethods;
    const docRef = doc(firebaseDb, collectionName, docId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            callback(null);
        }
    }, (error) => {
        console.error(`Snapshot error for ${collectionName}/${docId}:`, error);
    });
    
    portfolioUnsubscribers.push(unsubscribe);
    return unsubscribe;
}

// Process document data and dispatch event
function processDocumentData(section, docData, processor) {
    if (docData && processor) {
        processor(docData);
    }
    loadingState[section] = false;
    dispatchDataLoaded(section);
}

// Load all portfolio data from Firebase with real-time updates
async function loadPortfolioData() {
    try {
        await initFirebase();
        
        // Subscribe to all sections with real-time updates
        subscribeToDocument('portfolio', 'social', (docData) => {
            if (docData && docData.data) {
                socialData = docData.data;
            }
            loadingState.social = false;
            dispatchDataLoaded('social');
        });
        
        subscribeToDocument('portfolio', 'about', (docData) => {
            if (docData && docData.data) {
                aboutData = docData.data;
                const aboutInfo = docData.data;
                if (aboutInfo.typewriterTexts) {
                    if (Array.isArray(aboutInfo.typewriterTexts)) {
                        typewriterTexts = aboutInfo.typewriterTexts;
                    } else {
                        typewriterTexts = aboutInfo.typewriterTexts.split('\n').filter(t => t.trim());
                    }
                }
            }
            loadingState.about = false;
            dispatchDataLoaded('about');
        });
        
        subscribeToDocument('portfolio', 'cv', (docData) => {
            if (docData && docData.data) {
                cvData = docData.data;
            }
            loadingState.cv = false;
            dispatchDataLoaded('cv');
        });
        
        subscribeToDocument('portfolio', 'techSkills', (docData) => {
            if (docData && docData.data && Array.isArray(docData.data)) {
                techStackData = docData.data;
            }
            loadingState.techSkills = false;
            dispatchDataLoaded('techSkills');
        });
        
        subscribeToDocument('portfolio', 'softSkills', (docData) => {
            if (docData && docData.data && Array.isArray(docData.data)) {
                softSkillsData = docData.data;
            }
            loadingState.softSkills = false;
            dispatchDataLoaded('softSkills');
        });
        
        subscribeToDocument('portfolio', 'langSkills', (docData) => {
            if (docData && docData.data && Array.isArray(docData.data)) {
                langSkillsData = docData.data;
            }
            loadingState.langSkills = false;
            dispatchDataLoaded('langSkills');
        });
        
        subscribeToDocument('portfolio', 'projects', (docData) => {
            if (docData && docData.data && Array.isArray(docData.data)) {
                // Convert array to object format for compatibility
                projectsData = {};
                docData.data.forEach(p => {
                    projectsData[p.id] = p;
                });
            }
            loadingState.projects = false;
            dispatchDataLoaded('projects');
        });
        
        subscribeToDocument('portfolio', 'certificates', (docData) => {
            if (docData && docData.data && Array.isArray(docData.data)) {
                certificatesData = docData.data;
            }
            loadingState.certificates = false;
            dispatchDataLoaded('certificates');
        });
        
        subscribeToDocument('portfolio', 'services', (docData) => {
            if (docData && docData.data && Array.isArray(docData.data)) {
                servicesData = docData.data;
            }
            loadingState.services = false;
            dispatchDataLoaded('services');
        });
        
        subscribeToDocument('portfolio', 'contact', (docData) => {
            if (docData && docData.data) {
                contactInfo = docData.data;
            }
            loadingState.contact = false;
            dispatchDataLoaded('contact');
        });
        
        // Mark all as loaded after a short delay to allow initial snapshots
        setTimeout(() => {
            if (!loadingState.isAllLoaded) {
                loadingState.isAllLoaded = true;
                dispatchDataLoaded('all');
            }
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
        // Even on error, use defaults and mark as loaded
        markAllAsLoaded();
        return false;
    }
}

// Mark all sections as loaded (uses defaults)
function markAllAsLoaded() {
    Object.keys(loadingState).forEach(key => {
        if (key !== 'isAllLoaded') {
            loadingState[key] = false;
            dispatchDataLoaded(key);
        }
    });
    loadingState.isAllLoaded = true;
    dispatchDataLoaded('all');
}

// Dispatch custom event when data is loaded
function dispatchDataLoaded(section) {
    window.dispatchEvent(new CustomEvent('portfolioDataLoaded', {
        detail: { section, loadingState }
    }));
}

// Check if a section is still loading
function isSectionLoading(section) {
    return loadingState[section] === true;
}

// Check if all data is loaded
function isAllDataLoaded() {
    return loadingState.isAllLoaded;
}

// Unsubscribe from all portfolio real-time listeners
function unsubscribeFromPortfolio() {
    portfolioUnsubscribers.forEach(unsub => unsub());
    portfolioUnsubscribers = [];
}

// Parse browser name from user agent
function getBrowserName(userAgent) {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'IE';
    return 'Unknown';
}

// Fetch IP and geolocation data
async function getVisitorGeoData() {
    try {
        // Using ip-api.com (free, no API key needed, 45 req/min limit)
        const response = await fetch('http://ip-api.com/json/?fields=query,country,city,isp,org');
        if (response.ok) {
            const data = await response.json();
            return {
                ip: data.query || 'Unknown',
                country: data.country || 'Unknown',
                city: data.city || 'Unknown',
                isp: data.isp || 'Unknown',
                org: data.org || 'Unknown'
            };
        }
    } catch (error) {
        // Try fallback API
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                return {
                    ip: data.ip || 'Unknown',
                    country: data.country_name || 'Unknown',
                    city: data.city || 'Unknown',
                    isp: data.org || 'Unknown',
                    org: data.org || 'Unknown'
                };
            }
        } catch (e) {
            console.error('Geolocation fallback failed:', e);
        }
    }
    return { ip: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown', org: 'Unknown' };
}

// Record visitor to Firebase
async function recordVisitor() {
    // Store session start time
    const sessionStartTime = Date.now();
    
    // Fetch geo data in parallel with other setup
    const geoDataPromise = getVisitorGeoData();
    const browser = getBrowserName(navigator.userAgent);
    const geoData = await geoDataPromise;
    
    const visit = {
        timestamp: new Date().toISOString(),
        page: 'portfolio',
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        browser: browser,
        ip: geoData.ip,
        country: geoData.country,
        city: geoData.city,
        isp: geoData.isp,
        org: geoData.org,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        duration: 0 // Will be updated on exit
    };
    
    try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const apps = getApps();
        const app = apps.length ? apps[0] : initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        const docRef = await addDoc(collection(db, 'visitors'), visit);
        
        // Store visit ID and start time for duration tracking
        sessionStorage.setItem('aa_visit_id', docRef.id);
        sessionStorage.setItem('aa_session_start', sessionStartTime.toString());
        
        // Set up duration tracking on page unload
        setupSessionDurationTracking();
    } catch (error) {
        // Silent fail - don't interrupt user experience
        console.error('Failed to record visit:', error);
    }
}

// Set up session duration tracking using sendBeacon
function setupSessionDurationTracking() {
    const sendDuration = () => {
        const visitId = sessionStorage.getItem('aa_visit_id');
        const startTime = sessionStorage.getItem('aa_session_start');
        
        if (!visitId || !startTime) return;
        
        const duration = Math.round((Date.now() - parseInt(startTime)) / 1000); // Duration in seconds
        
        // Use Firestore REST API with sendBeacon to update duration
        // We'll POST to a session_updates collection since sendBeacon can't do PATCH
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/session_updates`;
        
        const payload = {
            fields: {
                visitorId: { stringValue: visitId },
                duration: { integerValue: duration.toString() },
                endTime: { stringValue: new Date().toISOString() }
            }
        };
        
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(firestoreUrl, blob);
        
        // Clear session data
        sessionStorage.removeItem('aa_visit_id');
        sessionStorage.removeItem('aa_session_start');
    };
    
    // Send duration on page hide (works for tab close, navigation, etc.)
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            sendDuration();
        }
    });
    
    // Fallback for older browsers
    window.addEventListener('pagehide', sendDuration);
}

// Start loading data immediately
loadPortfolioData();

// Record visitor
recordVisitor();
