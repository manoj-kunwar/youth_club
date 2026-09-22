'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { toast } from 'sonner';
import { useMembers } from '@/hooks/use-queries';
import { apiClient } from '@/lib/api-client';
import type { Member, MemberRole } from '@/types';

export default function AdminMembersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [nepaliName, setNepaliName] = useState('');
  const [role, setRole] = useState<MemberRole>('member');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [bio, setBio] = useState('');

  const { data, isLoading } = useMembers({
    page,
    limit: 15,
  });

  const members = data?.data || [];
  const pagination = data?.pagination;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/members', {
        fullName,
        nepaliName: nepaliName || undefined,
        role,
        position: position || undefined,
        email: email || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
        bio: bio || undefined,
        status: 'active',
        isVolunteer: role === 'volunteer',
        skills: [],
        socialLinks: {},
      });

      toast.success('Member added successfully!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
      setCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error('Failed to add member', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await apiClient.delete(`/admin/members/${deleteItem._id}`);
      toast.success('Member removed');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });
      queryClient.invalidateQueries({ queryKey: ['content', 'stats'] });
    } catch (err: any) {
      toast.error('Failed to remove member', { description: err.message });
    } finally {
      setDeleteItem(null);
    }
  };

  const resetForm = () => {
    setFullName('');
    setNepaliName('');
    setRole('member');
    setPosition('');
    setEmail('');
    setPhone('');
    setProfileImage('');
    setBio('');
  };

  const columns: Column<Member>[] = [
    {
      header: 'Member',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={item.profileImage || ''} alt={item.fullName} />
            <AvatarFallback className="text-xs font-bold bg-muted">
              {item.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{item.fullName}</p>
            {item.nepaliName && (
              <p className="text-[11px] text-muted-foreground">{item.nepaliName}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (item) => (
        <Badge variant="outline" className="capitalize text-xs">
          {item.role?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Contact',
      cell: (item) => (
        <div className="text-xs text-muted-foreground space-y-0.5">
          {item.phone && <p>{item.phone}</p>}
          {item.email && <p>{item.email}</p>}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant="success" className="text-[10px] capitalize">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => setDeleteItem(item)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <AdminShell title="Member & Executive Board Management">
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/60">
          <div>
            <p className="font-semibold text-sm">Community Executive Board & Volunteer Roster</p>
            <p className="text-xs text-muted-foreground">Manage active committee positions and members.</p>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-1.5"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>

        {/* Member Table */}
        <DataTable
          columns={columns}
          data={members}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total}
          onPageChange={setPage}
          emptyTitle="No Members Listed"
          emptyDescription="Click 'Add Member' to record your first committee member."
        />
      </div>

      {/* Add Member Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Committee Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mem-name">Full Name (English) *</Label>
                <Input
                  id="mem-name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Shrestha"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mem-nep-name">Nepali Name (Optional)</Label>
                <Input
                  id="mem-nep-name"
                  value={nepaliName}
                  onChange={(e) => setNepaliName(e.target.value)}
                  placeholder="e.g. रमेश श्रेष्ठ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mem-role">Role *</Label>
                <select
                  id="mem-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as MemberRole)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm capitalize"
                >
                  <option value="president">President (अध्यक्ष)</option>
                  <option value="vice_president">Vice President (उपाध्यक्ष)</option>
                  <option value="secretary">Secretary (सचिव)</option>
                  <option value="treasurer">Treasurer (कोषाध्यक्ष)</option>
                  <option value="executive">Executive Member (कार्यसमिति सदस्य)</option>
                  <option value="member">General Member (साधारण सदस्य)</option>
                  <option value="volunteer">Volunteer (स्वयंसेवक)</option>
                  <option value="advisor">Advisor (सल्लाहकार)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mem-pos">Designation / Title (Optional)</Label>
                <Input
                  id="mem-pos"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Sports Coordinator"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mem-phone">Phone Number</Label>
                <Input
                  id="mem-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mem-email">Email Address</Label>
                <Input
                  id="mem-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <ImageUploader
                value={profileImage}
                onChange={(res) => setProfileImage(res?.mediaUrl || '')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mem-bio">Bio / Background Note (Optional)</Label>
              <Textarea
                id="mem-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of member's community work..."
              />
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
                  'Save Member'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteItem?.fullName}</strong> from the committee directory?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
