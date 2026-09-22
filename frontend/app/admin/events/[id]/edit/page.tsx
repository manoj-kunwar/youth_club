'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
import { useEvent } from '@/hooks/use-queries';
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

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const eventId = params['id'] as string;

  const { data: event, isLoading: isLoadingEvent, error: loadError } = useEvent(eventId);

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

  // Populate form once data arrives
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setShortDescription(event.shortDescription || '');
      setDescription(event.description || '');
      setEventType(event.eventType || 'cultural');
      if (event.date) {
        setDate(new Date(event.date).toISOString().split('T')[0]);
      }
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setLocation(event.location || '');
      setWard(event.ward || '5');
      setOrganizer(event.organizer || 'High School Youth Club');
      setCoverImage(event.coverImage || '');
      setRegistrationEnabled(!!event.registrationEnabled);
      if (event.registrationDeadline) {
        setRegistrationDeadline(new Date(event.registrationDeadline).toISOString().slice(0, 16));
      }
      setPublished(!!event.published);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

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
    const toastId = toast.loading('Saving changes...');

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

      await apiClient.patch(`/events/${eventId}`, payload);

      toast.success('Event updated successfully!', {
        id: toastId,
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });

      router.push('/admin/events');
    } catch (err: any) {
      const msg = err.message || 'Failed to update event.';
      setFormError(msg);
      toast.error('Failed to update event', {
        id: toastId,
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <AdminShell title="Edit Event">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      </AdminShell>
    );
  }

  if (loadError || !event) {
    return (
      <AdminShell title="Edit Event">
        <div className="p-8 text-center space-y-4">
          <p className="text-destructive font-semibold">Failed to load event details.</p>
          <Button asChild variant="outline">
            <Link href="/admin/events">Back to Events</Link>
          </Button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Edit: ${event.title}`}>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events</span>
            </Link>
          </Button>
          <span className="text-xs font-mono text-muted-foreground">ID: {eventId}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border/70 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="border-b border-border/60 pb-5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display">
              Edit Event
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Update event information, schedule, or publishing status.
            </p>
          </div>

          {formError && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm">
                <p className="font-semibold">Update failed</p>
                <p className="mt-0.5 opacity-90">{formError}</p>
              </div>
            </div>
          )}

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-red-600" />
              <span>Basic Information</span>
            </h2>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold">
                Event Title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-sm font-medium"
              />
            </div>

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
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

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
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                Full Event Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="description"
                required
                rows={6}
                maxLength={10000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Section 2 */}
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
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
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

          {/* Section 4 */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-red-600" />
              <span>Registration & Visibility</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Enable Registration</p>
                  <p className="text-[11px] text-muted-foreground">Allow community members to RSVP.</p>
                </div>
                <Switch
                  checked={registrationEnabled}
                  onCheckedChange={setRegistrationEnabled}
                />
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Published</p>
                  <p className="text-[11px] text-muted-foreground">Visible on public events calendar.</p>
                </div>
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </div>
          </div>

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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Update Event</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
