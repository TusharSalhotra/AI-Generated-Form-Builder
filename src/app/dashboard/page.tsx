'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FormItem {
  id: string;
  title: string;
  createdAt: string;
}

const primaryActionClass =
  'inline-flex items-center justify-center rounded-xl border border-cyan-600 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-cyan-700 hover:bg-cyan-700 dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950 dark:hover:border-cyan-300 dark:hover:bg-cyan-300';

const secondaryActionClass =
  'inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200';

const createFormLinkClass =
  'inline-flex items-center justify-center rounded-xl border border-cyan-600 bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-cyan-700 hover:bg-cyan-700 dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950 dark:hover:border-cyan-300 dark:hover:bg-cyan-300';

export default function DashboardPage() {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Your forms
          </h1>
        </div>
        <Link href="/builder" className={createFormLinkClass}>
          Create New Form
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/85 p-8 text-center shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80">
          <p className="text-base font-medium text-slate-700 dark:text-slate-200">
            Loading forms...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/90 p-8 text-center shadow-sm dark:border-red-800/30 dark:bg-red-900/10">
          <p className="text-base font-medium text-red-700 dark:text-red-200">
            {error}
          </p>
        </div>
      ) : forms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/85 p-8 text-center shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80">
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            No forms created yet
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Create your first form to get started with SmartForm AI.
          </p>
          <div className="mt-6">
            <Link href="/builder" className={createFormLinkClass}>
              Create New Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {forms.map((form) => (
            <div
              key={form.id}
              className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {form.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Created{' '}
                    {new Date(form.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={`/builder?formId=${form.id}`}
                  className={primaryActionClass}
                >
                  Edit
                </Link>
                <Link
                  href={`/form/${form.id}`}
                  className={secondaryActionClass}
                >
                  View
                </Link>
                <Link
                  href={`/analytics/${form.id}`}
                  className={secondaryActionClass}
                >
                  Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
