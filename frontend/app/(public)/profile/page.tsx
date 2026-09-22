'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  Heart,
  Sparkles,
  Clock,
  Edit3,
  Save,
  Loader2,
  CheckCircle2,
  Lock,
  LogOut,
  Share2,
  Printer,
  QrCode,
  CreditCard,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Activity,
  Compass,
  FileCheck,
  Users,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { apiClient } from '@/lib/api-client';
import { useEvents, useMyRegisteredEvents } from '@/hooks/use-queries';
import type { Event as ClubEvent, SecurityInfo, ActiveSession } from '@/types';

const CLUB_INTERESTS = [
  'Education & Literacy',
  'Sports & Athletics',
  'Environmental Protection',
  'Cultural Preservation',
  'Health & Blood Donation',
  'Youth Leadership',
  'Digital Skills & IT',
  'Community Outreach',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading, logout, refreshProfile } = useAuth();
  const { data: userEvents = [] } = useMyRegisteredEvents(isAuthenticated);
  const { data: eventsData } = useEvents({ limit: 4, published: true });
  const upcomingEvents = eventsData?.data || [];

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Security & Account states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [isLoadingSecurity, setIsLoadingSecurity] = useState(false);

  // Hidden file inputs for real original photo uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state from profile or Supabase user metadata
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setAvatar(profile.avatar || '');
      setBio(profile.bio || '');
      setAddress(profile.address || '');
      setBloodGroup(profile.bloodGroup || '');
      if (Array.isArray(profile.interests)) {
        setSelectedInterests(profile.interests);
      }
    }

    if (user?.user_metadata) {
      const meta = user.user_metadata;
      if (!profile?.phone && meta.phone) setPhone(meta.phone);
      if (!profile?.avatar && meta.avatar) setAvatar(meta.avatar);
      if (!profile?.bio && meta.bio) setBio(meta.bio);
      if (!profile?.address && meta.address) setAddress(meta.address);
      if (!profile?.bloodGroup && meta.bloodGroup) setBloodGroup(meta.bloodGroup);
      if ((!profile?.interests || profile.interests.length === 0) && Array.isArray(meta.interests) && meta.interests.length > 0) {
        setSelectedInterests(meta.interests);
      }
    }
  }, [profile, user]);

  // Real original image processing & square cropping to crisp high-res 512x512 JPEG Data URL
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file (JPEG, PNG, WebP)'));
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        reject(new Error('Image file is too large (maximum 15MB)'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const minDim = Math.min(img.width, img.height);
          const targetSize = Math.min(minDim, 512);
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Center crop to square
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to parse image from your device'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  // Upload and immediately save real original photo from device
  const handleAvatarFile = async (file: File) => {
    setIsUploadingAvatar(true);
    const toastId = toast.loading('Processing original photo from device...');
    try {
      const dataUrl = await processImageFile(file);
      setAvatar(dataUrl);

      // 1. Sync Supabase user metadata
      const supabase = getSupabaseBrowserClient();
      if (typeof supabase?.auth?.updateUser === 'function') {
        try {
          await supabase.auth.updateUser({
            data: { avatar: dataUrl },
          });
        } catch (sbErr: any) {
          console.warn('Supabase avatar update note:', sbErr?.message);
        }
      }

      // 2. Sync Backend MongoDB Profile
      try {
        await apiClient.patch('/users/me', {
          avatar: dataUrl,
        });
      } catch (backendErr: any) {
        console.warn('Backend avatar update note:', backendErr?.message);
      }

      await refreshProfile();
      toast.success('Original photo updated successfully!', {
        id: toastId,
        description: 'Your real photo is now saved on your profile and official Digital ID card.',
      });
    } catch (err: any) {
      toast.error('Failed to update photo', {
        id: toastId,
        description: err.message || 'Please try another photo.',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Remove photo and restore default initials
  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    const toastId = toast.loading('Removing photo...');
    try {
      setAvatar('');
      const supabase = getSupabaseBrowserClient();
      if (typeof supabase?.auth?.updateUser === 'function') {
        try {
          await supabase.auth.updateUser({
            data: { avatar: '' },
          });
        } catch (sbErr: any) {
          console.warn('Supabase avatar reset note:', sbErr?.message);
        }
      }
      try {
        await apiClient.patch('/users/me', {
          avatar: '',
        });
      } catch (beErr: any) {
        console.warn('Backend profile avatar note:', beErr?.message);
      }
      await refreshProfile();
      toast.success('Photo removed', {
        id: toastId,
        description: 'Default initials avatar restored.',
      });
    } catch (err: any) {
      toast.error('Failed to remove photo', {
        id: toastId,
        description: err.message,
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update Supabase User Metadata
      const supabase = getSupabaseBrowserClient();
      if (typeof supabase?.auth?.updateUser === 'function') {
        const { error: sbError } = await supabase.auth.updateUser({
          data: {
            fullName,
            full_name: fullName,
            phone,
            avatar,
            bio,
            address,
            interests: selectedInterests,
            bloodGroup,
          },
        });

        if (sbError) {
          console.warn('Supabase metadata update note:', sbError.message);
        }
      }

      // 2. Update Backend Database Profile
      try {
        await apiClient.patch('/users/me', {
          fullName,
          phone,
          avatar: avatar || undefined,
          bio,
          address,
          interests: selectedInterests,
          bloodGroup,
        });
      } catch (err: any) {
        console.warn('Backend profile sync note:', err?.message);
      }

      // 3. Refresh context state
      await refreshProfile();
      toast.success('Club profile updated successfully!', {
        description: 'Your information is saved and reflected across High School Youth Club.',
      });
    } catch (err: any) {
      toast.error('Failed to update profile', {
        description: err.message || 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch real security information from backend
  const fetchSecurityInfo = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingSecurity(true);
      const res = await apiClient.get('/auth/security-info');
      if (res.data?.success) {
        setSecurityInfo(res.data.data);
      }
    } catch (err: any) {
      console.warn('Security info fetch note:', err?.message);
    } finally {
      setIsLoadingSecurity(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'security') {
      fetchSecurityInfo();
    }
  }, [activeTab, fetchSecurityInfo]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-muted' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  // Real Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error('Password must include uppercase, lowercase, and a number');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    const toastId = toast.loading('Updating password...');
    try {
      const res = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.data?.success) {
        toast.success('Password changed successfully!', {
          id: toastId,
          description: 'Your account has been secured with your new password.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(res.data?.message || 'Failed to change password');
      }
    } catch (err: any) {
      toast.error('Password change failed', {
        id: toastId,
        description: err.response?.data?.error?.message || err.message || 'Please verify your current password.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Real Password Reset Request
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    const toastId = toast.loading('Sending password reset link...');
    try {
      const res = await apiClient.post('/auth/reset-password', { email: user.email });
      if (res.data?.success) {
        toast.success('Password reset email dispatched!', {
          id: toastId,
          description: `Check ${user.email} for secure reset instructions.`,
        });
      } else {
        throw new Error(res.data?.message || 'Failed to send reset link');
      }
    } catch (err: any) {
      toast.error('Failed to dispatch password reset', {
        id: toastId,
        description: err.response?.data?.error?.message || err.message,
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Real Sign Out All Other Devices
  const handleRevokeOtherSessions = async () => {
    setIsRevokingSessions(true);
    const toastId = toast.loading('Signing out other devices...');
    try {
      const res = await apiClient.post('/auth/sessions/revoke-others');
      if (res.data?.success) {
        toast.success('Other sessions revoked!', {
          id: toastId,
          description: 'All other active sessions have been signed out.',
        });
        await fetchSecurityInfo();
      } else {
        throw new Error(res.data?.message || 'Failed to revoke sessions');
      }
    } catch (err: any) {
      toast.error('Failed to revoke sessions', {
        id: toastId,
        description: err.response?.data?.error?.message || err.message,
      });
    } finally {
      setIsRevokingSessions(false);
    }
  };

  // Membership Registration ID
  const memberId = profile?.memberId
    ? profile.memberId
    : profile?._id
    ? `HSYC-KP5-${profile._id.slice(-6).toUpperCase()}`
    : 'HSYC-KP5-MEMBER';

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  // If loading session
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading your club profile...</p>
      </div>
    );
  }

  // If unauthenticated: Present clean gate
  if (!isAuthenticated || !profile || !user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
        <div className="relative mx-auto h-24 w-24 rounded-full p-1.5 bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-600 shadow-xl ring-4 ring-white/20 mb-6">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-white shadow-inner">
            <Image src="/logo.png" alt="High School Youth Club" fill sizes="96px" className="object-cover" />
          </div>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Club Member Portal
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Please sign in to access your official High School Youth Club membership profile, digital ID card, and volunteer records.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8" asChild>
            <Link href="/auth/login">
              Sign In to Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/register">Join High School Youth Club</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* ─── Sleek Cover Image Banner: High School Youth Club Community ──────── */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-slate-900 border-b border-border/40">
        {/* Full-Clarity Youth Club Community Group Photograph */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_20%] sm:bg-[center_25%]"
          style={{ backgroundImage: "url('/community-group.jpg')" }}
        />
        {/* Very subtle vignette to keep the community members bright and clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

        {/* Campus Location Tag */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] sm:text-xs shadow-md">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-400" />
          <span className="font-medium">हाई स्कूल युवा क्लब • Krishnapur-5</span>
        </div>
      </div>

      {/* ─── Profile Identity Card: Overlapping Banner ───────────────────────── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-card border border-border/80 shadow-md rounded-2xl p-4 sm:p-6 -mt-12 sm:-mt-16 z-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 text-center sm:text-left w-full sm:w-auto">
              {/* Overlapping Avatar */}
              <div className="relative group shrink-0 -mt-10 sm:-mt-14">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarFile(file);
                    e.target.value = '';
                  }}
                />
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full p-1 bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-600 shadow-xl ring-4 ring-card backdrop-blur">
                  <Avatar className="h-full w-full rounded-full border-2 border-card bg-slate-900 overflow-hidden">
                    <AvatarImage src={avatar || profile.avatar || ''} alt={fullName} className="object-cover" />
                    <AvatarFallback className="text-2xl sm:text-3xl font-black bg-primary/20 text-primary">
                      {fullName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all hover:scale-110 border-2 border-card active:scale-95 disabled:opacity-50"
                  title="Upload original photo from your device"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* User Name & Badges */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs capitalize tracking-wide px-2.5 py-0.5 shadow-sm">
                    {profile.role.toLowerCase().replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs gap-1 font-medium">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    Active Verified Member
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    ID: {memberId}
                  </span>
                </div>

                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                  {fullName}
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    {address || 'No address specified'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-amber-500" />
                    Member since {joinedDate}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons: View ID Card, Admin switch */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
              <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-border hover:bg-muted font-semibold text-xs sm:text-sm gap-1.5 shadow-sm h-10 px-4"
                  >
                    <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    Digital ID Card (आईडी)
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[94vw] max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl max-h-[92dvh] overflow-y-auto mx-auto">
                  {/* High School Youth Club Digital ID Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl relative overflow-hidden">
                    {/* Watermark Crest */}
                    <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                      <Image src="/logo.png" alt="Watermark" width={220} height={220} />
                    </div>

                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white p-0.5 shadow">
                          <Image src="/logo.png" alt="Logo" fill sizes="48px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-heading font-black text-sm tracking-wide text-white leading-tight">
                            HIGH SCHOOL YOUTH CLUB
                          </p>
                          <p className="text-[10px] text-amber-300 font-semibold">
                            हाई स्कूल युवा क्लब • Krishnapur-5
                          </p>
                          <p className="text-[9px] text-slate-400">
                            श्री कृष्ण मा.वि. प्राङ्गण, गुलरिया, कञ्चनपुर
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="py-5 flex gap-4 items-center">
                      <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-800">
                        <Avatar className="h-full w-full rounded-none">
                          <AvatarImage src={avatar || profile.avatar || ''} alt={fullName} className="object-cover" />
                          <AvatarFallback className="text-xl font-bold bg-slate-800 text-white">
                            {fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Member Name</p>
                        <p className="font-heading font-bold text-base text-white">{fullName}</p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Role</span>
                            <span className="font-semibold text-amber-300 capitalize">
                              {profile.role.toLowerCase().replace('_', ' ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Blood Group</span>
                            <span className="font-semibold text-red-400">{bloodGroup || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Reg. No</span>
                            <span className="font-mono text-[10px] font-semibold text-slate-200">{memberId}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Issued Date</span>
                            <span className="text-[10px] text-slate-200">{joinedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-7 w-7 text-white" />
                        <div>
                          <p className="text-white font-medium text-[10px]">Official Digital Pass</p>
                          <p className="text-[9px] text-slate-400">highschoolyouthclub.org</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.print()}
                        className="text-xs text-white hover:bg-white/10 h-8 gap-1"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print ID
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER'].includes(profile.role) && (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md gap-1.5 h-10 px-4"
                  asChild
                >
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Portal
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Tabs ─────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation Pill Bar */}
          <div className="bg-card border border-border shadow-sm rounded-2xl p-1.5">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto gap-1 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 rounded-xl font-semibold text-xs sm:text-sm gap-1.5"
              >
                <User className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 rounded-xl font-semibold text-xs sm:text-sm gap-1.5"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 rounded-xl font-semibold text-xs sm:text-sm gap-1.5"
              >
                <Calendar className="h-4 w-4" />
                <span>My Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 rounded-xl font-semibold text-xs sm:text-sm gap-1.5"
              >
                <Lock className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── TAB 1: OVERVIEW ───────────────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border border-border/70 shadow-sm bg-card">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-heading font-black text-foreground">
                      {profile.volunteerHours ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Volunteer Hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 shadow-sm bg-card">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-heading font-black text-foreground">
                      {profile.eventsAttended ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Events Attended</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 shadow-sm bg-card">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-heading font-black text-foreground truncate">
                      {profile.youthLeaderRank || 'Unranked'}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Youth Leader Rank</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 shadow-sm bg-card">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-heading font-black text-foreground">
                      {profile.projectsBacked ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Projects Backed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details & Bio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Personal Bio & Interests */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-red-600" />
                      About Me & Community Bio
                    </CardTitle>
                    <CardDescription>
                      Personal bio and dedication statement for High School Youth Club.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground leading-relaxed">
                      {bio ||
                        'No personal bio added yet. Click Edit Profile to share your community dedication and goals.'}
                    </p>

                    {/* Volunteer Wings & Focus Areas */}
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Active Wings & Volunteer Interests
                      </p>
                      {selectedInterests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedInterests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="bg-primary/10 text-primary border-primary/20 text-xs py-1 px-2.5 font-medium"
                            >
                              <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No volunteer wings selected yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Membership Badges & Recognition */}
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      Club Honors & Badges
                    </CardTitle>
                    <CardDescription>
                      Milestones achieved within the High School Youth Club community.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(profile.eventsAttended && profile.eventsAttended > 0) || (profile.volunteerHours && profile.volunteerHours > 0) || profile.role !== 'MEMBER' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-center space-y-2">
                          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 dark:bg-red-950 mx-auto flex items-center justify-center shadow-inner">
                            <CheckCircle2 className="h-6 w-6" />
                          </div>
                          <p className="font-semibold text-sm">Verified Member</p>
                          <p className="text-[11px] text-muted-foreground">Official High School Youth Club</p>
                        </div>
                        {profile.eventsAttended && profile.eventsAttended > 0 && (
                          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-center space-y-2">
                            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 mx-auto flex items-center justify-center shadow-inner">
                              <Sparkles className="h-6 w-6" />
                            </div>
                            <p className="font-semibold text-sm">Event Participant</p>
                            <p className="text-[11px] text-muted-foreground">{profile.eventsAttended} Program{profile.eventsAttended > 1 ? 's' : ''} Attended</p>
                          </div>
                        )}
                        {profile.volunteerHours && profile.volunteerHours > 0 && (
                          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-center space-y-2">
                            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 mx-auto flex items-center justify-center shadow-inner">
                              <Heart className="h-6 w-6" />
                            </div>
                            <p className="font-semibold text-sm">Active Volunteer</p>
                            <p className="text-[11px] text-muted-foreground">{profile.volunteerHours} Community Hour{profile.volunteerHours > 1 ? 's' : ''}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground space-y-1">
                        <Award className="h-8 w-8 mx-auto text-muted-foreground/40" />
                        <p className="font-semibold text-xs">No badges unlocked yet</p>
                        <p className="text-[11px]">Attend events and volunteer with the club to earn official community honors.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Contact & Official Verification Card */}
              <div className="space-y-6">
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      Official Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block">Registered Email</span>
                      <span className="font-semibold text-foreground break-all flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        {user.email}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground block">Contact Phone</span>
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {phone || 'Not provided'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground block">Ward & Chapter</span>
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        {address || 'Not specified'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground block">School & Club Campus</span>
                      <span className="font-semibold text-foreground">
                        श्री कृष्ण माध्यमिक विद्यालय (Shree Krishna Secondary School)
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <Button
                        onClick={() => setIsCardModalOpen(true)}
                        className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold text-xs shadow-md"
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-2" />
                        Open Digital ID Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Shortcuts */}
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between text-xs h-9"
                      onClick={() => setActiveTab('edit')}
                    >
                      <span>Edit My Profile</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-xs h-9"
                      asChild
                    >
                      <Link href="/events">
                        <span>Browse Club Calendar</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-xs h-9"
                      asChild
                    >
                      <Link href="/members">
                        <span>Club Executive Directory</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB 2: EDIT PROFILE ───────────────────────────────────────────── */}
          <TabsContent value="edit" className="animate-in fade-in-50">
            <Card className="border border-border/70 shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-red-600" />
                  Edit Club Profile Information
                </CardTitle>
                <CardDescription>
                  Keep your official member details updated for notifications, certificates, and ID cards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Real Profile Photo Upload (No Dummy Presets) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Profile Photo (तपाईंको वास्तविक फोटो)</Label>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarFile(file);
                        e.target.value = '';
                      }}
                    />
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-muted/40 border border-border/70">
                      <div className="relative shrink-0">
                        <Avatar className="h-24 w-24 border-2 border-red-500/60 shadow-md">
                          <AvatarImage src={avatar || profile.avatar || ''} alt={fullName} className="object-cover" />
                          <AvatarFallback className="text-2xl font-black bg-muted text-foreground">
                            {fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isUploadingAvatar && (
                          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div>
                          <h4 className="text-sm font-bold text-foreground">Upload Real Photo from Device</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Upload your real portrait photo (JPEG, PNG, WebP). This photo will automatically appear on your official High School Youth Club Digital ID card and member profile.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <Button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 gap-2 shadow-sm font-semibold"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            {avatar ? 'Change Original Photo' : 'Select Photo from Device'}
                          </Button>

                          {avatar && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleRemoveAvatar}
                              disabled={isUploadingAvatar}
                              className="text-xs h-9 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove Photo
                            </Button>
                          )}
                        </div>

                        <p className="text-[11px] text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Original photos are automatically framed, optimized, and saved to your account.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prof-name">Full Name (पुरा नाम) *</Label>
                      <Input
                        id="prof-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full legal name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prof-phone">Phone Number (फोन नम्बर)</Label>
                      <Input
                        id="prof-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                  </div>

                  {/* Address and Blood Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prof-addr">Address / Tole (ठेगाना)</Label>
                      <Input
                        id="prof-addr"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Gulariya, Krishnapur-5, Kanchanpur"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prof-blood">Blood Group (रक्त समूह)</Label>
                      <select
                        id="prof-blood"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Select Blood Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-bio">Personal Statement & Community Bio</Label>
                    <Textarea
                      id="prof-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Share your interests, club initiatives you are passionate about, and goals for Krishnapur youth..."
                    />
                  </div>

                  {/* Volunteer Wings Selection */}
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-semibold">Select Your Club Wings & Volunteer Focus</Label>
                    <p className="text-xs text-muted-foreground">
                      Click to toggle the departments you actively volunteer in.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {CLUB_INTERESTS.map((interest) => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                : 'bg-muted/60 text-muted-foreground border-border hover:border-foreground/40'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                    <Button type="button" variant="ghost" onClick={() => setActiveTab('overview')}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 shadow-md"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── TAB 3: MY EVENTS & CALENDAR ───────────────────────────────────── */}
          <TabsContent value="events" className="space-y-6 animate-in fade-in-50">
            <Card className="border border-border/70 shadow-sm bg-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-red-600" />
                      Youth Club Event Participation
                    </CardTitle>
                    <CardDescription>
                      Upcoming community gatherings, sports meets, and cultural festivals you can attend.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/events" className="gap-1">
                      <span>Browse All Events</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {userEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userEvents.map((event: ClubEvent) => (
                      <div
                        key={event._id}
                        className="p-4 rounded-2xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="secondary" className="capitalize text-[10px]">
                              {event.eventType}
                            </Badge>
                            <span className="text-muted-foreground flex items-center gap-1 font-mono">
                              <Calendar className="h-3 w-3 text-red-500" />
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-base text-foreground leading-snug">
                            {event.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-red-500" />
                            {event.location}
                          </span>
                          <Button size="sm" variant="ghost" asChild className="h-7 text-xs text-red-600 font-semibold p-0">
                            <Link href={`/events/${event.slug}`}>
                              View Details →
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground space-y-3">
                    <Calendar className="h-10 w-10 mx-auto opacity-40 text-red-600" />
                    <div>
                      <p className="font-semibold text-foreground">No Registered Events Yet</p>
                      <p className="text-xs mt-1 max-w-sm mx-auto">
                        You haven&apos;t registered for any club programs yet. Browse upcoming events to participate and grow your event attendance record!
                      </p>
                    </div>
                    {upcomingEvents.length > 0 && (
                      <div className="pt-4 border-t border-border/50 text-left">
                        <p className="text-xs font-semibold text-foreground mb-3">Upcoming Programs You Can Attend:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {upcomingEvents.slice(0, 2).map((ev) => (
                            <div key={ev._id} className="p-3 rounded-xl border border-border/60 bg-card text-xs flex justify-between items-center">
                              <span className="font-medium truncate mr-2">{ev.title}</span>
                              <Button size="sm" variant="outline" className="text-[11px] h-7 shrink-0" asChild>
                                <Link href={`/events/${ev.slug}`}>RSVP →</Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── TAB 4: SECURITY & ACCOUNT ─────────────────────────────────────── */}
          <TabsContent value="security" className="space-y-6 animate-in fade-in-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Password, Reset & Identity */}
              <div className="space-y-6">
                {/* 1. Change Password & Reset Card */}
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Lock className="h-5 w-5 text-red-600" />
                      Password & Authentication
                    </CardTitle>
                    <CardDescription>
                      Manage your authenticated portal credentials and change your password securely.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleChangePassword} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <Label htmlFor="currentPassword" className="text-xs font-semibold">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter your current password"
                            className="pr-10 text-xs"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="newPassword" className="text-xs font-semibold">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 8 chars (uppercase, lowercase, number)"
                            className="pr-10 text-xs"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {newPassword && (
                          <div className="flex items-center gap-2 pt-1">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden flex gap-1">
                              <div className={`h-full flex-1 rounded-full ${getPasswordStrength(newPassword).score >= 1 ? getPasswordStrength(newPassword).color : 'bg-transparent'}`} />
                              <div className={`h-full flex-1 rounded-full ${getPasswordStrength(newPassword).score >= 2 ? getPasswordStrength(newPassword).color : 'bg-transparent'}`} />
                              <div className={`h-full flex-1 rounded-full ${getPasswordStrength(newPassword).score >= 3 ? getPasswordStrength(newPassword).color : 'bg-transparent'}`} />
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {getPasswordStrength(newPassword).label}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your new password"
                            className="pr-10 text-xs"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="w-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm h-9"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            Updating Password...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </Button>
                    </form>

                    {/* Password Reset Section */}
                    <div className="pt-4 border-t border-border/60">
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">Password Reset Link</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified Email</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Dispatch a secure password reset link to your registered email (<b>{user.email}</b>).
                        </p>
                        <Button
                          onClick={handlePasswordReset}
                          disabled={isSendingReset}
                          variant="outline"
                          className="w-full text-xs font-semibold mt-1 h-8"
                        >
                          {isSendingReset ? (
                            <>
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                              Sending link...
                            </>
                          ) : (
                            'Request Password Reset Link'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Account Information & Identity Details Card */}
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Account & Identity Details
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Official credentials and account verification state.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs space-y-2.5">
                      <div className="flex items-center justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Account ID</span>
                        <code className="font-mono text-[11px] font-bold bg-muted px-2 py-0.5 rounded text-foreground">
                          {securityInfo?.accountId || memberId}
                        </code>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Registered Email</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{user.email}</span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-500/40 py-0">
                            Verified
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Auth Provider</span>
                        <span className="font-semibold capitalize text-foreground">
                          {securityInfo?.authProvider || user.app_metadata?.provider || 'Email / Password'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">Last Sign-In</span>
                        <span className="font-medium text-foreground">
                          {securityInfo?.lastSignInAt
                            ? new Date(securityInfo.lastSignInAt).toLocaleString()
                            : user.last_sign_in_at
                            ? new Date(user.last_sign_in_at).toLocaleString()
                            : 'Active Now'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Column 2: Sessions, 2FA & Sign Out */}
              <div className="space-y-6">
                {/* 1. Active Sessions Card */}
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-blue-600" />
                        Active Sessions & Devices
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchSecurityInfo}
                        className="h-7 w-7 p-0"
                        title="Refresh sessions"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isLoadingSecurity ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      Devices currently authorized to access your youth club account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {(securityInfo?.activeSessions && securityInfo.activeSessions.length > 0
                        ? securityInfo.activeSessions
                        : [
                            {
                              sessionId: 'current',
                              device: 'macOS Desktop',
                              browser: 'Web Browser',
                              os: 'macOS',
                              ip: '127.0.0.1',
                              lastActive: new Date().toISOString(),
                              createdAt: new Date().toISOString(),
                              isCurrent: true,
                            },
                          ]
                      ).map((session, idx) => (
                        <div
                          key={session.sessionId || idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
                              {session.device?.includes('Mobile') || session.os === 'iOS' || session.os === 'Android' ? (
                                <Smartphone className="h-4 w-4" />
                              ) : (
                                <Laptop className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">
                                  {session.device || 'Desktop Device'}
                                </p>
                                {session.isCurrent && (
                                  <Badge className="bg-emerald-600 text-white text-[9px] px-1.5 py-0 h-4 font-medium">
                                    Current Device
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                {session.browser || 'Web Browser'} • IP: {session.ip || '127.0.0.1'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {session.isCurrent
                              ? 'Active now'
                              : new Date(session.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isRevokingSessions}
                        onClick={handleRevokeOtherSessions}
                        className="w-full text-xs font-semibold h-8"
                      >
                        {isRevokingSessions ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            Signing out other devices...
                          </>
                        ) : (
                          'Sign Out All Other Devices'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Session Management & Sign Out Card */}
                <Card className="border border-border/70 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      Session Sign Out
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Terminate your current authenticated portal session on this browser.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Signing out will immediately end your authenticated portal session on this browser. You can sign back in anytime using your registered credentials.
                    </p>

                    <div className="pt-2 border-t border-border/50">
                      <Button
                        variant="destructive"
                        onClick={() => logout()}
                        className="w-full font-semibold text-xs shadow-md gap-2 h-9"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out of High School Youth Club
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
