# 🎓 ShikshaSetu (शिक्षासेतु)

Welcome to **ShikshaSetu**—a next-generation, AI-driven adaptive learning platform. ShikshaSetu is built to turn your scattered study materials, PDFs, and goals into a unified, interactive, and personalized educational journey.

---

## 🚀 What We Offer

### 🤖 AI-Powered Learning Enhancements
- **Smart Notes & Summaries**: Transform messy notes or long PDFs into concise summaries, key takeaways, and 3D flashcards instantly.
- **Dynamic Quiz Generation**: Automatically generate customized multiple-choice questions from uploaded documents or specific academic topics.
- **24/7 AI Tutor**: Get round-the-clock assistance with complex concepts, homework, and coding problems via an interactive chat workspace.
- **Adaptive Study Planner**: Generate weekly learning milestones based on your specific goals and available daily study time.
- **Intelligent Recommendations**: Receive personalized suggestions for next steps and related courses based on your progress.

### 🏢 Comprehensive Multi-Role Portals
- **Student Dashboard**: Track streaks and progress, access interactive study tools, submit assignments, and earn verifiable certificates.
- **Teacher Workspace**: Manage courses, publish assignments, organize schedules, and monitor student analytics effortlessly.
- **Admin Control Panel**: Oversee the entire platform, manage user roles, configure system settings, and update the course catalog.

### 🎨 Modern SynthAI Design
- **Flexible Themes**: Switch seamlessly between a high-contrast dark mode and a soft, pastel light mode.
- **Engaging UI/UX**: Enjoy 60fps scroll-driven animations powered by Framer Motion.
- **Multilingual Support**: Fully accessible in **English (`en`)** and **Hindi (`hi`)**.
- **Fully Responsive**: Optimized for desktops, tablets, and mobile devices.

---

## 💻 Technology Stack

- **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **PDF Processing**: `pdfjs-dist`

---

## ⚙️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or newer)
- `npm`, `yarn`, or `pnpm`

### Installation Guide

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
   Create an `.env` (or `.env.local`) file in the root directory. You will need the following secrets and variables to run this project properly. 
   
   **Firebase Configuration** (Get these from your Firebase Console):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   
   **AI Integration** (Get this from Google AI Studio):
   - `GEMINI_API_KEY`

   Example `.env` file structure:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
ShikshaSetu/
├── app/                      # Next.js routes, pages, and API endpoints
├── components/               # Reusable UI elements (LMS panels, Navbar, etc.)
├── lib/                      # Core business logic, Firebase setup, and AI utilities
├── public/                   # Static images, icons, and assets
└── tailwind.config.ts        # Custom theme definitions and tokens
```

---

## 📜 Available Scripts

- `npm run dev` – Launch the local development server.
- `npm run build` – Compile the application for production.
- `npm run start` – Run the production build.
- `npm run lint` – Execute ESLint checks.

---

## ⚖️ License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
