import { cn } from '@/lib/utils';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Loader({ size = 'md', className }: LoaderProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-cyan-500/80 border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export interface PageLoaderProps {
  message?: string;
}

function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Loader size="lg" />
      <p className="text-sm text-[var(--muted-foreground)]">{message}</p>
    </div>
  );
}

export { Loader, PageLoader };
