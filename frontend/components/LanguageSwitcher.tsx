'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'dropdown' | 'mobile';
}

export function LanguageSwitcher({ className, variant = 'pill' }: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className={cn('flex items-center justify-between p-2 rounded-xl bg-muted/60 border border-border/70', className)}>
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Languages className="h-4 w-4 text-primary" />
          <span>भाषा / Language</span>
        </div>
        <div className="flex items-center p-0.5 rounded-lg bg-background border border-border/60">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
              language === 'en'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            🇬🇧 English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ne')}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
              language === 'ne'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            🇳🇵 नेपाली
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn(
        'inline-flex items-center p-0.5 rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur transition-all duration-200',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200',
          language === 'en'
            ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-500/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
      >
        <span className="text-xs">🇬🇧</span>
        <span>English</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ne')}
        aria-pressed={language === 'ne'}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200',
          language === 'ne'
            ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-500/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
      >
        <span className="text-xs">🇳🇵</span>
        <span>नेपाली</span>
      </button>
    </div>
  );
}
