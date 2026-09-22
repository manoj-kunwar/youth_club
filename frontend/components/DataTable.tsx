'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  total?: number;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter criteria.',
  page = 1,
  totalPages = 1,
  onPageChange,
  total,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} cols={columns.length} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {/* Mobile Horizontal Scroll Hint */}
        <div className="sm:hidden px-3 py-1.5 bg-muted/40 border-b border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Swipe horizontally to view full columns</span>
          <span className="font-bold text-xs">⇄</span>
        </div>
        <div className="overflow-x-auto w-full min-w-full">
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader className="bg-muted/40">
              <TableRow>
                {columns.map((col, idx) => (
                  <TableHead key={String(col.accessorKey || col.header || idx)} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, rowIdx) => {
                const key = item._id || item.id || `row-${rowIdx}`;
                return (
                  <TableRow key={key} className="hover:bg-muted/30 transition-colors">
                    {columns.map((col, colIdx) => (
                      <TableCell key={String(col.accessorKey || colIdx)} className={col.className}>
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                          ? String(item[col.accessorKey] ?? '')
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-muted-foreground text-center sm:text-left">
          <div>
            {typeof total === 'number' && (
              <span>Showing {data.length} of {total} items</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-9 w-9 p-0 min-h-[36px] min-w-[36px]"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-9 w-9 p-0 min-h-[36px] min-w-[36px]"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
