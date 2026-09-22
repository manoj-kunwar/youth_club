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
import { Plus, Pin, Trash2, Edit2, Search, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNotices } from '@/hooks/use-queries';
import { apiClient } from '@/lib/api-client';
import type { Notice, NoticeCategory, NoticePriority } from '@/types';

export default function AdminNoticesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteNoticeItem, setDeleteNoticeItem] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('general');
  const [priority, setPriority] = useState<NoticePriority>('medium');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(true);

  const { data, isLoading } = useNotices({
    page,
    limit: 10,
    search: search || undefined,
  });

  const notices = data?.data || [];
  const pagination = data?.pagination;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/notices', {
        title,
        category,
        priority,
        content,
        attachmentUrl: attachmentUrl || undefined,
        pinned,
        published,
      });

      toast.success('Notice published successfully!');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error('Failed to create notice', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      await apiClient.patch(`/notices/${notice._id}/pin`, {
        pinned: !notice.pinned,
      });
      toast.success(`Notice ${!notice.pinned ? 'pinned' : 'unpinned'}`);
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    } catch (err: any) {
      toast.error('Failed to update pin', { description: err.message });
    }
  };

  const handleDelete = async () => {
    if (!deleteNoticeItem) return;
    try {
      await apiClient.delete(`/notices/${deleteNoticeItem._id}`);
      toast.success('Notice deleted');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    } catch (err: any) {
      toast.error('Failed to delete notice', { description: err.message });
    } finally {
      setDeleteNoticeItem(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('general');
    setPriority('medium');
    setContent('');
    setAttachmentUrl('');
    setPinned(false);
    setPublished(true);
  };

  const columns: Column<Notice>[] = [
    {
      header: 'Title',
      cell: (item) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            {item.pinned && <Pin className="h-3 w-3 text-red-600 fill-red-600" />}
            <span>{item.title}</span>
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => (
        <Badge variant="outline" className="capitalize text-xs">
          {item.category}
        </Badge>
      ),
    },
    {
      header: 'Priority',
      cell: (item) => (
        <Badge
          variant={item.priority === 'urgent' ? 'destructive' : 'secondary'}
          className="capitalize text-[10px]"
        >
          {item.priority}
        </Badge>
      ),
    },
    {
      header: 'Pinned',
      cell: (item) => (
        <Button
          variant={item.pinned ? 'default' : 'outline'}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => handleTogglePin(item)}
        >
          <Pin className="h-3 w-3" />
          <span>{item.pinned ? 'Pinned' : 'Pin'}</span>
        </Button>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
            <Link href={`/admin/notices/${item._id}/edit`}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setDeleteNoticeItem(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell title="Notices & Announcements">
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border/60">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-1.5 w-full sm:w-auto"
          >
            <Link href="/admin/notices/new">
              <Plus className="h-4 w-4" />
              <span>Publish New Notice</span>
            </Link>
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={notices}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total}
          onPageChange={setPage}
          emptyTitle="No Notices Found"
          emptyDescription="Click 'Publish New Notice' to broadcast your first announcement."
        />
      </div>

      {/* Create Notice Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publish New Notice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ntc-title">Notice Headline *</Label>
              <Input
                id="ntc-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual General Body Meeting Notice"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ntc-cat">Category *</Label>
                <select
                  id="ntc-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent Alert</option>
                  <option value="event">Event Bulletin</option>
                  <option value="recruitment">Recruitment</option>
                  <option value="financial">Financial Report</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ntc-pri">Priority *</Label>
                <select
                  id="ntc-pri"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NoticePriority)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ntc-content">Notice Content *</Label>
              <Textarea
                id="ntc-content"
                required
                rows={6}
                placeholder="Official notice body, instructions, agenda, and contacts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ntc-att">Attachment URL (Optional)</Label>
              <Input
                id="ntc-att"
                placeholder="https://... (PDF, Document link)"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={pinned} onCheckedChange={setPinned} id="ntc-pin" />
                <Label htmlFor="ntc-pin" className="text-xs">Pin to top</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={published} onCheckedChange={setPublished} id="ntc-pub" />
                <Label htmlFor="ntc-pub" className="text-xs">Publish immediately</Label>
              </div>
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
                    Publishing...
                  </>
                ) : (
                  'Publish Notice'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteNoticeItem} onOpenChange={(open) => !open && setDeleteNoticeItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete notice <strong>{deleteNoticeItem?.title}</strong>?
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
