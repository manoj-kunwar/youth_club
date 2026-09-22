'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function MemberForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-slate-100">
      <div className="w-full max-w-md space-y-6">
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
                Member Support
              </span>
            </div>
          </Link>
        </div>

        <Card className="border border-slate-700/80 shadow-2xl bg-slate-900/90 backdrop-blur text-slate-100">
          <CardHeader className="space-y-1 text-center p-4 sm:p-6 pb-2">
            <div className="h-12 w-12 rounded-full bg-red-950 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center mb-1">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Password Assistance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-400">
              Direct and secure account recovery for club members
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4 sm:p-6 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                To maintain community account security and protect youth club records, automated email OTP codes are disabled.
              </p>
              <p>
                If you have forgotten your password or need your login credentials reset, please contact the club administration office with your Member ID or registered phone number.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-800/60 text-xs">
                <Mail className="h-4 w-4 text-red-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Club Helpdesk Email</p>
                  <p className="text-slate-400 text-[11px]">support@highschoolyouthclub.org</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-800/60 text-xs">
                <Phone className="h-4 w-4 text-red-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Administration Office</p>
                  <p className="text-slate-400 text-[11px]">+977-1-4XXXXXX (Sun-Fri 9AM - 5PM)</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 p-4 sm:p-6 pt-0">
            <Link href="/contact" className="w-full">
              <Button
                variant="outline"
                className="w-full text-xs font-semibold h-10 border-slate-700 hover:bg-slate-800 text-slate-200"
              >
                Submit Support Message
              </Button>
            </Link>

            <Link href="/member/login" className="w-full">
              <Button
                variant="ghost"
                className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-transparent"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Member Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
