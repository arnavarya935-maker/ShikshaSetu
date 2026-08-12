'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero */}
      <AnimatedSection className="relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400/80">Get in touch</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            We&apos;d love to hear from you.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Have a question, feedback, or partnership idea? Reach out and our team will get back to you as soon as possible.
          </p>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection className="border-t border-slate-800/70 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            {/* Info Cards */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Contact Information</h2>
              <p className="text-base leading-7 text-slate-400">
                Whether you&apos;re a student, teacher, or institution — we&apos;re here to help you get the most out of ShikshaSetu.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Mail className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p className="mt-1 text-sm text-slate-400">support@shikshasetu.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <MapPin className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="mt-1 text-sm text-slate-400">India (Remote-first team)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Clock className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Response Time</p>
                    <p className="mt-1 text-sm text-slate-400">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25">
                    <Send className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Message sent! 🎉</h3>
                  <p className="text-slate-400">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-semibold text-white">Send us a message</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-400">Name</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Subject</label>
                    <input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                      className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                      className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
