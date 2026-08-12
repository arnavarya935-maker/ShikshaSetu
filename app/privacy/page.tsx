import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';

export const metadata = {
  title: 'Privacy Policy — ShikshaSetu',
  description: 'Read how ShikshaSetu collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you create an account, we collect your name, email address, institute name, and selected role (student, teacher, or admin). We also collect usage data such as course progress, quiz scores, study activity, and platform interactions to personalize your learning experience.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to provide and improve the ShikshaSetu platform, including personalizing AI-powered study tools, generating progress reports, and sending relevant notifications. We use anonymized and aggregated data to improve our AI models and platform features.`,
  },
  {
    title: '3. AI-Powered Features',
    content: `ShikshaSetu uses AI services (including Google Gemini) to power features such as the AI Tutor, Quiz Generator, Notes Summarizer, and Study Planner. Text you submit to these tools is sent to our AI provider for processing. We do not use your data to train third-party AI models.`,
  },
  {
    title: '4. Data Storage & Security',
    content: `Your data is stored securely using Google Firebase (Firestore and Firebase Authentication). We implement industry-standard security measures including encryption in transit (TLS), role-based access controls, and secure authentication tokens to protect your information.`,
  },
  {
    title: '5. Data Sharing',
    content: `We do not sell, rent, or share your personal information with third parties for marketing purposes. We may share data with service providers (Firebase, AI APIs) strictly for platform functionality. Teachers can view progress data for students enrolled in their courses.`,
  },
  {
    title: '6. Your Rights',
    content: `You can access, update, or delete your account information at any time through your profile settings. You can request a copy of your data or request account deletion by contacting us at support@shikshasetu.com.`,
  },
  {
    title: '7. Cookies & Local Storage',
    content: `We use browser local storage to save your theme preference (light/dark mode) and authentication session. We do not use tracking cookies or third-party analytics trackers.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this privacy policy from time to time. We will notify registered users of any significant changes via email or in-platform notification. The latest version will always be available on this page.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero */}
      <AnimatedSection className="relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400/80">Legal</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Your privacy matters to us. This policy explains what data we collect, how we use it, and how we protect it.
          </p>
          <p className="mt-4 text-sm text-slate-500">Last updated: July 2026</p>
        </div>
      </AnimatedSection>

      {/* Content */}
      <AnimatedSection className="border-t border-slate-800/70 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="text-base leading-7 text-slate-400">{section.content}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 mt-12">
            <p className="text-sm text-slate-400">
              If you have questions about this privacy policy, contact us at{' '}
              <a href="mailto:support@shikshasetu.com" className="font-semibold text-violet-400 hover:text-violet-300 transition">
                support@shikshasetu.com
              </a>
            </p>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
