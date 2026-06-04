'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { FormSchema } from '@/types/form.types';
import { submitForm } from '@/lib/api';
import { FieldRenderer } from './FieldRenderer';
import { Button, Card } from '@/components/shared';

interface FormRendererProps {
  schema: FormSchema;
  version?: string;
}

export function FormRenderer({ schema, version = 'A' }: FormRendererProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
      await submitForm(schema.id, values, version);
      setMessage('Submission saved successfully');
      event.currentTarget.reset();
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="gradient-stroke mx-auto w-full max-w-2xl p-8 shadow-xl shadow-slate-900/10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {schema.title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please fill out all required fields
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            formId={schema.id}
            version={version}
          />
        ))}

        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <Button
            type="submit"
            isLoading={submitting}
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>

      {message ? (
        <div className="mt-6 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/90 dark:bg-emerald-900/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
          ✓ {message}
        </div>
      ) : null}
      {error ? (
        <div className="mt-6 rounded-xl border border-red-300 dark:border-red-700 bg-red-50/90 dark:bg-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          ✕ {error}
        </div>
      ) : null}
    </Card>
  );
}
