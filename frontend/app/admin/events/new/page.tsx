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
import { ImageUploader } from '@/components/ImageUploader';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  ArrowLeft,
  Loader2,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { EventType } from '@/types';

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'educational', label: 'Educational' },
  { value: 'community_service', label: 'Community Service' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'other', label: 'Other' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('cultural');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('5');
  const [organizer, setOrganizer] = useState('High School Youth Club');
  const [coverImage, setCoverImage] = useState('');
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [published, setPublished] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validation
    if (!title.trim()) {
      setFormError('Event title is required.');
      return;
    }
    if (!shortDescription.trim()) {
      setFormError('Short summary description is required (up to 300 characters).');
      return;
    }
    if (!description.trim()) {
      setFormError('Full event description is required.');
      return;
    }
    if (!date) {
      setFormError('Event date is required.');
      return;
    }
    if (!location.trim()) {
      setFormError('Event venue/location is required.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating event...');

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        eventType,
        date: new Date(date).toISOString(),
        location: location.trim(),
        ward: ward.trim() || undefined,
        organizer: organizer.trim() || 'High School Youth Club',
        status: published ? 'published' : 'draft',
        published,
        registrationEnabled,
      };

      if (startTime.trim()) payload.startTime = startTime.trim();
      if (endTime.trim()) payload.endTime = endTime.trim();
      if (coverImage.trim()) payload.coverImage = coverImage.trim();
      if (registrationEnabled && registrationDeadline) {
        payload.registrationDeadline = new Date(registrationDeadline).toISOString();
      }

      await apiClient.post('/events', payload);

      toast.success('Event scheduled successfully!', {
        id: toastId,
        description: `"${title}" has been saved to the database.`,
      });

      // Invalidate events cache so list updates immediately
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });

      // Redirect to admin events list
      router.push('/admin/events');
    } catch (err: any) {
      const msg = err.message || 'Failed to create event. Please check details and try again.';
      setFormError(msg);
      toast.error('Failed to create event', {
        id: toastId,
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell title="Create New Event">
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events</span>
            </Link>
          </Button>
          <span className="text-xs font-medium text-muted-foreground">Step 1 of 1 — New Event Entry</span>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border/70 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display">
                  Create New Community Event
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Publish club gatherings, cultural programs, sports meets, or youth activities.
                </p>
              </div>
            </div>
          </div>

          {/* Form Level Error Alert */}
          {formError && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm">
                <p className="font-semibold">Unable to create event</p>
                <p className="mt-0.5 opacity-90">{formError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-red-600" />
              <span>Basic Information</span>
            </h2>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold">
                Event Title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                required
                maxLength={200}
                placeholder="e.g. Annual Blood Donation & Health Camp 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-sm font-medium"
              />
              <p className="text-[11px] text-muted-foreground">A clear, engaging title (maximum 200 characters).</p>
            </div>

            {/* Category & Ward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold">
                  Event Category <span className="text-red-600">*</span>
                </Label>
                <select
                  id="category"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward" className="text-xs font-semibold">
                  Ward Number
                </Label>
                <Input
                  id="ward"
                  placeholder="e.g. 5"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="shortDescription" className="text-xs font-semibold">
                  Short Summary <span className="text-red-600">*</span>
                </Label>
                <span className={`text-[11px] ${shortDescription.length > 280 ? 'text-amber-600 font-bold' : 'text-muted-foreground'}`}>
                  {shortDescription.length} / 300
                </span>
              </div>
              <Textarea
                id="shortDescription"
                required
                rows={2}
                maxLength={300}
                placeholder="A punchy 1-2 sentence preview shown on homepage and social cards..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="text-sm resize-none"
              />
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                Full Event Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="description"
                required
                rows={6}
                maxLength={10000}
                placeholder="Provide complete details including program agenda, objectives, who can attend, what to bring, and key speakers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Section 2: Date, Time & Location */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <span>Schedule & Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date" className="text-xs font-semibold">
                  Event Date <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-xs font-semibold">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-xs font-semibold">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-semibold">
                  Venue / Location <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    required
                    placeholder="e.g. High School Youth Club Hall, Gulariya"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer" className="text-xs font-semibold">
                  Organizer <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="organizer"
                    required
                    placeholder="High School Youth Club"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cover Image */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span>Event Cover Image</span>
            </h2>

            <div className="space-y-3">
              <ImageUploader
                value={coverImage}
                onChange={(res) => setCoverImage(res?.mediaUrl || '')}
                folder="events"
              />

              <div className="space-y-1.5">
                <Label htmlFor="image-url-fallback" className="text-xs text-muted-foreground">
                  Or enter external image URL directly:
                </Label>
                <Input
                  id="image-url-fallback"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Registration & Publishing Options */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-red-600" />
              <span>Registration & Visibility</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Enable Registration</p>
                  <p className="text-[11px] text-muted-foreground">Allow community members to RSVP and register.</p>
                </div>
                <Switch
                  checked={registrationEnabled}
                  onCheckedChange={setRegistrationEnabled}
                />
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Publish Immediately</p>
                  <p className="text-[11px] text-muted-foreground">Visible on public events calendar right away.</p>
                </div>
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </div>

            {registrationEnabled && (
              <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                <Label htmlFor="reg-deadline" className="text-xs font-semibold">
                  Registration Deadline (Optional)
                </Label>
                <Input
                  id="reg-deadline"
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="h-10 text-sm max-w-xs"
                />
              </div>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/events')}
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
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Create Event</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
