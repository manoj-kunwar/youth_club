'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, HeartHandshake } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { CardGridSkeleton } from '@/components/LoadingSkeleton';
import { useMembers } from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';

export default function MembersPage() {
  const { t, language } = useLanguage();
  const [roleFilter] = useState('');

  const { data, isLoading } = useMembers({
    role: roleFilter || undefined,
    status: 'active',
    limit: 30,
  });

  const members = data?.data || [];

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={t('membersPage.badge')}
        title={t('membersPage.title')}
        subtitle={t('membersPage.subtitle')}
        breadcrumbs={[{ label: t('nav.members') }]}
        actions={
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold">
            <Link href="/member/register">{t('nav.joinClub')}</Link>
          </Button>
        }
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Leadership Grid */}
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <Card
                key={member._id}
                className="overflow-hidden border border-border/60 bg-card hover:shadow-md transition-all text-center p-6 flex flex-col items-center"
              >
                <Avatar className="h-24 w-24 border-2 border-red-500/20 shadow-sm mb-4">
                  <AvatarImage src={member.profileImage || ''} alt={member.fullName} />
                  <AvatarFallback className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold text-lg">
                    {member.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 w-full">
                  <h3 className="font-heading font-bold text-lg leading-snug truncate">
                    {member.fullName}
                  </h3>
                  <div className="pt-0.5">
                    <Badge variant="secondary" className="text-xs font-semibold capitalize">
                      {member.role?.replace('_', ' ') || (language === 'ne' ? 'कार्यसमिति सदस्य' : 'Executive Member')}
                    </Badge>
                  </div>
                  {member.position && (
                    <p className="text-xs text-muted-foreground pt-1">{member.position}</p>
                  )}
                </div>

                {member.bio && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-3 w-full">
                    {member.bio}
                  </p>
                )}

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
          <EmptyState
            title={t('membersPage.noMembers')}
            description={t('membersPage.noMembersDesc')}
          />
        )}

        {/* Join as Member CTA */}
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/5 via-amber-500/5 to-transparent p-8 md:p-12 text-center space-y-4">
          <HeartHandshake className="h-10 w-10 text-red-600 mx-auto" />
          <h3 className="font-heading text-2xl sm:text-3xl font-bold">
            {t('homeSections.ctaTitle')}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            {t('homeSections.ctaDesc')}
          </p>
          <div className="pt-2">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold" asChild>
              <Link href="/member/register">{t('homeSections.ctaButton')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
