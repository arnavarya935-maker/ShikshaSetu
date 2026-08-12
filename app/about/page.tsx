import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { Users, BookOpen, Sparkles, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'About — ShikshaSetu',
  description: 'Learn about ShikshaSetu, our mission to make AI-powered education accessible, and the team behind the platform.',
};

const values = [
  { icon: Sparkles, title: 'AI-First Learning', description: 'Every feature is designed with intelligent AI at its core to adapt to each student.' },
  { icon: BookOpen, title: 'Accessible Education', description: 'Quality learning tools available to everyone, regardless of background or location.' },
  { icon: Users, title: 'Community Driven', description: 'Built with feedback from students and teachers to solve real classroom challenges.' },
  { icon: GraduationCap, title: 'Outcome Focused', description: 'We measure success by student outcomes, not just engagement metrics.' },
];

export default function AboutPage() {
  return (
    <main className="bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero */}
      <AnimatedSection className="relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400/80">About us</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Building the future of learning, one student at a time.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            ShikshaSetu is an AI-powered learning management platform designed to help students study smarter, 
            track progress effortlessly, and achieve their academic goals with confidence.
          </p>
        </div>
      </AnimatedSection>

      {/* Mission */}
      <AnimatedSection className="border-t border-slate-800/70 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Our mission</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Making quality education intelligent and personal.
              </h2>
              <p className="text-lg leading-8 text-slate-300">
                We believe every student deserves access to adaptive study tools that understand their pace, 
                strengths, and areas for improvement. ShikshaSetu bridges the gap between traditional learning 
                and modern AI technology.
              </p>
              <p className="text-base leading-7 text-slate-400">
                From AI-generated quizzes to instant doubt solving, our platform turns scattered study sessions 
                into structured, goal-driven learning journeys. Teachers get powerful analytics and course management 
                tools to guide their students effectively.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-white">AI</p>
                  <p className="mt-1 text-sm text-slate-400">Powered Tools</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">3</p>
                  <p className="mt-1 text-sm text-slate-400">User Roles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="mt-1 text-sm text-slate-400">AI Support</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">Free</p>
                  <p className="mt-1 text-sm text-slate-400">To Get Started</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection className="border-t border-slate-800/70 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Our values</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">What drives us</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                  <p className="text-sm leading-6 text-slate-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
