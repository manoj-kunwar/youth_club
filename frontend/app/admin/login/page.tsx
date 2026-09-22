'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { adminLoginApi } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const adminLoginSchema = z.object({
  emailOrId: z.string().min(1, 'Please enter your Admin Email or Admin ID'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/admin/dashboard';
  const redirectUrl = rawRedirect.startsWith('/admin') ? rawRedirect : '/admin/dashboard';
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    try {
      const loginRes = await adminLoginApi({
        emailOrId: data.emailOrId,
        password: data.password,
      });

      await refreshProfile();

      // Verify server-returned role
      const role = loginRes?.user?.role;
      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER'];
      if (role && !adminRoles.includes(role)) {
        toast.error('Access Denied', {
          description: 'Your account lacks administrator privileges.',
        });
        router.push('/');
        return;
      }

      toast.success('Welcome Administrator!', {
        description: 'Signed in successfully to the admin portal.',
      });
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error('Authentication failed', {
        description: err.message || 'Invalid administrator credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                Admin Control Room
              </span>
            </div>
          </Link>
        </div>

        <Card className="border border-red-500/20 shadow-2xl bg-slate-900/90 backdrop-blur text-slate-100">
          <CardHeader className="space-y-1 text-center p-4 sm:p-6 pb-2">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrator Sign In
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-400">
              Enter your Administrator Email or Admin ID (e.g. ADM-2026-000001)
            </CardDescription>
          </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-2">
                  {/* Email or Admin ID */}
                  <div className="space-y-1.5">
                    <Label htmlFor="emailOrId" className="text-xs font-semibold text-slate-200">
                      Admin Email or Admin ID
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="emailOrId"
                        placeholder="admin@highschoolyouthclub.org or ADM-2026-000001"
                        className="pl-9 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                        {...register('emailOrId')}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {errors.emailOrId && (
                      <p className="text-[11px] text-red-400 font-medium">{errors.emailOrId.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold text-slate-200">
                        Password
                      </Label>
                      <Link
                        href="/admin/forgot-password"
                        className="text-xs text-red-400 hover:text-red-300 hover:underline font-medium transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        className="pl-9 pr-10 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                        {...register('password')}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-red-400 font-medium">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-4 sm:p-6 pt-0">
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-10 shadow-lg shadow-red-950/50 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying Credentials...
                      </>
                    ) : (
                      <>
                        Sign In to Admin Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between w-full text-xs text-slate-400 pt-2">
                    <span>Authorized staff?</span>
                    <Link
                      href="/admin/register"
                      className="font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
                    >
                      Create Admin Account
                    </Link>
                  </div>

                  <div className="flex items-center justify-between w-full text-xs text-slate-400 pt-1 border-t border-slate-800">
                    <span>Club Member?</span>
                    <Link
                      href="/member/login"
                      className="font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
                    >
                      Member Sign In
                    </Link>
                  </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
