import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-20 mt-16" aria-labelledby="about-heading">
        <header className="mb-12 text-center">
          <h1 id="about-heading" className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-rose-600 dark:text-rose-500">
            About ShikshaSetu
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Empowering learners worldwide through AI-driven education and seamless knowledge accessibility.
          </p>
        </header>

        <section className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-elevated border border-slate-100 dark:border-zinc-800">
          <article>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
              ShikshaSetu was built to transform the way students and educators interact with learning materials. 
              By leveraging cutting-edge Artificial Intelligence, we turn static PDFs and messy notes into 
              interactive quizzes, detailed summaries, and actionable insights.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-bold mb-3">Why Premium?</h2>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
              We believe that an exceptional learning environment requires an exceptional design. 
              Our premium interface minimizes distractions while keeping you focused and engaged. 
              With a built-in focus on accessibility, learning has never been this intuitive.
            </p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
