'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  Users,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  ShieldCheck,
  Settings,
  History,
  ArrowLeft,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: UserRole[];
}

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/notices', label: 'Notices', icon: Bell },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/content', label: 'Content CMS', icon: FileText },
  { href: '/admin/contacts', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/users', label: 'Users & Roles', icon: ShieldCheck, requiredRole: ['SUPER_ADMIN', 'ADMIN'] as UserRole[] },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/audit', label: 'Audit Logs', icon: History, requiredRole: ['SUPER_ADMIN', 'ADMIN'] as UserRole[] },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <aside className="w-64 border-r border-border/60 bg-card text-card-foreground flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-border/50 flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-red-600/30 shadow bg-white">
            <Image
              src="/logo.png"
              alt="High School Youth Club Crest"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm leading-tight text-foreground">
              ADMIN PORTAL
            </h2>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              High School Youth Club
            </span>
          </div>
        </Link>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          Management
        </div>

        {adminNavItems.map((item) => {
          if (item.requiredRole && profile?.role) {
            const hasAccess = item.requiredRole.includes(profile.role);
            if (!hasAccess) return null;
          }

          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px]',
                isActive
                  ? 'bg-red-600 text-white font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info & Public Site Link */}
      <div className="p-4 border-t border-border/50 space-y-3 shrink-0">
        {profile && (
          <div className="px-2 py-1.5 rounded-md bg-muted/50 text-xs">
            <p className="font-semibold truncate">{profile.fullName}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{profile.role}</p>
          </div>
        )}

        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Public Website</span>
        </Link>
      </div>
    </aside>
  );
}

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex w-64 shrink-0 min-h-screen flex-col">
        <SidebarContent />
      </div>

      {/* Mobile overlay drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative flex w-72 max-w-[85vw] h-full flex-col animate-in slide-in-from-left duration-200">
            <SidebarContent onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
