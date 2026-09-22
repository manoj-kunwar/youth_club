import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  backgroundImage?: string;
  overlayClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  className,
  backgroundImage,
  overlayClassName,
}: PageHeaderProps) {
  const hasBg = Boolean(backgroundImage);

  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-border/40 py-12 md:py-16',
        !hasBg && 'bg-gradient-to-b from-muted/50 via-background to-background',
        hasBg && 'text-white',
        className
      )}
      style={
        hasBg
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      {/* If hasBg, apply dark overlay for high text contrast; otherwise subtle aura */}
      {hasBg ? (
        <div
          className={cn(
            'absolute inset-0 z-0 pointer-events-none',
            overlayClassName || 'bg-black/70 bg-gradient-to-b from-black/85 via-black/60 to-black/85'
          )}
        />
      ) : (
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      )}

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className={cn("mb-4 flex items-center gap-1.5 text-xs", hasBg ? "text-slate-300" : "text-muted-foreground")}>
            <Link href="/" className={cn("transition-colors", hasBg ? "text-slate-300 hover:text-white" : "hover:text-foreground")}>
              Home
            </Link>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className={cn("h-3 w-3", hasBg ? "text-slate-400" : "text-muted-foreground/60")} />
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn("transition-colors", hasBg ? "text-slate-300 hover:text-white" : "hover:text-foreground")}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn("font-medium", hasBg ? "text-white" : "text-foreground")}>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            {badge && (
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                hasBg
                  ? "bg-red-600/80 text-white border border-red-400/30 backdrop-blur-sm"
                  : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
              )}>
                {badge}
              </span>
            )}
            <h1 className={cn(
              "font-heading text-2xl xxs:text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl break-words",
              hasBg ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]" : "text-foreground"
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                "text-sm sm:text-lg leading-relaxed",
                hasBg ? "text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" : "text-muted-foreground"
              )}>
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
