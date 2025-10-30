import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to appropriate dashboard
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/');
      }
    } else {
      // If user is not logged in, redirect to login page
      navigate('/login');
    }
  };

  return (
    <section className="py-20 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full text-sm bg-neutral-100/60 dark:bg-neutral-900/40">
          <span className="text-primary-700 font-semibold">New</span>
          <span className="text-neutral-600">AI-powered assignments & feedback</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Build better learning experiences with <span className="bg-accent-bluePurple bg-clip-text text-transparent">fast, beautiful tools</span>
        </h2>

        <p className="text-lg text-neutral-600 max-w-xl">
          Manage courses, lectures, and assignments in one place — with real-time collaboration and intelligent grading.
        </p>

        <div className="flex items-center gap-4">
          <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
          <button className="py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-common">View Docs</button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="card-glass flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center" />
            <div>
              <div className="text-sm font-semibold">Live Classes</div>
              <div className="text-xs text-neutral-500">Real-time sessions</div>
            </div>
          </div>

          <div className="card-glass flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center" />
            <div>
              <div className="text-sm font-semibold">Auto Grading</div>
              <div className="text-xs text-neutral-500">Speed up assessments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-xl overflow-hidden shadow-soft-2 float-slow">
          <img src="/assets/hero-illustration.png" alt="illustration" className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
}