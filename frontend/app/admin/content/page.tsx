'use client';

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, Sparkles } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { toast } from 'sonner';
import { useSiteContent } from '@/hooks/use-queries';
import { apiClient } from '@/lib/api-client';
import type { SiteContent, SiteContentSection } from '@/types';

export default function AdminContentPage() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<SiteContentSection>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { data: sectionData, isLoading } = useSiteContent(activeSection);

  useEffect(() => {
    if (sectionData && !Array.isArray(sectionData) && sectionData.contentPayload) {
      const p = sectionData.contentPayload as Record<string, any>;
      setTitle(p['title'] || '');
      setSubtitle(p['subtitle'] || '');
      setContent(p['content'] || '');
      setImageUrl(p['imageUrl'] || '');
      if (p['ctaButton']) {
        setCtaText(p['ctaButton'].text || '');
        setCtaLink(p['ctaButton'].link || '');
      }
    } else {
      // Default fallback
      if (activeSection === 'hero') {
        setTitle('Empowering Nepali Youth. Transforming Communities.');
        setSubtitle('A grassroots youth community dedicated to social welfare, cultural preservation, and environmental protection.');
        setContent('');
        setCtaText('Explore Events');
        setCtaLink('/events');
        setImageUrl('');
      } else if (activeSection === 'about') {
        setTitle('Building Community From the Ground Up');
        setSubtitle('High School Youth Club was founded in Gulariya, Krishnapur-5, Kanchanpur to empower youth through education, sports, and leadership.');
        setContent('');
      }
    }
  }, [sectionData, activeSection]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.put(`/content/${activeSection}`, {
        sectionKey: activeSection,
        contentPayload: {
          title,
          subtitle: subtitle || undefined,
          content: content || undefined,
          imageUrl: imageUrl || undefined,
          ctaButton: ctaText ? { text: ctaText, link: ctaLink || '#' } : undefined,
        },
      });

      toast.success(`${activeSection.toUpperCase()} content updated!`);
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
    } catch (err: any) {
      toast.error('Failed to update content', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell title="Site Content CMS">
      <div className="space-y-6">
        <div className="bg-card p-4 rounded-xl border border-border/60">
          <h2 className="font-heading font-bold text-base">Homepage & Public Section Customizer</h2>
          <p className="text-xs text-muted-foreground">
            Update headlines, copy, call-to-action buttons, and banner images without code changes.
          </p>
        </div>

        <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as SiteContentSection)}>
          <TabsList className="grid grid-cols-5 w-full max-w-xl">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <div className="pt-6">
            <Card className="border border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="capitalize text-xl font-bold">
                  {activeSection} Section
                </CardTitle>
                <CardDescription>
                  Modify the display copy and assets for the {activeSection} segment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sec-title">Section Heading *</Label>
                      <Input
                        id="sec-title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Main headline"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sec-sub">Subtitle / Tagline</Label>
                      <Input
                        id="sec-sub"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Supporting subtext"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sec-content">Main Body Text</Label>
                      <Textarea
                        id="sec-content"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Detailed copy or descriptive paragraph..."
                      />
                    </div>

                    {activeSection === 'hero' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="cta-txt">Button Label</Label>
                          <Input
                            id="cta-txt"
                            value={ctaText}
                            onChange={(e) => setCtaText(e.target.value)}
                            placeholder="e.g. Explore Events"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cta-lnk">Button Link</Label>
                          <Input
                            id="cta-lnk"
                            value={ctaLink}
                            onChange={(e) => setCtaLink(e.target.value)}
                            placeholder="e.g. /events"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      <Label>Section Image / Banner</Label>
                      <ImageUploader
                        value={imageUrl}
                        onChange={(res) => setImageUrl(res?.mediaUrl || '')}
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save {activeSection.toUpperCase()} Section
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </AdminShell>
  );
}
