'use client';

import { useState } from 'react';
import type { Field } from '@/types/form.types';
import { trackAnalytics } from '@/lib/api';

interface FieldRendererProps {
  field: Field;
  formId: string;
  version?: string;
}

export function FieldRenderer({
  field,
  formId,
  version = 'A',
}: FieldRendererProps) {
  const [focusStart, setFocusStart] = useState<number | null>(null);

  const handleFocus = () => {
    setFocusStart(Date.now());
  };

  const handleBlur = async () => {
    if (!focusStart) return;

    const timeSpent = Math.max(0, Date.now() - focusStart);
    setFocusStart(null);

    try {
      await trackAnalytics({
        formId,
        fieldId: field.id,
        timeSpent,
        version,
      });
    } catch {
      // swallow analytics errors to avoid breaking form UI
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.id}
        className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={field.id}
        name={field.name}
        type={field.type === 'textarea' ? 'text' : field.type}
        placeholder={field.placeholder}
        required={field.required}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full rounded-xl border border-slate-300/90 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 dark:border-slate-600 dark:bg-slate-900/85 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:ring-offset-0"
      />
    </div>
  );
}
