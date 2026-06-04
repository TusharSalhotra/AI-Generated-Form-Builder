'use client';

import type { UseFormRegister } from 'react-hook-form';
import { Input, Textarea, Select } from '@/components/shared';
import type { FormField as FormFieldType } from '@/types';

export interface FormFieldProps {
  field: FormFieldType;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
}

export function FormField({ field, register, error }: FormFieldProps) {
  const commonProps = {
    ...register(field.id, {
      required: field.required ? `${field.label} is required` : false,
    }),
    label: field.label,
    placeholder: field.placeholder,
    error,
    required: field.required,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'date':
      return <Input {...commonProps} type={field.type} />;

    case 'textarea':
      return <Textarea {...commonProps} />;

    case 'select':
      return (
        <Select
          {...commonProps}
          options={
            field.options?.map((opt) => ({
              label: opt.label,
              value: opt.value,
            })) || []
          }
          placeholder={field.placeholder || 'Select an option'}
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register(field.id, {
              required: field.required ? `${field.label} is required` : false,
            })}
            id={field.id}
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          <label
            htmlFor={field.id}
            className="text-sm text-[var(--foreground)]"
          >
            {field.label}
            {field.required && (
              <span className="ml-1 text-[var(--color-error-500)]">*</span>
            )}
          </label>
          {error && (
            <p className="text-sm text-[var(--color-error-500)]">{error}</p>
          )}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {field.label}
            {field.required && (
              <span className="ml-1 text-[var(--color-error-500)]">*</span>
            )}
          </label>
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(field.id, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                  className="h-4 w-4 border-[var(--border)]"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm text-[var(--foreground)]"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {error && (
            <p className="text-sm text-[var(--color-error-500)]">{error}</p>
          )}
        </div>
      );

    case 'file':
      return (
        <div className="space-y-1.5">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {field.label}
            {field.required && (
              <span className="ml-1 text-[var(--color-error-500)]">*</span>
            )}
          </label>
          <input
            type="file"
            {...register(field.id, {
              required: field.required ? `${field.label} is required` : false,
            })}
            id={field.id}
            className="block w-full text-sm text-[var(--foreground)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--secondary)] file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-[var(--border)]"
          />
          {error && (
            <p className="text-sm text-[var(--color-error-500)]">{error}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
