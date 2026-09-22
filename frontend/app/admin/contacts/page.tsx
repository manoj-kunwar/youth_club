'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Mail, Phone, Calendar, Eye, Check, Archive, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { ContactMessage, ApiPaginatedResponse } from '@/types';

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', page],
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<ContactMessage>>('/admin/contacts', {
        params: { page, limit: 10 },
      });
      return res.data;
    },
  });

  const messages = data?.data || [];
  const pagination = data?.pagination;

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await apiClient.patch(`/admin/contacts/${id}/read`, { isRead });
      toast.success(isRead ? 'Marked as read' : 'Marked as unread');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (err: any) {
      toast.error('Failed to update status', { description: err.message });
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/contacts/${messageToDelete._id}`);
      toast.success('Contact inquiry deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      if (selectedMessage?._id === messageToDelete._id) setSelectedMessage(null);
      setMessageToDelete(null);
    } catch (err: any) {
      toast.error('Failed to delete inquiry', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      header: 'Sender',
      cell: (item) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            {!item.isRead && (
              <span className="h-2 w-2 rounded-full bg-red-600 inline-block" />
            )}
            <span>{item.name}</span>
          </p>
          <p className="text-[11px] text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      header: 'Subject',
      cell: (item) => (
        <p className="font-medium text-xs truncate max-w-xs">{item.subject}</p>
      ),
    },
    {
      header: 'Date',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.isRead ? 'outline' : 'secondary'} className="text-[10px]">
          {item.isRead ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => {
              setSelectedMessage(item);
              if (!item.isRead) handleMarkRead(item._id, true);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Read</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
            onClick={() => setMessageToDelete(item)}
            title="Delete Inquiry"
          >
            <Archive className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell title="Contact Inquiries">
      <div className="space-y-6">
        <div className="bg-card p-4 rounded-xl border border-border/60">
          <h2 className="font-semibold text-sm">Community Inquiries & Messages</h2>
          <p className="text-xs text-muted-foreground">
            Messages submitted by community members, partners, and visitors via the public contact form.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={messages}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total}
          onPageChange={setPage}
          emptyTitle="No Messages Received"
          emptyDescription="Contact inquiries submitted through the public portal will appear here."
        />
      </div>

      {/* Message View Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-xl">
          {selectedMessage && (
            <>
              <DialogHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Inquiry Details
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold text-left">
                  {selectedMessage.subject}
                </DialogTitle>
                <DialogDescription className="text-left text-xs space-y-1">
                  <span className="block font-semibold text-foreground">
                    From: {selectedMessage.name} ({selectedMessage.email})
                  </span>
                  {selectedMessage.phone && (
                    <span className="block text-muted-foreground">
                      Phone: {selectedMessage.phone}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-sm whitespace-pre-wrap leading-relaxed text-foreground my-2">
                {selectedMessage.message}
              </div>

              <DialogFooter className="flex justify-between items-center sm:justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessageToDelete(selectedMessage)}
                  className="gap-1.5 text-muted-foreground hover:text-red-600 hover:border-red-500/30"
                >
                  <Archive className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
                <Button size="sm" asChild className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}>
                    <Mail className="h-4 w-4" />
                    <span>Reply via Email</span>
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Inquiry Confirmation Dialog */}
      <Dialog open={!!messageToDelete} onOpenChange={(open) => !open && !isDeleting && setMessageToDelete(null)}>
        <DialogContent className="max-w-md">
          {messageToDelete && (
            <>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Delete Inquiry
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to permanently delete this inquiry from{' '}
                  <strong className="text-foreground">{messageToDelete.name}</strong> ({messageToDelete.email})?
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-muted/50 border border-border/70 text-xs space-y-1 my-1">
                <p className="font-semibold text-foreground truncate">Subject: {messageToDelete.subject}</p>
                <p className="text-muted-foreground line-clamp-2">{messageToDelete.message}</p>
              </div>

              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2 my-1">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>
                  This will permanently delete this inquiry from the database and record this action in the security audit log. This action cannot be undone.
                </span>
              </div>

              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setMessageToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
                  disabled={isDeleting}
                  onClick={handleDeleteMessage}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Inquiry'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
