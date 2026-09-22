'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-105 min-w-0">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-red-500/50 shadow-lg bg-white">
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
                Administrative Control Room
              </span>
            </div>
          </Link>
        </div>

        <Card className="border border-red-500/20 shadow-2xl bg-slate-900/90 backdrop-blur text-slate-100">
          <CardHeader className="space-y-1 text-center p-4 sm:p-6 pb-2">
            <div className="h-12 w-12 rounded-full bg-red-950 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center mb-1">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Admin Password Recovery
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-400">
              Restricted security protocol for administrative accounts
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4 sm:p-6 pt-2">
            <div className="rounded-xl border border-red-950/60 bg-red-950/20 p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-red-400">
                Automated credential recovery is restricted for staff & administrators.
              </p>
              <p>
                Administrative access holds elevated privileges over community data and portal operations. Password resets require manual verification and clearance by a Super Administrator.
              </p>
              <p>
                Please contact the Super Administrator directly or contact internal system operations with your Admin ID.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 p-4 sm:p-6 pt-0">
            <Link href="/admin/login" className="w-full">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-10 shadow-lg shadow-red-950/50"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Return to Admin Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
