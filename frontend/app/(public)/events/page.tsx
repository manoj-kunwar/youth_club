'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';
import { CardGridSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { useEvents } from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';

export default function EventsPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const eventCategories = [
    { value: '', label: t('eventsPage.allEvents') },
    { value: 'cultural', label: language === 'ne' ? 'सांस्कृतिक' : 'Cultural' },
    { value: 'sports', label: language === 'ne' ? 'खेलकुद' : 'Sports' },
    { value: 'community_service', label: language === 'ne' ? 'सामुदायिक सेवा' : 'Community Service' },
    { value: 'educational', label: language === 'ne' ? 'शैक्षिक' : 'Educational' },
    { value: 'celebration', label: language === 'ne' ? 'उत्सव' : 'Celebration' },
  ];

  const { data, isLoading } = useEvents({
    search: search || undefined,
    eventType: category || undefined,
    published: true,
    page,
    limit: 9,
  });

  const events = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={t('eventsPage.badge')}
        title={t('eventsPage.title')}
        subtitle={t('eventsPage.subtitle')}
        breadcrumbs={[{ label: t('nav.events') }]}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide py-0.5">
            {eventCategories.map((cat) => (
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

          {/* Search Box */}
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

        {/* Event List */}
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event._id}
                className="overflow-hidden border border-border/60 hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {event.coverImage ? (
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/10 to-amber-500/10 text-muted-foreground">
                      <Calendar className="h-10 w-10 opacity-40 text-red-600" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-white/90 text-slate-900 dark:bg-black/80 dark:text-white backdrop-blur text-[11px] font-bold capitalize">
                      {event.eventType}
                    </Badge>
                    {event.registrationEnabled && (
                      <Badge className="bg-emerald-600 text-white text-[11px] font-bold">
                        {t('eventsPage.registerNow')}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="p-5 flex-1 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(event.date).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {event.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {event.startTime}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-red-600 transition-colors">
                    <Link href={`/events/${event.slug}`}>{event.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                    {event.shortDescription || event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 mt-auto border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                  <Button variant="ghost" size="sm" asChild className="font-semibold text-red-600">
                    <Link href={`/events/${event.slug}`}>{t('eventsPage.viewDetails')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('eventsPage.noEvents')}
            description={t('eventsPage.noEventsDesc')}
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
