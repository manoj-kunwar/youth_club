'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pin, Calendar, Paperclip, Search } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useNotices } from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';

export default function NoticesPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const noticeCategories = [
    { value: '', label: language === 'ne' ? 'सबै सूचनाहरू' : 'All Notices' },
    { value: 'urgent', label: language === 'ne' ? 'जरुरी सूचना' : 'Urgent Alerts' },
    { value: 'event', label: language === 'ne' ? 'कार्यक्रम सूचना' : 'Event Bulletins' },
    { value: 'general', label: language === 'ne' ? 'सामान्य' : 'General' },
    { value: 'recruitment', label: language === 'ne' ? 'सदस्यता / भर्ना' : 'Recruitment' },
    { value: 'financial', label: language === 'ne' ? 'आर्थिक विवरण' : 'Financial / Reports' },
  ];

  const { data, isLoading } = useNotices({
    search: search || undefined,
    category: category || undefined,
    published: true,
    page,
    limit: 10,
  });

  const notices = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={t('noticesPage.badge')}
        title={t('noticesPage.title')}
        subtitle={t('noticesPage.subtitle')}
        breadcrumbs={[{ label: t('nav.notices') }]}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border/60">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide py-0.5">
            {noticeCategories.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setCategory(cat.value);
                  setPage(1);
                }}
                className={category === cat.value ? 'bg-red-600 text-white hover:bg-red-700' : 'text-xs'}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Notice Items List */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={3} />
        ) : notices.length > 0 ? (
          <div className="space-y-4">
            {notices.map((notice) => {
              const isUrgent = notice.priority === 'urgent' || notice.category === 'urgent';
              return (
                <Card
                  key={notice._id}
                  className={cn(
                    'border transition-all hover:shadow-md relative overflow-hidden',
                    notice.pinned ? 'border-red-500/40 bg-red-50/20 dark:bg-red-950/10' : 'border-border/60 bg-card',
                    isUrgent && 'border-l-4 border-l-red-600'
                  )}
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {notice.pinned && (
                          <Badge variant="outline" className="border-red-500 text-red-600 text-[10px] gap-1 font-bold">
                            <Pin className="h-3 w-3 fill-red-600" />
                            {language === 'ne' ? 'पिन गरिएको' : 'Pinned'}
                          </Badge>
                        )}
                        <Badge
                          variant={isUrgent ? 'destructive' : 'secondary'}
                          className="text-[10px] font-bold uppercase tracking-wider"
                        >
                          {notice.category}
                        </Badge>
                        {notice.priority && notice.priority !== 'low' && (
                          <Badge
                            variant={notice.priority === 'urgent' ? 'destructive' : 'outline'}
                            className="text-[10px] capitalize"
                          >
                            {notice.priority}
                          </Badge>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(notice.publishedAt || notice.createdAt).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-bold leading-snug">
                      {notice.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    {notice.attachmentUrl && (
                      <div className="pt-2">
                        <Button variant="outline" size="sm" asChild className="text-xs gap-1.5 h-8">
                          <a href={notice.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            <Paperclip className="h-3.5 w-3.5 text-red-600" />
                            <span>{t('noticesPage.downloadNotice')}</span>
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={t('noticesPage.noNotices')}
            description={t('noticesPage.noNoticesDesc')}
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
    </div>
  );
}
