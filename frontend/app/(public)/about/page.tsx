'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Target,
  Compass,
  CheckCircle2,
  Users,
  BookOpen,
  Activity,
  HeartHandshake,
  Sparkles,
  Leaf,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
  Handshake,
  Calendar,
} from 'lucide-react';
import {
  useMembers,
  usePublicStats,
  useEvents,
  useActivities,
} from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';

function formatStat(val: number | undefined | null, language: string): string {
  if (val === undefined || val === null || val === 0) return '—';
  const str = String(val);
  if (language !== 'ne') return str;
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)]);
}

export default function AboutPage() {
  const { t, language } = useLanguage();

  // Real Database Queries
  const { data: statsData } = usePublicStats();
  const { data: membersData } = useMembers({ status: 'active', limit: 8 });
  const { data: eventsData } = useEvents({ limit: 1, published: true });
  const { data: activitiesData } = useActivities({ limit: 1, published: true });

  const members = membersData?.data || [];
  const totalActiveMembers = membersData?.pagination?.total ?? (members.length > 0 ? members.length : 0);
  const totalCommunityEvents = eventsData?.pagination?.total ?? 0;
  const totalActivitiesCompleted = activitiesData?.pagination?.total ?? statsData?.projectsExecuted ?? 0;
  const totalVolunteers = statsData?.activeVolunteers ?? (totalActiveMembers > 0 ? totalActiveMembers : 0);

  // Objectives Data
  const objectives = [
    {
      icon: Users,
      color: 'text-red-600 dark:text-red-400 bg-red-500/10',
      title: language === 'ne' ? 'युवा नेतृत्व (Youth Leadership)' : 'Youth Leadership',
      description:
        language === 'ne'
          ? 'युवाहरूलाई टोली कार्य, प्रभावकारी सञ्चार र नेतृत्व सीपमा सशक्त बनाउँदै स्थानीय समस्या समाधानमा सक्षम बनाउने।'
          : 'Empowering local youth with practical leadership, teamwork, communication, and decision-making skills.',
    },
    {
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
      title: language === 'ne' ? 'शिक्षा तथा सिकाइ (Education & Learning)' : 'Education & Learning',
      description:
        language === 'ne'
          ? 'विद्यार्थीहरूलाई शैक्षिक सामग्री सहयोग, अतिरिक्त क्रियाकलाप र साक्षरता प्रवर्द्धनमा टेवा पुर्याउने।'
          : 'Supporting students with learning resources, literacy initiatives, and academic enrichment in our locality.',
    },
    {
      icon: Activity,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      title: language === 'ne' ? 'खेलकुद तथा स्वस्थ जीवन (Sports & Healthy Living)' : 'Sports & Healthy Living',
      description:
        language === 'ne'
          ? 'फुटबल, भलिबल, एथलेटिक्स लगायतका खेलकुद प्रतियोगिता र प्रशिक्षणमार्फत अनुशासित र स्वस्थ जीवनशैली अपनाउने।'
          : 'Organizing sports tournaments, athletic coaching, and fitness activities to promote healthy, disciplined living.',
    },
    {
      icon: HeartHandshake,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      title: language === 'ne' ? 'सामुदायिक सेवा (Community Service)' : 'Community Service',
      description:
        language === 'ne'
          ? 'स्थानीय टोल सरसफाइ, विपद् सहयोग तथा स्वैच्छिक सामुदायिक सहायता अभियानहरू सञ्चालन गर्ने।'
          : 'Coordinating civic cleanups, voluntary aid, and mutual assistance for the welfare of Krishnapur-5 residents.',
    },
    {
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      title: language === 'ne' ? 'सांस्कृतिक गतिविधि (Cultural Activities)' : 'Cultural Activities',
      description:
        language === 'ne'
          ? 'नेपाली परम्परा, चाडपर्व, लोकसंस्कृति र मौलिक पहिचानको संरक्षण तथा संवर्द्धन गर्ने।'
          : 'Preserving local Nepali festivals, cultural arts, and community traditions to strengthen cultural heritage.',
    },
    {
      icon: Leaf,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10',
      title: language === 'ne' ? 'वातावरण सचेतना (Environmental Awareness)' : 'Environmental Awareness',
      description:
        language === 'ne'
          ? 'वृक्षारोपण, फोहोर व्यवस्थापन र सार्वजनिक खुला स्थलहरूको संरक्षण गरी स्वच्छ वातावरण निर्माण गर्ने।'
          : 'Advocating tree plantation, proper waste management, and the preservation of green spaces in our community.',
    },
  ];

  // Journey Steps (General, Descriptive, Factual)
  const journeySteps = [
    {
      stage: language === 'ne' ? 'चरण १: सामुदायिक थालनी' : 'Stage 1: Community Inception',
      title: language === 'ne' ? 'युवाहरूको प्रारम्भिक भेला' : 'Initial Youth Gathering',
      description:
        language === 'ne'
          ? 'गुलरियाका युवा तथा विद्यार्थीहरू स्थानीय खेलकुद र टोल सरसफाइका लागि स्वतःस्फूर्त रूपमा भेला भई सहकार्य सुरु गरे।'
          : 'Local students and youth in Gulariya gathered informally to coordinate neighborhood sports and cleanup drives.',
    },
    {
      stage: language === 'ne' ? 'चरण २: संगठित युवा सहकार्य' : 'Stage 2: Structured Coordination',
      title: language === 'ne' ? 'सामुदायिक स्वयंसेवा समूह' : 'Volunteer Group Organization',
      description:
        language === 'ne'
          ? 'सामुदायिक आवश्यकताहरू पूरा गर्न नियमित बैठकहरू आयोजना गर्दै युवा स्वयंसेवक समूहको गठन गरियो।'
          : 'Regular community discussions were convened to establish a committed volunteer group for civic initiatives.',
    },
    {
      stage: language === 'ne' ? 'चरण ३: क्लब कार्यसमिति व्यवस्थापन' : 'Stage 3: Democratic Club Structure',
      title: language === 'ne' ? 'पारदर्शी कार्यसमिति सञ्चालन' : 'Executive Governance',
      description:
        language === 'ne'
          ? 'लोकतान्त्रिक प्रक्रियाबाट कार्यसमिति गठन गरी कृष्णपुर-५ मा संस्थागत रूपमा गतिविधिहरू सञ्चालन गर्न थालियो।'
          : 'Established an executive committee and open, community-oriented practices to govern programs across Krishnapur-5.',
    },
    {
      stage: language === 'ne' ? 'चरण ४: निरन्तर सामुदायिक अभियान' : 'Stage 4: Ongoing Engagement',
      title: language === 'ne' ? 'सक्रिय समाज रूपान्तरण' : 'Active Community Outreach',
      description:
        language === 'ne'
          ? 'खेलकुद, शिक्षा, वातावरण संरक्षण र सामाजिक सद्भावमा निरन्तर सहभागिताका साथ क्लब क्रियाशील छ।'
          : 'Continuously organizing programs in youth sports, educational support, clean environments, and social unity.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <PageHeader
        badge={t('about.badge')}
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        breadcrumbs={[{ label: t('nav.about') }]}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* 2. GUIDING VALUES */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {language === 'ne' ? 'मूल्य तथा मान्यता • Values' : 'Our Principles • मूल्यहरू'}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('about.valuesTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border border-border/70 bg-card p-5 sm:p-6 shadow-sm hover:border-border transition-colors">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                {t('about.valUnityTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('about.valUnityDesc')}
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 sm:p-6 shadow-sm hover:border-border transition-colors">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                {t('about.valDemocracyTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('about.valDemocracyDesc')}
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 sm:p-6 shadow-sm hover:border-border transition-colors">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                {t('about.valCultureTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('about.valCultureDesc')}
              </p>
            </Card>

            <Card className="border border-border/70 bg-card p-5 sm:p-6 shadow-sm hover:border-border transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                {t('about.valEnvironmentTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('about.valEnvironmentDesc')}
              </p>
            </Card>
          </div>
        </section>

        {/* 3. WHO WE ARE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t('about.storyBadge')}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
              {t('about.storyTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {t('about.storyPara1')}
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {t('about.storyPara2')}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-sm sm:max-w-none">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold h-10 w-full sm:w-auto">
                <Link href="/members">{t('about.meetTeamBtn')}</Link>
              </Button>
              <Button variant="outline" asChild className="h-10 w-full sm:w-auto">
                <Link href="/activities">{t('about.exploreActivitiesBtn')}</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <Card className="border border-border/80 bg-card p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold">{t('about.missionTitle')}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                {t('about.missionDesc')}
              </p>
            </Card>

            <Card className="border border-border/80 bg-card p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold">{t('about.visionTitle')}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                {t('about.visionDesc')}
              </p>
            </Card>
          </div>
        </section>

        {/* 4. COMMUNITY IMAGE */}
        <section className="rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-card">
          <div className="relative aspect-[16/9] md:aspect-[16/8] max-h-[520px] w-full">
            <Image
              src="/community-group.jpg"
              alt="High School Youth Club Community Members & Volunteers, Gulariya, Krishnapur-5, Kanchanpur"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="object-cover object-[center_20%] sm:object-[center_25%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/70 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md mb-2">
                  {t('about.showcaseTag')}
                </span>
                <h3 className="font-heading text-xl sm:text-3xl font-black">
                  {t('about.showcaseTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
                  {t('about.showcaseDesc')}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow">
                  {t('about.showcaseChapter')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. OUR OBJECTIVES */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t('about.objectivesBadge')}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('about.objectivesTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {objectives.map((obj, idx) => {
              const Icon = obj.icon;
              return (
                <Card key={idx} className="border border-border/70 bg-card p-5 sm:p-6 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
                  <div>
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${obj.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-2">
                      {obj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {obj.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 6. OUR JOURNEY */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t('about.journeyBadge')}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('about.journeyTitle')}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto pl-4 sm:pl-8 border-l-2 border-red-600/30 dark:border-red-500/30 space-y-8 my-6">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node */}
                <div className="absolute -left-[23px] sm:-left-[39px] top-1 h-3.5 w-3.5 rounded-full bg-red-600 ring-4 ring-background" />
                <div className="space-y-1 bg-card/60 border border-border/60 rounded-xl p-4 sm:p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    {step.stage}
                  </span>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. COMMUNITY IMPACT */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t('about.impactBadge')}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('about.impactTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Active Members */}
            <Card className="border border-border/70 bg-card p-4 sm:p-6 text-center shadow-sm">
              <p className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground">
                {formatStat(totalActiveMembers, language)}
              </p>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mt-2">
                {t('about.impactActiveMembers')}
              </h3>
              {totalActiveMembers === 0 && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  {t('about.impactInfoPending')}
                </p>
              )}
            </Card>

            {/* Community Events */}
            <Card className="border border-border/70 bg-card p-4 sm:p-6 text-center shadow-sm">
              <p className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-500">
                {formatStat(totalCommunityEvents, language)}
              </p>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mt-2">
                {t('about.impactCommunityEvents')}
              </h3>
              {totalCommunityEvents === 0 && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  {t('about.impactInfoPending')}
                </p>
              )}
            </Card>

            {/* Activities Completed */}
            <Card className="border border-border/70 bg-card p-4 sm:p-6 text-center shadow-sm">
              <p className="font-heading text-2xl sm:text-4xl font-extrabold text-emerald-500">
                {formatStat(totalActivitiesCompleted, language)}
              </p>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mt-2">
                {t('about.impactActivitiesCompleted')}
              </h3>
              {totalActivitiesCompleted === 0 && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  {t('about.impactInfoPending')}
                </p>
              )}
            </Card>

            {/* Volunteers */}
            <Card className="border border-border/70 bg-card p-4 sm:p-6 text-center shadow-sm">
              <p className="font-heading text-2xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400">
                {formatStat(totalVolunteers, language)}
              </p>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mt-2">
                {t('about.impactVolunteers')}
              </h3>
              {totalVolunteers === 0 && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  {t('about.impactInfoPending')}
                </p>
              )}
            </Card>
          </div>
        </section>

        {/* 8. EXECUTIVE COMMITTEE */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                {t('about.committeeBadge')}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {t('about.committeeTitle')}
              </h2>
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href="/members" className="flex items-center gap-1.5">
                <span>{language === 'ne' ? 'सबै सदस्यहरू हेर्नुहोस्' : 'View All Members'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <Card
                  key={member._id}
                  className="overflow-hidden border border-border/60 bg-card hover:shadow-md transition-all text-center p-6 flex flex-col items-center"
                >
                  <Avatar className="h-20 w-20 border-2 border-red-500/20 shadow-sm mb-3">
                    <AvatarImage src={member.profileImage || ''} alt={member.fullName} />
                    <AvatarFallback className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold text-base">
                      {member.fullName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 w-full">
                    <h3 className="font-heading font-bold text-base truncate">
                      {member.fullName}
                    </h3>
                    <Badge variant="secondary" className="text-[11px] font-semibold capitalize">
                      {member.position || member.role?.replace('_', ' ') || (language === 'ne' ? 'कार्यसमिति' : 'Executive')}
                    </Badge>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 w-full flex items-center justify-center gap-3 text-muted-foreground text-xs">
                    {member.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </span>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-red-600 transition-colors"
                        title={member.email}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed border-border/80 bg-muted/20 p-8 sm:p-12 text-center rounded-2xl">
              <Users className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {t('about.committeeEmpty')}
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href="/member/register">{t('nav.joinClub')}</Link>
                </Button>
              </div>
            </Card>
          )}
        </section>

        {/* 9. COMMUNITY PARTNERS */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t('about.partnersBadge')}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('about.partnersTitle')}
            </h2>
          </div>

          <Card className="border border-dashed border-border/80 bg-muted/20 p-8 sm:p-12 text-center rounded-2xl">
            <Handshake className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              {t('about.partnersEmpty')}
            </p>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/contact">{t('nav.contact')}</Link>
              </Button>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}
