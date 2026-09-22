'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ShieldCheck, UserCheck, Edit2, Loader2, Search, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type { UserProfile, UserRole, UserStatus, ApiPaginatedResponse } from '@/types';
import { useAuth } from '@/lib/auth-context';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { profile: myProfile } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('VOLUNTEER');
  const [newStatus, setNewStatus] = useState<UserStatus>('active');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<UserProfile>>('/users', {
        params: { page, limit: 15 },
      });
      return res.data;
    },
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      await apiClient.patch(`/users/${selectedUser._id}/role`, {
        role: newRole,
        status: newStatus,
      });

      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUser(null);
    } catch (err: any) {
      toast.error('Failed to update user role', { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/users/${userToDelete._id}`);
      toast.success('User account deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToDelete(null);
    } catch (err: any) {
      toast.error('Failed to delete user', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<UserProfile>[] = [
    {
      header: 'User',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={item.avatar || ''} alt={item.fullName} />
            <AvatarFallback className="text-xs font-bold bg-muted">
              {item.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{item.fullName}</p>
            <p className="text-[11px] text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (item) => (
        <Badge
          variant={item.role === 'SUPER_ADMIN' ? 'destructive' : item.role === 'ADMIN' ? 'default' : 'outline'}
          className="text-xs font-mono capitalize"
        >
          {item.role.toLowerCase().replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge
          variant={item.status === 'active' ? 'success' : 'secondary'}
          className="capitalize text-[10px]"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Joined',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => {
        const isSelf = myProfile?._id === item._id;
        const isSuperAdmin = item.role === 'SUPER_ADMIN';
        const isDeleteDisabled = isSelf || (isSuperAdmin && myProfile?.role !== 'SUPER_ADMIN');

        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => {
                setSelectedUser(item);
                setNewRole(item.role);
                setNewStatus(item.status);
              }}
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Profile & Role</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleteDisabled}
              title={
                isSelf
                  ? 'Cannot delete your own account'
                  : isSuperAdmin && myProfile?.role !== 'SUPER_ADMIN'
                  ? 'Only Super Admins can delete Super Admin accounts'
                  : `Delete ${item.fullName}`
              }
              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => setUserToDelete(item)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete User</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminShell title="Users & Role-Based Access Control">
      <div className="space-y-6">
        <div className="bg-card p-4 rounded-xl border border-border/60">
          <h2 className="font-semibold text-sm">User Directory & Role Permissions</h2>
          <p className="text-xs text-muted-foreground">
            Manage authenticated users, grant administrative permissions, and control account statuses.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total}
          onPageChange={setPage}
          emptyTitle="No Registered Users Found"
          emptyDescription="Registered club members will appear here."
        />
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Member Profile & Role</DialogTitle>
                <DialogDescription>
                  Review account details and update permissions for this club member.
                </DialogDescription>
              </DialogHeader>

              {/* User Profile Card Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/70 my-2">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0">
                  <AvatarImage src={selectedUser.avatar || ''} alt={selectedUser.fullName} />
                  <AvatarFallback className="font-bold bg-primary/10 text-primary">
                    {selectedUser.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="font-heading font-bold text-sm text-foreground truncate">
                    {selectedUser.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                    <span>ID: <code className="font-mono text-[10px]">HSYC-KP5-{selectedUser._id.slice(-6).toUpperCase()}</code></span>
                    <span>•</span>
                    <span>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateRole} className="space-y-4 py-1">
                <div className="space-y-2">
                  <Label htmlFor="usr-role">Assigned Role</Label>
                  <select
                    id="usr-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm capitalize"
                  >
                    <option value="VOLUNTEER">Volunteer / General User</option>
                    <option value="CONTENT_MANAGER">Content Manager (CMS, Gallery, Notices)</option>
                    <option value="EVENT_MANAGER">Event Manager (Events, RSVPs)</option>
                    <option value="ADMIN">Admin (Full Management)</option>
                    {myProfile?.role === 'SUPER_ADMIN' && (
                      <option value="SUPER_ADMIN">Super Admin (System Owner)</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usr-status">Account Status</Label>
                  <select
                    id="usr-status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm capitalize"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending Approval</option>
                  </select>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setSelectedUser(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && !isDeleting && setUserToDelete(null)}>
        <DialogContent className="max-w-md">
          {userToDelete && (
            <>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Delete Account
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to permanently delete the account for{' '}
                  <strong className="text-foreground">{userToDelete.fullName}</strong> ({userToDelete.email})?
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2.5 my-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>
                  This will permanently delete this member profile from the database and record this action in the security audit log. This action cannot be undone.
                </span>
              </div>

              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setUserToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
                  disabled={isDeleting}
                  onClick={handleDeleteUser}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </>
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
