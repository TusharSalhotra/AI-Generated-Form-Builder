import Link from 'next/link';
import { Button } from '@/components/shared';
import {
  Sparkles,
  MousePointerClick,
  BarChart3,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 soft-grid opacity-30"
        aria-hidden="true"
      />
      {/* Hero Section */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-20 sm:py-28">
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Form Builder</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            SmartForm{' '}
            <span className="bg-linear-to-r from-sky-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent dark:from-sky-400 dark:via-cyan-400 dark:to-emerald-400">
              AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
            AI-powered self-learning form builder. Create intelligent, dynamic
            forms with drag-and-drop simplicity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/builder">
              <Button size="lg" variant="primary">
                <Zap className="h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/form/1">
              <Button variant="outline" size="lg">
                View Sample Form
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 border-t border-slate-200/70 px-4 py-16 dark:border-slate-800 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to build forms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Powerful features to create, manage, and analyze your forms
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <FeatureCard
              icon={<MousePointerClick className="h-6 w-6" />}
              title="Drag & Drop Builder"
              description="Intuitive interface to build forms visually. No coding required."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI Form Generation"
              description="Describe your form in plain text and let AI create it for you."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Smart Analytics"
              description="Self-learning system that improves form performance over time."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-slate-200/70 bg-white/70 px-4 py-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2024 SmartForm AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Documentation
            </button>
            <button
              type="button"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: Readonly<FeatureCardProps>) {
  return (
    <div className="group gradient-stroke h-full rounded-2xl border border-slate-200/90 bg-white/85 p-6 shadow-lg shadow-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-900/10 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600 transition-colors group-hover:bg-cyan-100 group-hover:text-cyan-700 dark:bg-sky-900/30 dark:text-sky-300 dark:group-hover:bg-cyan-900/30 dark:group-hover:text-cyan-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
