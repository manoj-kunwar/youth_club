import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({
  tagline,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl space-y-3',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        align === 'right' && 'ml-auto text-right',
        className
      )}
    >
      {tagline && (
        <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
          {tagline}
        </p>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
