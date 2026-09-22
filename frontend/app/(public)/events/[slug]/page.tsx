'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useEvent } from '@/hooks/use-queries';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

export default function EventDetailPage() {
  const params = useParams();
  const slug = String(params['slug']);
  const { data: event, isLoading, error } = useEvent(slug);
  const { isAuthenticated, user, profile } = useAuth();

  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?._id) return;
    setIsSubmittingRsvp(true);
    try {
      await apiClient.post(`/events/${event._id}/rsvp`, {
        name: attendeeName,
        email: attendeeEmail,
        phone: attendeePhone,
      });

      setRsvpSubmitted(true);
      toast.success('RSVP Confirmed!', {
        description: `You are registered for ${event?.title}. See you there!`,
      });
      setRsvpOpen(false);

      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
    } catch (err: any) {
      toast.error('Failed to register for event', {
        description: err.message || 'Please check your information and try again.',
      });
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-600" />
        <p className="text-sm text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold">Event Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The event you requested could not be located or has been archived.
        </p>
        <Button asChild variant="outline">
          <Link href="/events">Back to All Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 space-y-12">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Back */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Events</span>
        </Link>

        {/* Header Title Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-red-600 text-white font-bold capitalize text-xs">
              {event.eventType}
            </Badge>
            {event.ward && (
              <Badge variant="outline" className="text-xs">
                Ward No. {event.ward}
              </Badge>
            )}
            {event.registrationEnabled && (
              <Badge variant="success" className="text-xs">
                Registration Open
              </Badge>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Calendar className="h-4 w-4 text-red-600" />
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {event.startTime && (
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Clock className="h-4 w-4 text-red-600" />
                {event.startTime} {event.endTime ? `– ${event.endTime}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <MapPin className="h-4 w-4 text-red-600" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {event.coverImage && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-md">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Main Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
              <h3 className="font-heading text-2xl font-bold text-foreground">About This Event</h3>
              <p className="whitespace-pre-line text-sm sm:text-base">{event.description}</p>
            </div>

            {/* Gallery images if present */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border/60">
                <h4 className="font-heading text-xl font-bold text-foreground">Event Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.galleryImages.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={img}
                        alt={`Event photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 240px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-border/80 bg-card p-6 shadow-sm space-y-4 sticky top-24">
              <CardHeader className="p-0 space-y-1">
                <CardTitle className="text-lg font-bold">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Organizer</span>
                  <span className="font-semibold text-foreground">{event.organizer}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Location</span>
                  <span className="font-semibold text-foreground">{event.location}</span>
                </div>
                {event.registrationDeadline && (
                  <div>
                    <span className="text-muted-foreground block">RSVP Deadline</span>
                    <span className="font-semibold text-foreground">
                      {new Date(event.registrationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>

              <div className="pt-2 space-y-2">
                {event.registrationEnabled && (
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                    onClick={() => {
                      if (isAuthenticated && profile) {
                        setAttendeeName(profile.fullName);
                        setAttendeeEmail(user?.email || '');
                        setAttendeePhone(profile.phone || '');
                      }
                      setRsvpOpen(true);
                    }}
                    disabled={rsvpSubmitted}
                  >
                    {rsvpSubmitted ? 'RSVP Confirmed ✓' : 'Register for Event'}
                  </Button>
                )}

                <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  <span>Share Event</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* RSVP Registration Dialog */}
      <Dialog open={rsvpOpen} onOpenChange={setRsvpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              Confirm your attendance for <strong>{event.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRsvpSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={attendeePhone}
                onChange={(e) => setAttendeePhone(e.target.value)}
                placeholder="+977 98XXXXXXXX"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setRsvpOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingRsvp}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {isSubmittingRsvp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Confirm RSVP'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
