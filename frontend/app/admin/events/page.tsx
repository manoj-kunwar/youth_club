'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Search, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { toast } from 'sonner';
import { useEvents, queryKeys } from '@/hooks/use-queries';
import { apiClient } from '@/lib/api-client';
import type { Event, EventType } from '@/types';

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteEventItem, setDeleteEventItem] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('cultural');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('5');
  const [organizer, setOrganizer] = useState('High School Youth Club');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);

  const { data, isLoading } = useEvents({
    page,
    limit: 10,
    search: search || undefined,
  });

  const events = data?.data || [];
  const pagination = data?.pagination;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/events', {
        title,
        description,
        shortDescription: description.length > 200 ? description.slice(0, 197) + '...' : description,
        eventType,
        date: new Date(date).toISOString(),
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        location,
        ward: ward || undefined,
        organizer,
        coverImage: coverImage || undefined,
        published,
      });

      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });
      setCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error('Failed to create event', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEventItem) return;
    try {
      await apiClient.delete(`/events/${deleteEventItem._id}`);
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });
    } catch (err: any) {
      toast.error('Failed to delete event', { description: err.message });
    } finally {
      setDeleteEventItem(null);
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      await apiClient.patch(`/events/${event._id}/publish`, {
        published: !event.published,
      });
      toast.success(`Event ${!event.published ? 'published' : 'unpublished'}`);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });
    } catch (err: any) {
      toast.error('Failed to update status', { description: err.message });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEventType('cultural');
    setDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setWard('5');
    setOrganizer('High School Youth Club');
    setCoverImage('');
    setPublished(true);
  };

  const columns: Column<Event>[] = [
    {
      header: 'Title',
      cell: (item) => (
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{item.title}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(item.date).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => (
        <Badge variant="outline" className="capitalize text-xs">
          {item.eventType}
        </Badge>
      ),
    },
    {
      header: 'Location',
      cell: (item) => <span className="text-xs">{item.location}</span>,
    },
    {
      header: 'Published',
      cell: (item) => (
        <Switch
          checked={item.published}
          onCheckedChange={() => handleTogglePublish(item)}
        />
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
            <Link href={`/admin/events/${item._id}/edit`}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
            <Link href={`/events/${item.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setDeleteEventItem(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell title="Events Management">
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border/60">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-1.5 w-full sm:w-auto"
          >
            <Link href="/admin/events/new">
              <Plus className="h-4 w-4" />
              <span>Create New Event</span>
            </Link>
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={events}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total}
          onPageChange={setPage}
          emptyTitle="No Events Available"
          emptyDescription="Click 'Create New Event' to schedule your first event."
        />
      </div>

      {/* Create Event Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="evt-title">Event Title *</Label>
              <Input
                id="evt-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Dashain Football Cup 2026"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evt-type">Category *</Label>
                <select
                  id="evt-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="community_service">Community Service</option>
                  <option value="educational">Educational</option>
                  <option value="celebration">Celebration</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evt-date">Event Date *</Label>
                <Input
                  id="evt-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evt-start">Start Time</Label>
                <Input
                  id="evt-start"
                  placeholder="e.g. 10:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evt-end">End Time</Label>
                <Input
                  id="evt-end"
                  placeholder="e.g. 4:00 PM"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="evt-loc">Location / Venue *</Label>
                <Input
                  id="evt-loc"
                  required
                  placeholder="e.g. Club Ground / Community Hall"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evt-ward">Ward No.</Label>
                <Input
                  id="evt-ward"
                  placeholder="4"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evt-desc">Event Description *</Label>
              <Textarea
                id="evt-desc"
                required
                rows={4}
                placeholder="Detailed schedule, rules, eligibility, and information..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUploader
                value={coverImage}
                onChange={(res) => setCoverImage(res?.mediaUrl || '')}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch checked={published} onCheckedChange={setPublished} id="evt-pub" />
              <Label htmlFor="evt-pub">Publish immediately to public calendar</Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteEventItem} onOpenChange={(open) => !open && setDeleteEventItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{deleteEventItem?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
