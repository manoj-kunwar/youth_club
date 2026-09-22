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
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { adminRegisterApi } from '@/lib/supabase';

export const adminRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid administrator email address'),
    phone: z.string().min(7, 'Phone number is required for administrator records'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;

interface AdminSignUpCardProps {
  className?: string;
}

export function AdminSignUpCard({ className }: AdminSignUpCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminRegisterFormData>({
    resolver: zodResolver(adminRegisterSchema),
    mode: 'onChange',
  });

  const watchPassword = watch('password', '');
  const hasMinLength = watchPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(watchPassword);
  const hasLowerCase = /[a-z]/.test(watchPassword);
  const hasNumber = /[0-9]/.test(watchPassword);

  const onSubmit = async (data: AdminRegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await adminRegisterApi({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success('Admin Account Provisioned!', {
        description: result?.adminId
          ? `Admin ID ${result.adminId} provisioned. Please sign in to continue.`
          : 'Administrator account provisioned. Please sign in.',
      });

      router.push('/admin/login');
    } catch (err: any) {
      toast.error('Admin Registration Failed', {
        description: err.message || 'Invalid authorization key or duplicate account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className || 'border border-red-500/20 shadow-2xl bg-slate-900/90 backdrop-blur text-slate-100'}>
      <CardHeader className="space-y-1 text-center p-4 sm:p-6 pb-2">
        <div className="flex justify-center mb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Restricted Provisioning</span>
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Create Admin Account
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-400">
          Authorized administrator account creation requires a valid server authorization key
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-slate-200">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="fullName"
                placeholder="Administrator Full Name"
                className="pl-9 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                {...register('fullName')}
                disabled={isLoading}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-400 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          {/* Admin Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-200">
              Admin Email <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@highschoolyouthclub.org"
                className="pl-9 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                {...register('email')}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-200">
              Phone Number <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+977 98XXXXXXXX"
                className="pl-9 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                {...register('phone')}
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-400 font-medium">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-200">
              Password <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter robust admin password"
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

            {watchPassword.length > 0 && (
              <div className="grid grid-cols-2 gap-1 pt-1.5 text-[11px] text-slate-400">
                <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400 font-medium' : ''}`}>
                  {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} 8+ characters
                </div>
                <div className={`flex items-center gap-1 ${hasUpperCase ? 'text-emerald-400 font-medium' : ''}`}>
                  {hasUpperCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} Uppercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasLowerCase ? 'text-emerald-400 font-medium' : ''}`}>
                  {hasLowerCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} Lowercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400 font-medium' : ''}`}>
                  {hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} At least 1 number
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-200">
              Confirm Password <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                className="pl-9 pr-10 h-10 text-sm bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-400 font-medium">{errors.confirmPassword.message}</p>
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
                Authorizing & Generating Admin ID...
              </>
            ) : (
              <>
                Provision Admin Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between w-full text-xs text-slate-400 pt-2">
            <span>Already have admin credentials?</span>
            <Link
              href="/admin/login"
              className="font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              Admin Sign In
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

          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Backend role authorization with sequential ADM ID generation</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
