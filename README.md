# 🎓 ShikshaSetu (शिक्षासेतु)

> **Next-Generation AI-Powered Adaptive Learning Platform**

ShikshaSetu is a modern educational platform designed to transform scattered notes, PDFs, and study goals into personalized lessons, interactive practice quizzes, and calm, structured progress insights.

---

## 🌟 Key Features

### 🧠 AI-Powered Learning Tools
- **AI Notes & Syllabus Summarizer**: Instantly converts raw notes or PDF readings into executive summaries, key bullet takeaways, and interactive 3D flip flashcards.
- **Dynamic AI Quiz Builder**: Generates customized multiple-choice practice quizzes from any academic subject or uploaded document.
- **PDF to Quiz Converter**: Drag & drop any PDF syllabus or textbook chapter to automatically compile exam-ready quiz questions.
- **24/7 AI Study Tutor**: Interactive AI chat workspace to explain complex concepts, solve homework doubts, and review code blocks.
- **AI Study Calendar & Sprints**: Builds weekly milestone targets based on your target completion timeline and daily hours commitment.
- **AI Focus Recommendations**: Analyzes course progress and recommends next steps and complementary courses.

### 🏫 Multi-Role LMS Portals
- **Student Dashboard**: Streak tracking, course progress overview, interactive study tools workspace, assignment submission, and verifiable certificate generation.
- **Teacher Workspace**: Course management, student analytics, assignment publishing, and class schedule management.
- **Admin Control Panel**: Platform-wide metrics, user role management, system settings, and course catalog configuration.

### 🎨 Premium SynthAI Design System
- **Light & Dark Mode**: Toggle between high-contrast dark mode and soft pastel light mode with customizable theme tokens.
- **Scroll-Driven Feature Animations**: Sticky 60fps card progression powered by Framer Motion spring physics.
- **Multi-Language Support**: Seamless language switcher supporting **English (`en`)** and **Hindi (`hi`)**.
- **Responsive Layout**: Designed for mobile phones, tablets, and desktop displays.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) (Email/Password & Google Sign-In)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **PDF Extraction**: `pdfjs-dist`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bishtprateek270-hue/ShikshaSetu.git
   cd ShikshaSetu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Repository Structure

```
ShikshaSetu/
├── app/                      # Next.js App Router routes & pages
│   ├── api/                  # Backend API routes
│   ├── courses/              # Course catalog & detail pages
│   ├── dashboard/            # Student, Teacher, and Admin LMS portals
│   ├── learn/                # Course player, lessons, and certificate generator
│   ├── login/ & signup/      # Authentication shells
│   ├── globals.css           # Global design system & theme variables
│   └── page.tsx              # Homepage
├── components/               # Reusable UI components
│   ├── lms/                  # LMS specific panels (AI Tutor, Quiz, Summary, Planner)
│   ├── FeaturesSection.tsx   # Sticky scroll-driven feature showcase
│   ├── HeroSection.tsx       # Landing hero with AI showcase mockup
│   ├── Navbar.tsx            # Header navigation & theme/language toggle
│   └── Footer.tsx            # Multi-column footer
├── lib/                      # Business logic, Firebase config, & AI integrations
│   ├── ai/                   # AI client utilities
│   ├── firebase/             # Firebase SDK initialization & auth helpers
│   ├── language/             # Localization context (English & Hindi)
│   └── lms/                  # LMS data schemas & course catalogs
├── public/                   # Static assets & icons
└── tailwind.config.ts        # Custom colors, shadows, and design tokens
```

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` – Starts the development server at `http://localhost:3000`.
- `npm run build` – Compiles an optimized production build.
- `npm run start` – Starts the production server after building.
- `npm run lint` – Runs Next.js ESLint checks.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
