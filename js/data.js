/* ====================================
   AA Portfolio - Project Data
   ==================================== */

const projectsData = {
    uccd: {
        id: 'uccd',
        title: 'UCCD - Courses Management System',
        description: 'A comprehensive university course management system with role-based access control. It allows administrators to manage courses, instructors can create and manage content, and students can enroll and track their progress.',
        image: 'assets/uccd/UCCDLOGO.png',
        technologies: ['Flutter', 'Dart', 'Firebase', 'Bloc', 'Clean Architecture'],
        packages: ['flutter_bloc', 'firebase_core', 'firebase_auth', 'cloud_firestore', 'get_it', 'dartz', 'equatable'],
        features: [
            'Role-based access control (Admin, Instructor, Student)',
            'Course creation and management',
            'Student enrollment system',
            'Progress tracking and analytics',
            'Real-time notifications',
            'Offline support with local caching'
        ],
        screenshots: [
            'assets/uccd/1.jpg',
            'assets/uccd/2.jpg',
            'assets/uccd/3.jpg',
            'assets/uccd/4.jpg',
            'assets/uccd/5.jpg',
            'assets/uccd/6.jpg',
            'assets/uccd/7.jpg',
            'assets/uccd/8.jpg',
            'assets/uccd/9.jpg',
            'assets/uccd/10.jpg',
            'assets/uccd/11.jpg',
            'assets/uccd/12.jpg',
            'assets/uccd/13.jpg',
            'assets/uccd/14.jpg',
            'assets/uccd/15.jpg',
            'assets/uccd/16.jpg',
            'assets/uccd/17.jpg',
            'assets/uccd/18.jpg'
        ],
        github: 'https://github.com/AhmedAbdElrahman117/uccd',
        store: null
    },
    chat: {
        id: 'chat',
        title: 'Chat App',
        description: 'A real-time peer-to-peer chat application built with Flutter and Firebase. Features instant messaging, online status, typing indicators, and media sharing capabilities.',
        image: 'assets/chat/logo.png',
        technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'MVVM'],
        packages: ['firebase_core', 'firebase_auth', 'cloud_firestore', 'firebase_storage', 'provider', 'image_picker', 'cached_network_image'],
        features: [
            'Real-time messaging',
            'Online/Offline status indicators',
            'Typing indicators',
            'Image and file sharing',
            'Push notifications',
            'Message read receipts'
        ],
        screenshots: [
            'assets/chat/1.png',
            'assets/chat/2.png',
            'assets/chat/3.png',
            'assets/chat/4.png',
            'assets/chat/5.png',
            'assets/chat/6.png',
            'assets/chat/7.png',
            'assets/chat/8.png'
        ],
        github: 'https://github.com/AhmedAbdElrahman117/chat-app',
        store: null
    },
    qurany: {
        id: 'qurany',
        title: 'Qurany',
        description: 'A beautiful Quran application with audio playback, translations, and bookmarking features. Designed with a focus on user experience and accessibility.',
        image: 'assets/qurany/Logo.png',
        technologies: ['Flutter', 'Dart', 'SQLite', 'Bloc', 'API Integration'],
        packages: ['flutter_bloc', 'sqflite', 'just_audio', 'audio_session', 'shared_preferences', 'dio'],
        features: [
            'Complete Quran text with Tajweed',
            'Multiple reciters audio',
            'Translations in multiple languages',
            'Bookmarking and notes',
            'Search functionality',
            'Daily verse notifications'
        ],
        screenshots: [
            'assets/qurany/1.png',
            'assets/qurany/2.png',
            'assets/qurany/3.png',
            'assets/qurany/4.png',
            'assets/qurany/5.png',
            'assets/qurany/6.png',
            'assets/qurany/7.png',
            'assets/qurany/8.png',
            'assets/qurany/9.png',
            'assets/qurany/10.png',
            'assets/qurany/11.png'
        ],
        github: 'https://github.com/AhmedAbdElrahman117/qurany',
        store: null
    },
    attend_sys: {
        id: 'attend_sys',
        title: 'Attendance System',
        description: 'A GPS-based employee attendance tracking system. Employees can check in and out using their location, and managers can monitor attendance records and generate reports.',
        image: 'assets/attend_sys/icon.png',
        technologies: ['Flutter', 'Dart', 'Supabase', 'Bloc', 'GPS'],
        packages: ['flutter_bloc', 'supabase_flutter', 'geolocator', 'google_maps_flutter', 'workmanager', 'fl_chart'],
        features: [
            'GPS-based check-in/check-out',
            'Geofencing for location verification',
            'Attendance history and reports',
            'Leave management',
            'Manager dashboard',
            'Export reports to PDF/Excel'
        ],
        screenshots: [
            'assets/attend_sys/1.png',
            'assets/attend_sys/2.png',
            'assets/attend_sys/3.png',
            'assets/attend_sys/4.png',
            'assets/attend_sys/5.png'
        ],
        github: 'https://github.com/AhmedAbdElrahman117/attendance-system',
        store: null
    },
    auth: {
        id: 'auth',
        title: 'Auth App',
        description: 'An authentication application demonstrating various login methods including email/password, Google Sign-In, Facebook Login, and phone authentication.',
        image: 'assets/auth/logo.png',
        technologies: ['Flutter', 'Dart', 'Firebase', 'Provider'],
        packages: ['firebase_auth', 'google_sign_in', 'flutter_facebook_auth', 'provider', 'flutter_secure_storage'],
        features: [
            'Email/Password authentication',
            'Google Sign-In',
            'Facebook Login',
            'Phone number authentication',
            'Password reset functionality',
            'Secure token storage'
        ],
        screenshots: [
            'assets/auth/1.png',
            'assets/auth/2.png',
            'assets/auth/3.png'
        ],
        github: 'https://github.com/AhmedAbdElrahman117/auth-app',
        store: null
    },
    my_news: {
        id: 'my_news',
        title: 'News App',
        description: 'A news aggregator application that fetches news from various sources. Users can browse by categories, search for specific topics, and bookmark articles for later reading.',
        image: 'assets/my_news/icon.png',
        technologies: ['Flutter', 'Dart', 'REST API', 'Bloc', 'Hive'],
        packages: ['flutter_bloc', 'dio', 'hive', 'cached_network_image', 'webview_flutter', 'share_plus'],
        features: [
            'Browse news by categories',
            'Search functionality',
            'Bookmark articles',
            'Share articles',
            'Offline reading mode',
            'Dark/Light theme support'
        ],
        screenshots: [
            'assets/my_news/1.png'
        ],
        github: 'https://github.com/AhmedAbdElrahman117/news-app',
        store: null
    }
};

const certificatesData = [
    {
        id: 'beginner',
        title: 'Dart & Flutter Beginner',
        image: 'assets/Certificates/beginner.jpg',
        url: 'https://www.udemy.com/certificate/UC-12345'
    },
    {
        id: 'bloc_mvvm',
        title: 'Bloc & MVVM',
        image: 'assets/Certificates/BlocAndMVVM.jpg',
        url: 'https://www.udemy.com/certificate/UC-12346'
    },
    {
        id: 'git_github',
        title: 'Git & GitHub',
        image: 'assets/Certificates/gitAndGithub.jpg',
        url: 'https://www.udemy.com/certificate/UC-12347'
    },
    {
        id: 'payment_integration',
        title: 'Payment Integration',
        image: 'assets/Certificates/paymentIntegration.jpg',
        url: 'https://www.udemy.com/certificate/UC-12348'
    },
    {
        id: 'responsive_ui',
        title: 'Responsive UI',
        image: 'assets/Certificates/responsiveUI.jpg',
        url: 'https://www.udemy.com/certificate/UC-12349'
    },
    {
        id: 'clean_architecture',
        title: 'Clean Architecture',
        image: 'assets/Certificates/CleanArchitecture.jpg',
        url: 'https://www.udemy.com/certificate/UC-12350'
    }
];

const contactInfo = {
    address: 'Egypt, Cairo',
    phone: '+20 100 051 2414',
    email: 'ahmedaboelnaga713@gmail.com'
};

const techStackData = [
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
];

const typewriterTexts = [
    'Ahmed Abdelrahman',
    'Flutter Developer',
];
