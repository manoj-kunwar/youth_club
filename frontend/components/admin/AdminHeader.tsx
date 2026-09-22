'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Plus, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

interface AdminHeaderProps {
  title?: string;
  onMenuToggle?: () => void;
}

export function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const { user, profile, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border/60 bg-card/90 backdrop-blur px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="font-heading text-xs xxs:text-sm sm:text-lg font-bold text-foreground truncate max-w-[130px] xxs:max-w-[180px] sm:max-w-none">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Add Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden xxs:inline">Create New</span>
              <span className="xxs:hidden">New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href="/admin/events/new" className="cursor-pointer">
                New Event
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/notices/new" className="cursor-pointer">
                New Notice
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/gallery" className="cursor-pointer">
                Upload Media
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/activities" className="cursor-pointer">
                New Activity
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring p-0.5">
              <Avatar className="h-8 w-8 border border-border overflow-hidden relative">
                {(profile?.avatar || (user?.user_metadata?.avatar as string)) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile?.avatar || (user?.user_metadata?.avatar as string)}
                    alt={profile?.fullName || 'Admin avatar'}
                    className="h-full w-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {(profile?.fullName || (user?.user_metadata?.fullName as string) || user?.email || 'AD').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="w-fit text-[10px] mt-1 capitalize">
                  {profile?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
