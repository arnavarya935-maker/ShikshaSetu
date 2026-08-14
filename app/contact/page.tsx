import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-20 mt-16" aria-labelledby="contact-heading">
        <header className="mb-10 text-center">
          <h1 id="contact-heading" className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-rose-600 dark:text-rose-500">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400">
            Have questions, feedback, or need support? We'd love to hear from you.
          </p>
        </header>

        <form className="space-y-6 bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-2xl shadow-elevated border border-slate-100 dark:border-zinc-800" aria-label="Contact Form">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              aria-required="true"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow text-slate-900 dark:text-white"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              aria-required="true"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow text-slate-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              required
              aria-required="true"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow text-slate-900 dark:text-white"
              placeholder="How can we help?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
              Message
            </label>
            <textarea
              id="message"
              required
              aria-required="true"
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow text-slate-900 dark:text-white resize-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors focus:ring-4 focus:ring-rose-500/50 outline-none"
            aria-label="Submit Contact Form"
          >
            Send Message
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
