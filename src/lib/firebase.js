// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC1Hr7L6yp27w6E9wInccgpPFMSSrBRvwE",
    authDomain: "portfolio-e911a.firebaseapp.com",
    projectId: "portfolio-e911a",
    storageBucket: "portfolio-e911a.firebasestorage.app",
    messagingSenderId: "16738302709",
    appId: "1:16738302709:web:3a17868a9bbfa3ba0563bc",
    measurementId: "G-4HJNGVNDS5"
};

const defaultData = {
    social: {
        linkedin: 'https://www.linkedin.com/in/ahmed-abo-el-naga-b200892a5/',
        github: 'https://github.com/AhmedAbdElrahman117',
        facebook: 'https://www.facebook.com/lorr.ahmed.37/',
        whatsapp: 'https://wa.me/201000512414',
        instagram: '#',
        upwork: 'https://www.upwork.com/freelancers/~0128038751f7bbffdf'
    },
    about: {
        title: 'Ahmed Abdelrahman',
        subtitle: 'Flutter Developer',
        description: `Hello! I'm Ahmed Abdelrahman, a passionate Flutter developer with a strong foundation in building scalable, user-friendly, and high-performance cross-platform mobile applications. I hold a Bachelor's degree in Computer Science, where I gained a deep understanding of software engineering principles, data structures, and algorithms.

My journey in mobile development has been driven by a constant desire to learn and innovate. With Flutter, I enjoy crafting beautiful UIs and seamless user experiences that work flawlessly on both iOS and Android. I'm always eager to explore new technologies, tackle challenging problems, and contribute to meaningful projects.

Whether working independently or collaborating with a team, I bring dedication, creativity, and a problem-solving mindset to every project. When I'm not coding, you can find me exploring the latest tech trends, participating in hackathons, or sharing my knowledge with the developer community.`,
        image: 'assets/me.webp',
        stats: [
            { number: '1+', label: 'Years Experience' },
            { number: '10+', label: 'Projects Completed' },
            { number: '5+', label: 'Happy Clients' }
        ]
    },
    cv: { path: 'assets/CV.pdf', filename: 'Ahmed_Abdelrahman_CV.pdf' },
    contact: { address: 'Egypt, Cairo', phone: '+20 100 051 2414', email: 'ahmedaboelnaga713@gmail.com' },
    techSkills: [
        { name: 'Dart', image: 'assets/TechStack/dart.png' },
        { name: 'Flutter', image: 'assets/TechStack/Flutter.png' },
        { name: 'Firebase', image: 'assets/TechStack/firebase.png' },
        { name: 'Git', image: 'assets/TechStack/git.png' },
        { name: 'GitHub', image: 'assets/TechStack/github.png' },
        { name: 'Postman', image: 'assets/TechStack/postman.png' },
        { name: 'OOP', image: 'assets/TechStack/oop.png' },
        { name: 'SOLID', image: 'assets/TechStack/solid.png' },
        { name: 'Design Patterns', image: 'assets/TechStack/design.png' },
        { name: 'Clean Architecture', image: 'assets/TechStack/clean_architecture.png' },
        { name: 'States Management', image: 'assets/TechStack/states.png' },
        { name: 'Bloc / Cubit', image: 'assets/TechStack/bloc.png' },
        { name: 'Provider', image: 'assets/TechStack/provider.png' },
        { name: 'GetX', image: 'assets/TechStack/getx.png' },
        { name: 'GitHub Actions', image: 'assets/TechStack/githubActions.png' },
        { name: 'Google Maps', image: 'assets/TechStack/google_maps.png' }
    ],
    softSkills: [
        { id: 1, name: 'Teamwork', percentage: 96, color: '#FFC107' },
        { id: 2, name: 'Leadership', percentage: 98, color: '#2196F3' },
        { id: 3, name: 'Problem Solving', percentage: 95, color: '#795548' },
        { id: 4, name: 'Mentoring', percentage: 90, color: '#FF9800' },
        { id: 5, name: 'Communication', percentage: 94, color: '#4CAF50' }
    ],
    langSkills: [
        { id: 1, name: 'Arabic', level: 'Native', percentage: 100, color: '#3F51B5' },
        { id: 2, name: 'English', level: 'Fluent', percentage: 95, color: '#9C27B0' }
    ],
    projects: [
        { id: 1, title: 'Store App', description: 'A comprehensive e-commerce application built with Flutter.', image: 'assets/projects/store.jpeg', tags: ['Flutter', 'Firebase', 'E-commerce'], github: '#', details: 'Full description of the Store App.' },
        { id: 2, title: 'Chat App', description: 'Real-time messaging application.', image: 'assets/projects/chat.jpeg', tags: ['Flutter', 'Firebase', 'Real-time'], github: '#', details: 'Full description of the Chat App.' },
        { id: 3, title: 'Weather App', description: 'Check the weather forecast for any location.', image: 'assets/projects/weather.jpeg', tags: ['Flutter', 'REST API'], github: '#', details: 'Full description of the Weather App.' }
    ],
    certificates: [
        { id: 'beginner', title: 'Dart & Flutter Beginner', image: 'assets/Certificates/beginner.jpg', url: '#' },
        { id: 'bloc_mvvm', title: 'Bloc & MVVM', image: 'assets/Certificates/BlocAndMVVM.jpg', url: '#' },
        { id: 'responsive_ui', title: 'Responsive UI', image: 'assets/Certificates/responsiveUI.jpg', url: '#' },
        { id: 'clean_architecture', title: 'Clean Architecture', image: 'assets/Certificates/CleanArchitecture.jpg', url: '#' }
    ],
    services: [
        { id: 1, title: 'Cross-Platform Mobile App Development', description: 'Building beautiful, high-performance mobile applications for both iOS and Android using Flutter framework.', icon: 'fas fa-mobile-alt' },
        { id: 2, title: 'UI/UX Implementation', description: 'Translating complex design requirements into pixel-perfect, responsive, and intuitive user interfaces.', icon: 'fas fa-paint-brush' },
        { id: 3, title: 'Backend Integration', description: 'Connecting robust backend services using Firebase, REST APIs, and third-party SDKs.', icon: 'fas fa-database' },
        { id: 4, title: 'State Management Solutions', description: 'Implementing scalable architectures using Bloc/Cubit, Provider, or GetX for complex app states.', icon: 'fas fa-cubes' },
        { id: 5, title: 'App Maintenance & Optimization', description: 'Refactoring existing codebases, fixing bugs, and improving app performance and load times.', icon: 'fas fa-tools' },
        { id: 6, title: 'Deployment & Localization', description: 'Publishing apps to Google Play Store and App Store with multi-language support.', icon: 'fas fa-globe' }
    ]
};

let app, db, auth;
let cachedData = null;
let isLoaded = false;

export function initFirebase() {
    if (!app) {
        try {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            // Default load
            cachedData = { ...defaultData };
        } catch (error) {
            console.error("Firebase init failed:", error);
        }
    }
    return { db, auth };
}

export async function getPortfolioData() {
    if (isLoaded) return cachedData;

    // For this migration, we'll rely on default data first, and fetch from Firestore
    // Because this module is loaded client side.
    const { db: database } = initFirebase();
    if (!database) return defaultData;

    try {
        const collections = [
            'social', 'about', 'cv', 'techSkills', 'softSkills',
            'langSkills', 'projects', 'certificates', 'services', 'contact'
        ];

        const fetchPromises = collections.map(docName => getDoc(doc(database, "portfolio", docName)));
        const snapshots = await Promise.all(fetchPromises);

        const firebaseData = {};

        snapshots.forEach((snap, index) => {
            const docName = collections[index];
            if (snap.exists()) {
                const docData = snap.data();
                if (docData && docData.data !== undefined) {
                    firebaseData[docName] = docData.data;
                } else {
                    firebaseData[docName] = docData;
                }
            }
        });

        cachedData = { ...defaultData };

        // Normalize Firebase data to match our rendering schema without losing default stats, etc.
        for (const [key, value] of Object.entries(firebaseData)) {
            if (key === 'about') {
                cachedData.about = { ...defaultData.about, ...value };
                if (value.profileImage) cachedData.about.image = value.profileImage;
                if (value.paragraphs && Array.isArray(value.paragraphs)) {
                    cachedData.about.description = value.paragraphs.join('\n\n');
                }
                if (value.fullName) cachedData.about.title = value.fullName;
            } else if (key === 'projects' && Array.isArray(value)) {
                cachedData.projects = value.map(p => ({
                    ...p,
                    tags: p.technologies || p.tags || [],
                    details: p.details || p.description
                }));
            } else if (Array.isArray(value)) {
                // Fully overwrite arrays
                cachedData[key] = value;
            } else if (typeof value === 'object' && value !== null) {
                // Merge nested objects
                cachedData[key] = { ...defaultData[key], ...value };
            } else {
                cachedData[key] = value;
            }
        }

    } catch (e) {
        console.error("Error fetching data:", e);
        // Fallback already assigned
    }

    isLoaded = true;
    window.dispatchEvent(new Event('portfolioDataLoaded'));
    return cachedData;
}

