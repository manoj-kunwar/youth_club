'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { memberLoginApi } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  emailOrId: z.string().min(1, 'Please enter your Email or Member ID'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface MemberSignInCardProps {
  className?: string;
  autoFocus?: boolean;
}

export function MemberSignInCard({ className, autoFocus = false }: MemberSignInCardProps) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const loginRes = await memberLoginApi({
        emailOrId: values.emailOrId,
        password: values.password,
      });

      await refreshProfile();
      toast.success('Welcome back!', {
        description: 'You have signed in successfully.',
      });

      // Role check: If an administrator logs in, redirect to admin dashboard
      const role = loginRes?.user?.role;
      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER'];
      if (role && adminRoles.includes(role)) {
        router.push('/admin/dashboard');
        return;
      }

      // Member redirect strictly to Home page (never /profile)
      router.push('/');
    } catch (err: any) {
      toast.error('Sign In Failed', {
        description: err.message || 'Invalid credentials or unactivated account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className || 'border border-slate-700/80 shadow-2xl bg-slate-900/90 backdrop-blur text-slate-100'}>
      <CardHeader className="space-y-1 text-center p-4 sm:p-6 pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">Member Sign In</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-400">
          Sign in with your Email or official Member ID (e.g. MEM-2026-000001)
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onLoginSubmit)}>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-2">
              {/* Email or Member ID */}
              <div className="space-y-1.5">
                <Label htmlFor="emailOrId" className="text-xs font-semibold text-slate-200">
                  Email or Member ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="emailOrId"
                    placeholder="you@example.com or MEM-2026-000001"
                    className="pl-9 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                    {...register('emailOrId')}
                    disabled={isLoading}
                    autoFocus={autoFocus}
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
                    href="/member/forgot-password"
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
                    placeholder="Enter your password"
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
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between w-full text-xs text-slate-400 pt-2">
                <span>Don&apos;t have an account?</span>
                <Link
                  href="/member/register"
                  className="font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
                >
                  Create Member Account
                </Link>
              </div>

              <div className="flex items-center justify-between w-full text-xs text-slate-400 pt-1 border-t border-slate-800">
                <span>Club Administrator?</span>
                <Link
                  href="/admin/login"
                  className="font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
                >
                  Admin Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
    </Card>
  );
}
