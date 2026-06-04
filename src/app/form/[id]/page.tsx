'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getFormById } from '@/lib/api';
import type { FormSchema } from '@/types/form.types';
import { FormRenderer } from '@/components/form';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface SelectedFormVersion {
  title: string;
  schema: FormSchema['fields'];
  version: string;
}

interface FormPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FormPage({ params }: FormPageProps) {
  const { id } = use(params);
  const [formData, setFormData] = useState<SelectedFormVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFormById(id);
        if (!response?.data) {
          setError('Form not found.');
          setFormData(null);
        } else {
          const versions =
            response.data.versions && response.data.versions.length > 0
              ? response.data.versions
              : [
                  {
                    id: 'fallback-a',
                    formId: id,
                    label: 'A',
                    schema: response.data.schema,
                    createdAt: new Date().toISOString(),
                  },
                ];
          const selectedVersion =
            versions[Math.floor(Math.random() * versions.length)];

          setFormData({
            title: response.data.title,
            schema: selectedVersion.schema.fields,
            version: selectedVersion.label,
          });
        }
      } catch (error) {
        setError(String(error));
        setFormData(null);
      }
      setLoading(false);
    };

    loadForm();
  }, [id]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-200 hover:bg-white hover:text-cyan-700 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="surface-panel flex min-h-[400px] flex-col items-center justify-center rounded-2xl">
            <div className="mb-4 rounded-full bg-sky-100 p-4 dark:bg-sky-900/30">
              <Loader2
                size={32}
                className="animate-spin text-sky-600 dark:text-sky-400"
              />
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading form...
            </p>
          </div>
        ) : error ? (
          <div className="surface-panel flex min-h-[400px] flex-col items-center justify-center rounded-2xl">
            <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
              Error loading form
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-center">
              {error}
            </p>
          </div>
        ) : formData ? (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {formData.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Please complete this form
              </p>
            </div>
            <FormRenderer
              schema={{ id, title: formData.title, fields: formData.schema }}
              version={formData.version}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
