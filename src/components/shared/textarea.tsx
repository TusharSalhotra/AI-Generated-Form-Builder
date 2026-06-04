import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'min-h-[120px] w-full rounded-xl border border-slate-300/90 bg-white/90 px-3.5 py-2.5 text-sm shadow-sm dark:border-slate-600 dark:bg-slate-900/85',
            'text-slate-900 dark:text-slate-50',
            'placeholder:text-slate-500 dark:placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 dark:focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800',
            'resize-y',
            error &&
              'border-red-500 dark:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
