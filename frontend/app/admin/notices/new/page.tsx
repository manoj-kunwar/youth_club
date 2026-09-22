'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Pin,
  Calendar,
  Paperclip,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { NoticeCategory, NoticePriority } from '@/types';

const NOTICE_CATEGORIES: { value: NoticeCategory; label: string }[] = [
  { value: 'general', label: 'General Announcement' },
  { value: 'event', label: 'Event Notice' },
  { value: 'urgent', label: 'Urgent Alert' },
  { value: 'recruitment', label: 'Member Recruitment' },
  { value: 'financial', label: 'Financial & Transparency' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'other', label: 'Other' },
];

const NOTICE_PRIORITIES: { value: NoticePriority; label: string; badgeClass: string }[] = [
  { value: 'low', label: 'Low', badgeClass: 'text-muted-foreground' },
  { value: 'medium', label: 'Medium', badgeClass: 'text-blue-600' },
  { value: 'high', label: 'High', badgeClass: 'text-amber-600' },
  { value: 'urgent', label: 'Urgent', badgeClass: 'text-red-600 font-bold' },
];

export default function CreateNoticePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('general');
  const [priority, setPriority] = useState<NoticePriority>('medium');
  const [expiryDate, setExpiryDate] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Notice title is required.');
      return;
    }
    if (!content.trim()) {
      setFormError('Notice content is required.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Publishing notice...');

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        pinned,
        published,
      };

      if (summary.trim()) payload.summary = summary.trim();
      if (attachmentUrl.trim()) payload.attachmentUrl = attachmentUrl.trim();
      if (expiryDate) payload.expiryDate = new Date(expiryDate).toISOString();

      await apiClient.post('/notices', payload);

      toast.success('Notice published successfully!', {
        id: toastId,
        description: `"${title}" is now recorded in the community notice board.`,
      });

      queryClient.invalidateQueries({ queryKey: ['notices'] });
      router.push('/admin/notices');
    } catch (err: any) {
      const msg = err.message || 'Failed to create notice. Please try again.';
      setFormError(msg);
      toast.error('Failed to create notice', {
        id: toastId,
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell title="Create Notice">
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/admin/notices">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Notices</span>
            </Link>
          </Button>
          <span className="text-xs font-medium text-muted-foreground">New Notice Bulletin</span>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border/70 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display">
                  Publish Official Notice
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Broadcast administrative updates, alerts, schedules, or club statements to all members.
                </p>
              </div>
            </div>
          </div>

          {/* Form Level Error Alert */}
          {formError && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm">
                <p className="font-semibold">Unable to publish notice</p>
                <p className="mt-0.5 opacity-90">{formError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Notice Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-red-600" />
              <span>Notice Details</span>
            </h2>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold">
                Notice Title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                required
                maxLength={300}
                placeholder="e.g. Executive Committee Meeting Minutes & General Assembly Notification"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-sm font-medium"
              />
              <p className="text-[11px] text-muted-foreground">Up to 300 characters.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold">
                  Notice Category <span className="text-red-600">*</span>
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {NOTICE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-xs font-semibold">
                  Priority Level <span className="text-red-600">*</span>
                </Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NoticePriority)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {NOTICE_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="summary" className="text-xs font-semibold">
                  Brief Summary (Optional)
                </Label>
                <span className={`text-[11px] ${summary.length > 480 ? 'text-amber-600 font-bold' : 'text-muted-foreground'}`}>
                  {summary.length} / 500
                </span>
              </div>
              <Textarea
                id="summary"
                rows={2}
                maxLength={500}
                placeholder="A concise summary highlighted in bullet points or notice card preview..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs font-semibold">
                Full Notice Body Content <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="content"
                required
                rows={8}
                maxLength={50000}
                placeholder="Write the complete official notice text, guidelines, resolutions, or announcements here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="text-sm font-sans"
              />
            </div>
          </div>

          {/* Section 2: Expiry & Attachments */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <span>Expiry & Attachments</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date" className="text-xs font-semibold">
                  Expiration Date (Optional)
                </Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-10 text-sm"
                />
                <p className="text-[11px] text-muted-foreground">Notice will be automatically archived after this date.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment-url" className="text-xs font-semibold">
                  Document / PDF Link (Optional)
                </Label>
                <div className="relative">
                  <Paperclip className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="attachment-url"
                    type="url"
                    placeholder="https://example.org/documents/notice.pdf"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Publishing & Pinning Options */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-red-600" />
              <span>Options</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Pin className="h-3.5 w-3.5 text-red-600" />
                    <span>Pin to Top</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">Keep pinned at the top of the notice bulletin board.</p>
                </div>
                <Switch
                  checked={pinned}
                  onCheckedChange={setPinned}
                />
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Publish Immediately</p>
                  <p className="text-[11px] text-muted-foreground">Make visible on the public notice board now.</p>
                </div>
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/notices')}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 w-full sm:w-auto text-xs px-6 h-10 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Notice...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Publish Notice</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
