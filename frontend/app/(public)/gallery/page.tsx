'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ZoomIn, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { useGallery } from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';
import type { Gallery } from '@/types';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);

  const { data, isLoading } = useGallery({
    page,
    limit: 12,
  });

  const galleryItems = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={t('galleryPage.badge')}
        title={t('galleryPage.title')}
        subtitle={t('galleryPage.subtitle')}
        breadcrumbs={[{ label: t('nav.gallery') }]}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer shadow-sm border border-border/50 hover:shadow-md transition-all"
              >
                <Image
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 sm:p-4 text-white">
                  <div className="self-end">
                    <span className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                      <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs sm:text-sm leading-snug line-clamp-1">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 mt-0.5 hidden xs:block">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('galleryPage.noPhotos')}
            description={t('galleryPage.noPhotosDesc')}
          />
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t('common.previous')}
            </Button>
            <span className="inline-flex items-center px-4 text-xs font-semibold text-muted-foreground">
              {t('common.page')} {page} {t('common.of')} {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('common.next')}
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Preview Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="w-[95vw] sm:max-w-4xl p-0 overflow-hidden bg-black/95 text-white border-0 max-h-[90dvh] overflow-y-auto">
          {selectedItem && (
            <div className="flex flex-col">
              <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black flex items-center justify-center">
                <Image
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  fill
                  sizes="(max-width: 1024px) 95vw, 896px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="p-4 sm:p-6 bg-zinc-900 border-t border-zinc-800 space-y-2">
                <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                  {selectedItem.title}
                </DialogTitle>
                {selectedItem.description && (
                  <DialogDescription className="text-xs sm:text-sm text-zinc-400">
                    {selectedItem.description}
                  </DialogDescription>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
