import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type ContainerProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export const Container = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: ContainerProps<T>) => {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  );
};
