'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Activity as ActivityIcon, Users, Calendar, Search } from 'lucide-react';
import { CardGridSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { useActivities } from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';

export default function ActivitiesPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const activityCategories = [
    { value: '', label: t('activitiesPage.allCategories') },
    { value: 'environment', label: t('activitiesPage.environment') },
    { value: 'health', label: t('activitiesPage.health') },
    { value: 'sports', label: t('activitiesPage.sports') },
    { value: 'education', label: t('activitiesPage.education') },
    { value: 'social_work', label: language === 'ne' ? 'सामाजिक कार्य' : 'Social Work' },
    { value: 'culture', label: t('activitiesPage.culture') },
  ];

  const { data, isLoading } = useActivities({
    search: search || undefined,
    category: category || undefined,
    published: true,
    page,
    limit: 9,
  });

  const activities = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={t('activitiesPage.badge')}
        title={t('activitiesPage.title')}
        subtitle={t('activitiesPage.subtitle')}
        breadcrumbs={[{ label: t('nav.activities') }]}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border/60">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide py-0.5">
            {activityCategories.map((cat) => (
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
              placeholder={t('activitiesPage.searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Activity Grid */}
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <Card
                key={act._id}
                className="overflow-hidden border border-border/60 hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {act.coverImage ? (
                    <Image
                      src={act.coverImage}
                      alt={act.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-red-500/10 text-muted-foreground">
                      <ActivityIcon className="h-10 w-10 opacity-40 text-amber-600" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-slate-900 dark:bg-black/80 dark:text-white backdrop-blur text-[11px] font-bold capitalize">
                      {act.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-5 flex-1 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-red-600">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(act.date).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {act.location && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {act.location}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">
                    {act.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {act.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('activitiesPage.noActivities')}
            description={t('activitiesPage.noActivitiesDesc')}
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
