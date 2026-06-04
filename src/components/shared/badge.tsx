import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-200/90 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100',
    primary: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-200',
    success: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200',
    warning: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200',
    error: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200',
    outline:
      'border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-100',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
