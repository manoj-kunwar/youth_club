'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { MemberSignInCard } from '@/components/auth/MemberSignInCard';

function MemberLoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-slate-100">
      <div className="w-full max-w-md space-y-6 my-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-105 min-w-0">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-red-500/50 shadow-md bg-white">
              <Image
                src="/logo.png"
                alt="High School Youth Club Logo"
                fill
                sizes="(max-width: 639px) 48px, 56px"
                className="object-cover"
                priority
              />
            </div>
            <div className="text-left min-w-0">
              <span className="font-heading font-extrabold text-base xxs:text-lg sm:text-xl leading-tight block text-white truncate max-w-[200px] xxs:max-w-none">
                HIGH SCHOOL YOUTH CLUB
              </span>
              <span className="text-xs text-red-400 font-bold tracking-wider uppercase block">
                Member Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Existing Member Sign In Form */}
        <MemberSignInCard autoFocus />
      </div>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      }
    >
      <MemberLoginContent />
    </Suspense>
  );
}
