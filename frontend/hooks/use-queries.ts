'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, fetchApi, postApi, patchApi, deleteApi } from '@/lib/api-client';
import type {
  Event,
  Notice,
  Gallery,
  Activity,
  Achievement,
  Member,
  SiteContent,
  SiteSettings,
  ContactMessage,
  UserProfile,
  PublicStats,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────
export const queryKeys = {
  events: (params?: Record<string, any>) => ['events', params] as const,
  event: (idOrSlug: string) => ['event', idOrSlug] as const,
  notices: (params?: Record<string, any>) => ['notices', params] as const,
  notice: (idOrSlug: string) => ['notice', idOrSlug] as const,
  gallery: (params?: Record<string, any>) => ['gallery', params] as const,
  activities: (params?: Record<string, any>) => ['activities', params] as const,
  activity: (idOrSlug: string) => ['activity', idOrSlug] as const,
  achievements: (params?: Record<string, any>) => ['achievements', params] as const,
  members: (params?: Record<string, any>) => ['members', params] as const,
  siteContent: (section?: string) => ['site-content', section] as const,
  siteSettings: () => ['site-settings'] as const,
  publicStats: () => ['public-stats'] as const,
  contacts: (params?: Record<string, any>) => ['contacts', params] as const,
  users: (params?: Record<string, any>) => ['users', params] as const,
};

// ─── Events Hooks ─────────────────────────────────────────────────────────
export function useEvents(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.events(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<Event>>('/events', { params });
      return res.data;
    },
  });
}

export function useEvent(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.event(idOrSlug),
    queryFn: async () => {
      // Try slug first, or by id
      try {
        return await fetchApi<Event>(`/events/slug/${idOrSlug}`);
      } catch {
        return await fetchApi<Event>(`/events/${idOrSlug}`);
      }
    },
    enabled: !!idOrSlug,
  });
}export function useMyRegisteredEvents(enabled = true) {
  return useQuery({
    queryKey: ['user-events'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Event[]>>('/events/user/my-events');
      return res.data.data || [];
    },
    enabled,
  });
}

// ─── Notices Hooks ────────────────────────────────────────────────────────
export function useNotices(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.notices(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<Notice>>('/notices', { params });
      return res.data;
    },
  });
}

export function useNotice(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.notice(idOrSlug),
    queryFn: async () => {
      try {
        return await fetchApi<Notice>(`/notices/slug/${idOrSlug}`);
      } catch {
        return await fetchApi<Notice>(`/notices/${idOrSlug}`);
      }
    },
    enabled: !!idOrSlug,
  });
}

// ─── Gallery Hooks ────────────────────────────────────────────────────────
export function useGallery(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.gallery(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<Gallery>>('/gallery', { params });
      return res.data;
    },
  });
}

// ─── Activities Hooks ─────────────────────────────────────────────────────
export function useActivities(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.activities(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<Activity>>('/activities', { params });
      return res.data;
    },
  });
}

export function useActivity(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.activity(idOrSlug),
    queryFn: async () => {
      try {
        return await fetchApi<Activity>(`/activities/slug/${idOrSlug}`);
      } catch {
        return await fetchApi<Activity>(`/activities/${idOrSlug}`);
      }
    },
    enabled: !!idOrSlug,
  });
}

// ─── Achievements Hooks ───────────────────────────────────────────────────
export function useAchievements(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.achievements(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<Achievement>>('/achievements', { params });
      return res.data;
    },
  });
}

// ─── Members Hooks ────────────────────────────────────────────────────────
export function useMembers(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.members(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiPaginatedResponse<Member>>('/members', { params });
      return res.data;
    },
  });
}

// ─── Site Content Hooks ───────────────────────────────────────────────────
export function useSiteContent(section?: string) {
  return useQuery({
    queryKey: queryKeys.siteContent(section),
    queryFn: async () => {
      if (section) {
        return await fetchApi<SiteContent>(`/content/${section}`);
      }
      return await fetchApi<SiteContent[]>('/content');
    },
  });
}

// ─── Site Settings Hooks ──────────────────────────────────────────────────
export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.siteSettings(),
    queryFn: async () => {
      return await fetchApi<SiteSettings>('/settings');
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Contact Form Mutation ────────────────────────────────────────────────
export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }) => {
      return await postApi('/contact', data);
    },
  });
}

// ─── Public Dynamic Statistics Hook ───────────────────────────────────────
export function usePublicStats() {
  return useQuery({
    queryKey: queryKeys.publicStats(),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PublicStats>>('/content/stats');
      return res.data.data;
    },
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
  });
}

