'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, UploadCloud, Loader2, ZoomIn } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { EmptyState } from '@/components/EmptyState';
import { toast } from 'sonner';
import { useGallery } from '@/hooks/use-queries';
import { apiClient } from '@/lib/api-client';
import type { Gallery } from '@/types';

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Gallery | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const { data, isLoading } = useGallery({ page, limit: 16 });
  const galleryItems = data?.data || [];
  const pagination = data?.pagination;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) {
      toast.error('Please upload an image first');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/gallery', {
        title,
        description: description || undefined,
        featureType: 'photo',
        mediaUrl,
        cloudinaryPublicId: cloudinaryPublicId || 'local-upload',
        thumbnailUrl: thumbnailUrl || mediaUrl,
      });

      toast.success('Media added to gallery!');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setUploadOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error('Failed to save gallery item', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await apiClient.delete(`/gallery/${deleteItem._id}`);
      toast.success('Media item deleted');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (err: any) {
      toast.error('Failed to delete item', { description: err.message });
    } finally {
      setDeleteItem(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMediaUrl('');
    setCloudinaryPublicId('');
    setThumbnailUrl('');
  };

  return (
    <AdminShell title="Gallery & Media Manager">
      <div className="space-y-6">
        {/* Header CTA */}
        <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/60">
          <div>
            <p className="font-semibold text-sm">Media Storage & Cloudinary CDN</p>
            <p className="text-xs text-muted-foreground">Manage public photo gallery assets.</p>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-1.5"
            onClick={() => setUploadOpen(true)}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Photo</span>
          </Button>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm border border-border/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 self-end"
                    onClick={() => setDeleteItem(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Media Uploaded"
            description="Click 'Upload New Photo' to add images to the public gallery."
          />
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Gallery Media</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Image File *</Label>
              <ImageUploader
                value={mediaUrl}
                onChange={(res) => {
                  if (res) {
                    setMediaUrl(res.mediaUrl);
                    setCloudinaryPublicId(res.cloudinaryPublicId);
                    setThumbnailUrl(res.thumbnailUrl || res.mediaUrl);
                  } else {
                    setMediaUrl('');
                    setCloudinaryPublicId('');
                    setThumbnailUrl('');
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gal-title">Caption / Title *</Label>
              <Input
                id="gal-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Teej Celebration 2026 at High School Youth Club"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gal-desc">Description (Optional)</Label>
              <Textarea
                id="gal-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about the photo..."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setUploadOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isSubmitting || !mediaUrl}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save to Gallery'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this media file?
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
