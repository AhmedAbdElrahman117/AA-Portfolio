# Ahmed Abdelrahman — Portfolio

A modern, fully dynamic personal portfolio website built with **Astro** and **React**, powered by **Firebase Firestore** as a headless CMS. All content — projects, skills, certificates, services, and personal info — is editable in real time through a built-in password-protected dashboard, with images hosted on **Cloudinary**.

🌐 **Live:** [ahmedabdelrahman117.github.io/AA-Portfolio](https://ahmedabdelrahman117.github.io/AA-Portfolio/)

---

## ✨ Features

### Portfolio
- **Animated splash screen** with scroll-unlock
- **Sticky responsive navbar** with active-section highlighting
- **Home** — typewriter effect, social links, and CV download
- **About** — profile image, full name, bio paragraphs, and animated stats counter
- **Skills** — tech stack grid, soft-skill & language progress bars
- **Services** — card grid of offered services
- **Projects** — filterable project cards with detail modal (GitHub link, tech tags, description)
- **Certificates** — image-lightbox gallery with external link support
- **Contact** — contact info + animated form

### Dashboard (CMS)
Password-protected admin panel accessible at `/AA-Portfolio/dashboard/`

| Section | What you can manage |
|---|---|
| **Analytics** | Page view counts and visitor stats |
| **Home** | Typewriter texts, social links, CV file |
| **About** | Profile image (Cloudinary upload), full name, bio paragraphs |
| **Skills** | Tech stack items, soft skills, language skills (drag-and-drop reorder) |
| **Services** | Service cards (add / edit / delete) |
| **Projects** | Project cards (add / edit / delete / reorder) |
| **Certificates** | Certificate images and links (add / edit / delete) |
| **Contact** | Address, phone, email |

> **Profile image uploads** automatically delete the old Cloudinary asset and upload the new one, then save the URL to Firestore.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro 5](https://astro.build/) |
| **UI Components** | [React 19](https://react.dev/) (island architecture via `@astrojs/react`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database / Auth** | [Firebase Firestore + Firebase Auth](https://firebase.google.com/) |
| **Image Hosting** | [Cloudinary](https://cloudinary.com/) (via custom Cloudflare Worker proxy) |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (core, sortable, utilities) |
| **Alerts / Modals** | [SweetAlert2](https://sweetalert2.github.io/) |
| **Date Utilities** | [date-fns](https://date-fns.org/) |
| **Date Picker** | [react-datepicker](https://reactdatepicker.com/) |
| **Deployment** | GitHub Pages (via GitHub Actions) |

---

## 📁 Project Structure

```
/
├── public/                    # Static assets (images, icons, CV, fonts)
│   ├── assets/
│   │   ├── TechStack/         # Skill icons
│   │   ├── projects/          # Project thumbnails
│   │   └── Certificates/      # Certificate images
│   └── css/
│       └── dashboard.css
│
├── src/
│   ├── pages/
│   │   ├── index.astro        # Main portfolio page
│   │   └── dashboard/
│   │       └── index.astro    # Dashboard entry point
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   ├── SplashScreen.astro
│   │   │   └── AnimatedBackground.astro
│   │   │
│   │   ├── portfolio/         # One Astro component per section
│   │   │   ├── Home.astro
│   │   │   ├── About.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Services.astro
│   │   │   ├── Portfolio.astro
│   │   │   ├── Certificates.astro
│   │   │   └── Contact.astro
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardApp.jsx   # Root React app (auth gate)
│   │   │   ├── CMSManager.jsx     # Sidebar layout + tab routing
│   │   │   ├── Login.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── managers/          # One manager per content section
│   │   │       ├── AnalyticsManager.jsx
│   │   │       ├── HomeManager.jsx
│   │   │       ├── AboutManager.jsx
│   │   │       ├── SkillsManager.jsx
│   │   │       ├── ServicesManager.jsx
│   │   │       ├── ProjectsManager.jsx
│   │   │       ├── CertificatesManager.jsx
│   │   │       └── ContactManager.jsx
│   │   │
│   │   └── common/            # Shared UI components
│   │
│   ├── lib/
│   │   ├── firebase.js        # Firebase init, default data, getPortfolioData()
│   │   ├── uploadService.js   # Cloudinary upload/delete via Cloudflare Worker
│   │   └── utils.js           # Shared utility functions
│   │
│   └── styles/                # Global CSS / Tailwind base
│
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm **9+**

### Installation

```sh
# 1. Clone the repository
git clone https://github.com/AhmedAbdElrahman117/AA-Portfolio.git
cd AA-Portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The site will be available at **http://localhost:4321/AA-Portfolio/**

---

## 🔧 Commands

| Command | Action |
|---|---|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro ...` | Run Astro CLI commands |

---

## 🔑 Dashboard Usage

1. Navigate to `/AA-Portfolio/dashboard/`
2. Sign in with your Firebase email & password
3. Use the sidebar to switch between content sections
4. Edit content and click **Save Changes** — all updates are written to Firestore in real time and reflected on the live portfolio immediately

### Profile Image Upload Flow
1. Click the image field → select a local image → instant local preview appears
2. Click **Save Changes**
3. The old Cloudinary image is **deleted**, the new image is **uploaded**, and the resulting Cloudinary URL is **saved to Firestore**

---

## ☁️ Deployment

The project is deployed to **GitHub Pages** automatically via GitHub Actions on every push to `main`.

```sh
# Build for production
npm run build
```

The `astro.config.mjs` is pre-configured with:
```js
site: 'https://ahmedabdelrahman117.github.io',
base: '/AA-Portfolio/',
```

---

## 📄 License

This project is for personal portfolio use. Feel free to use it as inspiration for your own portfolio.
