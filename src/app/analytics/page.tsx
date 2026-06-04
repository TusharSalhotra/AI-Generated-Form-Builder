'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ExternalLink, Loader2, Sparkles } from 'lucide-react';

interface FormItem {
  id: string;
  title: string;
  createdAt: string;
}

export default function AnalyticsIndexPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadForms() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/forms', {
          credentials: 'same-origin',
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load forms');
        }

        setForms(data.data || []);
      } catch (err) {
        setError((err as Error).message || 'Unable to load forms');
      } finally {
        setLoading(false);
      }
    }

    loadForms();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
              Analytics
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Form performance
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Open a form analytics dashboard to compare A/B versions,
              interactions, submissions, and completion rate.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300">
            <BarChart3 size={26} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/85 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
          <Loader2 className="mb-3 animate-spin text-cyan-600" size={28} />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading analytics options...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/90 p-8 text-center shadow-sm dark:border-red-800/30 dark:bg-red-900/10">
          <p className="text-base font-medium text-red-700 dark:text-red-200">
            {error}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <AnalyticsCard
            href="/analytics/demo-form"
            title="Demo A/B Analytics"
            description="View seeded Version A vs Version B data while real analytics are not available."
            demo
          />

          {forms.map((form) => (
            <AnalyticsCard
              key={form.id}
              href={`/analytics/${form.id}`}
              title={form.title}
              description={`Created ${new Date(
                form.createdAt
              ).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function AnalyticsCard({
  href,
  title,
  description,
  demo = false,
}: {
  href: string;
  title: string;
  description: string;
  demo?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50/60 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300">
            {demo ? <Sparkles size={20} /> : <BarChart3 size={20} />}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
        <ExternalLink
          className="shrink-0 text-slate-400 transition group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
          size={18}
        />
      </div>
    </Link>
  );
}
