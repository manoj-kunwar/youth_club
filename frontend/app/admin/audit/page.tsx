'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { DataTable, Column } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse } from '@/types';

interface AuditLogItem {
  _id: string;
  userId?: {
    _id: string;
    fullName: string;
    email: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<AuditLogItem>>('/admin/audit', {
        params: { page, limit: 15 },
      });
      return res.data;
    },
  });

  const logs = data?.data || [];
  const pagination = data?.pagination;

  const columns: Column<AuditLogItem>[] = [
    {
      header: 'Timestamp',
      cell: (item) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'User',
      cell: (item) => (
        <span className="text-xs font-semibold text-foreground">
          {item.userId?.fullName || 'System / Anonymous'}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (item) => (
        <Badge variant="outline" className="text-[10px] font-mono">
          {item.action}
        </Badge>
      ),
    },
    {
      header: 'Resource',
      cell: (item) => (
        <span className="text-xs font-medium">{item.resource}</span>
      ),
    },
    {
      header: 'IP Address',
      cell: (item) => (
        <span className="text-xs font-mono text-muted-foreground">
          {item.ipAddress || '—'}
        </span>
      ),
    },
  ];

  return (
    <AdminShell title="Security & Audit Logs">
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/60">
          <div>
            <h2 className="font-semibold text-sm">System Audit Trail</h2>
            <p className="text-xs text-muted-foreground">
              Immutable record of administrative operations, content updates, and authentication events.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total}
          onPageChange={setPage}
          emptyTitle="No Audit Logs Recorded"
          emptyDescription="Administrative operations will be logged here automatically."
        />
      </div>
    </AdminShell>
  );
}
