'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const isAdminOrMod =
    profile?.role === 'SUPER_ADMIN' ||
    profile?.role === 'ADMIN' ||
    profile?.role === 'CONTENT_MANAGER' ||
    profile?.role === 'EVENT_MANAGER';

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/activities', label: t('nav.activities') },
    { href: '/events', label: t('nav.events') },
    { href: '/members', label: t('nav.members') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/notices', label: t('nav.notices') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors duration-200">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 transition-transform hover:scale-[1.02] min-w-0 shrink">
          <div className="relative h-9 w-9 xxs:h-10 xxs:w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-red-600/30 shadow-md bg-white">
            <Image
              src="/logo.png"
              alt="High School Youth Club Logo"
              fill
              sizes="(max-width: 374px) 36px, (max-width: 639px) 40px, 44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-heading font-black text-xs xxs:text-sm sm:text-base lg:text-lg leading-tight tracking-tight text-foreground truncate max-w-[140px] xxs:max-w-[170px] xs:max-w-[210px] sm:max-w-none">
              {t('common.siteName')}
            </span>
            <span className="text-[9px] xxs:text-[10px] sm:text-[11px] text-muted-foreground tracking-wide font-medium truncate max-w-[130px] xxs:max-w-[160px] xs:max-w-[200px] sm:max-w-none">
              {t('common.siteAddress')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-2.5 py-1.5 rounded-md transition-colors relative whitespace-nowrap',
                  isActive
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Language | Theme | Auth */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 shrink-0">
          {/* Language Switcher (Desktop) */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Theme Switcher (Desktop & Mobile) */}
          <ThemeToggle />

          {/* User Profile or Sign In Button */}
          {isAuthenticated && (profile || user) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 sm:gap-2 rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1 min-h-[44px] min-w-[44px] justify-center">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border overflow-hidden relative">
                    {(profile?.avatar || (user?.user_metadata?.avatar as string)) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={profile?.avatar || (user?.user_metadata?.avatar as string)}
                        alt={profile?.fullName || 'User avatar'}
                        className="h-full w-full object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {(profile?.fullName || (user?.user_metadata?.fullName as string) || (user?.user_metadata?.full_name as string) || user?.email || 'U').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden md:inline-block text-xs font-semibold max-w-[90px] truncate text-left">
                    {(profile?.fullName || (user?.user_metadata?.fullName as string) || (user?.user_metadata?.full_name as string) || user?.email || 'User').split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.fullName || (user?.user_metadata?.fullName as string) || 'Member'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <div className="pt-1">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {profile?.role || 'MEMBER'}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdminOrMod && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer flex items-center text-primary font-medium">
                      <Shield className="mr-2 h-4 w-4" />
                      {t('nav.adminDashboard')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.myProfile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer text-destructive focus:text-destructive flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-xs font-semibold h-9 px-2.5">
                <Link href="/member/login">{t('nav.signIn')}</Link>
              </Button>
              <Button size="sm" asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 px-3 shadow-sm">
                <Link href="/member/register">{t('nav.joinClub')}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label={mobileOpen ? t('nav.close') : t('nav.menu')}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-b border-border/80 bg-background/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100dvh-4rem)] overflow-y-auto">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher variant="mobile" />

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdminOrMod && (
                  <Button variant="outline" asChild className="w-full justify-start text-primary h-11 min-h-[44px] text-sm">
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <Shield className="mr-2 h-4 w-4" />
                      {t('nav.adminDashboard')}
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild className="w-full justify-start h-11 min-h-[44px] text-sm">
                  <Link href="/profile" onClick={() => setMobileOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.myProfile')}
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start h-11 min-h-[44px] text-sm"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.signOut')}
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="outline" className="h-11 min-h-[44px] text-xs font-semibold" asChild onClick={() => setMobileOpen(false)}>
                  <Link href="/member/login">{t('nav.signIn')}</Link>
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold h-11 min-h-[44px] text-xs shadow-sm" asChild onClick={() => setMobileOpen(false)}>
                  <Link href="/member/register">{t('nav.joinClub')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
