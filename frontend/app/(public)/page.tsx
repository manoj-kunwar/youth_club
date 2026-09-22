'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Users,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Heart,
  ChevronRight,
  Bell,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionHeading } from '@/components/SectionHeading';
import { StatCard } from '@/components/StatCard';
import { CardGridSkeleton } from '@/components/LoadingSkeleton';
import {
  useEvents,
  useNotices,
  useActivities,
  useAchievements,
  useGallery,
  usePublicStats,
} from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';

function formatStatNumber(val: number | string | null | undefined, language: string): string {
  if (val === null || val === undefined || val === '—' || val === '-') return '—';
  const str = String(val);
  if (language !== 'ne') return str;
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)]);
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: 3, published: true });
  const { data: noticesData } = useNotices({ limit: 1, isUrgent: true });
  const { data: activitiesData } = useActivities({ limit: 4, published: true });
  const { data: achievementsData } = useAchievements({ limit: 4, published: true });
  const { data: galleryData } = useGallery({ limit: 6 });
  const { data: statsData } = usePublicStats();

  const events = eventsData?.data || [];
  const notices = noticesData?.data || [];
  const activities = activitiesData?.data || [];
  const achievements = achievementsData?.data || [];
  const gallery = galleryData?.data || [];

  const activeVolunteersVal = statsData !== undefined
    ? formatStatNumber(statsData?.activeVolunteers ?? 0, language)
    : (language === 'ne' ? '०' : '0');

  const projectsExecutedVal = statsData !== undefined
    ? formatStatNumber(statsData?.projectsExecuted ?? 0, language)
    : (language === 'ne' ? '०' : '0');

  const annualFestivalsVal = statsData !== undefined
    ? formatStatNumber(statsData?.annualFestivals ?? 0, language)
    : (language === 'ne' ? '०' : '0');

  const grassrootsDrivenVal = statsData?.grassrootsDriven
    ? formatStatNumber(statsData.grassrootsDriven, language)
    : '—';

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden text-white py-14 sm:py-20 md:py-24 school-bg-hero">
        {/* Next.js Optimized LCP Hero Image */}
        <Image
          src="/community-group.jpg"
          alt="High School Youth Club Community"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center -z-20 pointer-events-none"
        />

        {/* Subtle Dark Overlay to preserve clarity while keeping text crisp */}
        <div className="absolute inset-0 -z-10 bg-black/35 bg-gradient-to-b from-black/55 via-black/20 to-black/65 pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-auto">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)] max-w-4xl">
              {t('hero.titleStart')}{' '}
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent block sm:inline">
                {t('hero.titleEnd')}
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-xs sm:text-base md:text-xl text-slate-100 max-w-2xl leading-relaxed font-normal sm:font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-2">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 w-full max-w-xs sm:max-w-none">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-base shadow-xl shadow-black/50 px-5 sm:px-8 h-10 sm:h-12 w-full sm:w-auto transition-transform hover:scale-105"
                asChild
              >
                <Link href="/events">
                  {t('hero.exploreEvents')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-black/40 hover:bg-black/60 text-white font-semibold text-xs sm:text-base backdrop-blur-md px-5 sm:px-8 h-10 sm:h-12 w-full sm:w-auto shadow-xl shadow-black/40 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/member/register">{t('hero.joinCommunity')}</Link>
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pt-5 sm:pt-8 w-full border-t border-white/20 mt-6 sm:mt-8 text-center backdrop-blur-md bg-black/35 rounded-2xl p-3 sm:p-6 shadow-2xl">
              <div>
                <p className="font-heading text-xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                  {activeVolunteersVal}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium mt-0.5">
                  {t('hero.statVolunteersLabel')}
                </p>
              </div>
              <div>
                <p className="font-heading text-xl sm:text-3xl font-extrabold text-amber-300 drop-shadow-md">
                  {projectsExecutedVal}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium mt-0.5">
                  {t('hero.statProjectsLabel')}
                </p>
              </div>
              <div>
                <p className="font-heading text-xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                  {annualFestivalsVal}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium mt-0.5">
                  {t('hero.statFestivalsLabel')}
                </p>
              </div>
              <div>
                <p className="font-heading text-xl sm:text-3xl font-extrabold text-emerald-300 drop-shadow-md">
                  {grassrootsDrivenVal}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium mt-0.5">
                  {t('hero.statGrassrootsLabel')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Urgent Notices / Bulletin Bar ───────────────────────────────────── */}
      {notices.length > 0 && (
        <section className="bg-amber-500/10 border-y border-amber-500/20 py-3 px-4">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="flex h-6 items-center px-2 rounded bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-[10px]">
                {language === 'ne' ? 'सूचना' : 'Notice'}
              </span>
              <span className="font-semibold text-foreground truncate">
                {notices[0]?.title}
              </span>
            </div>
            <Link
              href="/notices"
              className="text-red-600 dark:text-red-400 font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>{t('homeSections.viewAllNotices')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── Upcoming Events Section ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background transition-colors duration-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <SectionHeading
              align="left"
              tagline={t('homeSections.eventsBadge')}
              title={t('homeSections.eventsTitle')}
              subtitle={t('homeSections.eventsSubtitle')}
            />
            <Button variant="outline" asChild className="self-start md:self-end">
              <Link href="/events" className="gap-1">
                <span>{t('homeSections.viewAllEvents')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {eventsLoading ? (
            <CardGridSkeleton count={3} />
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event._id}
                  className="overflow-hidden border border-border/60 hover:shadow-lg transition-all group flex flex-col bg-card"
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
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-slate-900 dark:bg-black/80 dark:text-white backdrop-blur text-[11px] font-bold capitalize">
                        {event.eventType}
                      </Badge>
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
            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-muted/20 space-y-3">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="font-heading font-semibold text-lg">{t('homeSections.noEvents')}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {t('eventsPage.noEventsDesc')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Core Pillars / Impact Areas ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50 transition-colors duration-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            tagline={t('homeSections.activitiesBadge')}
            title={t('homeSections.activitiesTitle')}
            subtitle={t('homeSections.activitiesSubtitle')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-border/60 bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-lg">{t('about.valCultureTitle')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('about.valCultureDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-lg">{t('activitiesPage.health')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ne'
                    ? 'नियमित निःशुल्क रक्तदान शिविर, स्वास्थ्य परीक्षण र विपद्मा परेका परिवारलाई आपतकालीन सहयोग।'
                    : 'Regular free blood donation drives, health checkup camps, and emergency relief support for families in need.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-lg">{t('about.valEnvironmentTitle')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('about.valEnvironmentDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-lg">{t('activitiesPage.leadership')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ne'
                    ? 'वार्षिक फुटबल तथा क्रिकेट प्रतियोगिता, नेतृत्व विकास कार्यशाला र युवा अन्तरक्रिया गोष्ठीहरू।'
                    : 'Annual football and cricket tournaments, leadership workshops, career mentorship, and public speaking forums.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Gallery Spotlight ──────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-16 md:py-24 bg-background transition-colors duration-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <SectionHeading
                align="left"
                tagline={t('homeSections.galleryBadge')}
                title={t('homeSections.galleryTitle')}
                subtitle={t('homeSections.gallerySubtitle')}
              />
              <Button variant="outline" asChild>
                <Link href="/gallery" className="gap-1">
                  <span>{t('homeSections.viewAllGallery')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-muted group shadow-sm border border-border/50"
                >
                  <Image
                    src={item.mediaUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <p className="text-white text-[11px] font-medium leading-tight truncate">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Join Club CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            <span>🇳🇵</span>
            <span>{t('homeSections.ctaBadge')}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('homeSections.ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t('homeSections.ctaDesc')}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto w-full">
            <Button
              size="lg"
              className="bg-white text-red-700 hover:bg-white/90 font-bold px-8 h-12 shadow-xl w-full sm:w-auto"
              asChild
            >
              <Link href="/member/register">{t('homeSections.ctaButton')}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 h-12 w-full sm:w-auto"
              asChild
            >
              <Link href="/contact">{t('homeSections.ctaSecondary')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
