'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bell, Users, Image as ImageIcon, Plus, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEvents, useNotices, useMembers, useGallery } from '@/hooks/use-queries';
import { useAuth } from '@/lib/auth-context';

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const { data: eventsData } = useEvents({ limit: 5 });
  const { data: noticesData } = useNotices({ limit: 5 });
  const { data: membersData } = useMembers({ limit: 5 });
  const { data: galleryData } = useGallery({ limit: 1 });

  const totalEvents = eventsData?.pagination?.total || 0;
  const totalNotices = noticesData?.pagination?.total || 0;
  const totalMembers = membersData?.pagination?.total || 0;
  const totalGallery = galleryData?.pagination?.total || 0;

  const recentEvents = eventsData?.data || [];
  const recentNotices = noticesData?.data || [];

  return (
    <AdminShell title="Dashboard Overview">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-transparent p-4 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading text-xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {profile?.fullName || 'Administrator'}!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage High School Youth Club events, notices, gallery media, members, and site content.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold h-9 text-xs">
              <Link href="/admin/events/new">
                <Plus className="mr-1.5 h-4 w-4" />
                New Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-9 text-xs">
              <Link href="/admin/notices/new">
                <Plus className="mr-1.5 h-4 w-4" />
                Post Notice
              </Link>
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCard
            label="Total Events"
            value={totalEvents}
            icon={Calendar}
            description="Cultural, sports & civic events"
          />
          <StatCard
            label="Active Notices"
            value={totalNotices}
            icon={Bell}
            description="Bulletins & announcements"
          />
          <StatCard
            label="Club Members"
            value={totalMembers}
            icon={Users}
            description="Executive & active members"
          />
          <StatCard
            label="Media Uploads"
            value={totalGallery}
            icon={ImageIcon}
            description="Photos & videos in gallery"
          />
        </div>

        {/* Recent Events & Notices Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <Card className="border border-border/60 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
                <CardDescription>Recently scheduled community activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-red-600">
                <Link href="/admin/events">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEvents.length > 0 ? (
                recentEvents.slice(0, 4).map((evt) => (
                  <div
                    key={evt._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40 text-xs gap-2"
                  >
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <p className="font-semibold text-foreground truncate">{evt.title}</p>
                      <p className="text-muted-foreground truncate">
                        {new Date(evt.date).toLocaleDateString()} • {evt.location}
                      </p>
                    </div>
                    <Badge variant={evt.published ? 'default' : 'secondary'} className="capitalize text-[10px] shrink-0">
                      {evt.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">No events created yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Bulletins */}
          <Card className="border border-border/60 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Recent Notices</CardTitle>
                <CardDescription>Community announcements & alerts</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-red-600">
                <Link href="/admin/notices">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotices.length > 0 ? (
                recentNotices.slice(0, 4).map((notice) => (
                  <div
                    key={notice._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40 text-xs gap-2"
                  >
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <p className="font-semibold text-foreground truncate">{notice.title}</p>
                      <p className="text-muted-foreground capitalize truncate">
                        {notice.category} • {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={notice.priority === 'urgent' ? 'destructive' : 'outline'}
                      className="capitalize text-[10px] shrink-0"
                    >
                      {notice.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">No notices published yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
