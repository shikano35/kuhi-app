import { cn } from '@/lib/cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('bg-accent animate-pulse rounded-md', className)}
      data-slot="skeleton"
    />
  );
}

export { Skeleton };
