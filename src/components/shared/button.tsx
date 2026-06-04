import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'ai';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:scale-[0.99]';

    const variants = {
      primary:
        'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-cyan-700/25 hover:from-sky-700 hover:to-cyan-700 dark:hover:from-sky-500 dark:hover:to-cyan-500 focus-visible:ring-cyan-400',
      secondary:
        'bg-slate-200/90 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 focus-visible:ring-slate-400',
      outline:
        'border border-slate-300 bg-white/90 text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
      destructive:
        'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-700/25 hover:from-red-700 hover:to-rose-700 dark:hover:from-red-500 dark:hover:to-rose-500 focus-visible:ring-red-400',
      success:
        'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-500 dark:hover:to-teal-500 focus-visible:ring-emerald-400',
      ai: 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-pink-600 text-white shadow-md shadow-fuchsia-700/20 hover:from-fuchsia-700 hover:via-violet-700 hover:to-pink-700 dark:hover:from-fuchsia-500 dark:hover:via-violet-500 dark:hover:to-pink-500 focus-visible:ring-fuchsia-400',
    };

    const sizes = {
      sm: 'h-8 px-4 text-sm gap-1.5',
      md: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-7 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
