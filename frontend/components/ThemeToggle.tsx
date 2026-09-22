'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className={`h-9 w-9 rounded-full border border-border/60 ${className || ''}`}
        disabled
      >
        <Sun className="h-4 w-4 text-amber-500" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? t('nav.themeLight') : t('nav.themeDark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative h-9 w-9 rounded-full border border-border/70 bg-background/80 hover:bg-muted transition-all duration-300 shadow-sm ${className || ''}`}
    >
      <Sun
        className={`h-4 w-4 text-amber-500 transition-transform duration-500 absolute ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Moon
        className={`h-4 w-4 text-indigo-400 transition-transform duration-500 absolute ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
