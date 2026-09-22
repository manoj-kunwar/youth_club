'use client';

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/use-queries';
import { apiClient } from '@/lib/api-client';
import type { SiteSettings } from '@/types';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [clubName, setClubName] = useState('High School Youth Club');
  const [clubNepaliName, setClubNepaliName] = useState('हाई स्कुल युवा क्लब');
  const [registrationNumber, setRegistrationNumber] = useState('HSYC-KP5-2080');
  const [establishedYear, setEstablishedYear] = useState('2020');
  const [address, setAddress] = useState('Gulariya, Krishnapur-5, Kanchanpur, Nepal');
  const [primaryPhone, setPrimaryPhone] = useState('+977 98XXXXXXXX');
  const [secondaryPhone, setSecondaryPhone] = useState('+977 91 XXXXXX');
  const [primaryEmail, setPrimaryEmail] = useState('contact@highschoolyouthclub.org');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/highschoolyouthclub');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/highschoolyouthclub');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [allowPublicRegistration, setAllowPublicRegistration] = useState(true);

  const { data: settings, isLoading } = useSiteSettings();

  useEffect(() => {
    if (settings) {
      if (settings.orgName) setClubName(settings.orgName);
      if (settings.contactEmail) setPrimaryEmail(settings.contactEmail);
      if (settings.contactPhone) setPrimaryPhone(settings.contactPhone);
      if (settings.address) setAddress(settings.address);
      if (settings.socialLinks?.facebook) setFacebookUrl(settings.socialLinks.facebook);
      if (settings.socialLinks?.instagram) setInstagramUrl(settings.socialLinks.instagram);
      if (settings.socialLinks?.youtube) setYoutubeUrl(settings.socialLinks.youtube);
      if (settings.socialLinks?.tiktok) setTiktokUrl(settings.socialLinks.tiktok);
      if (settings.socialLinks?.whatsapp) setWhatsappNumber(settings.socialLinks.whatsapp);
      if (settings.portalConfig) {
        const pc = settings.portalConfig as Record<string, any>;
        if (pc['registrationNumber']) setRegistrationNumber(pc['registrationNumber']);
        if (pc['clubNepaliName']) setClubNepaliName(pc['clubNepaliName']);
        if (pc['establishedYear']) setEstablishedYear(String(pc['establishedYear']));
        if (typeof pc['allowPublicRegistration'] === 'boolean') {
          setAllowPublicRegistration(pc['allowPublicRegistration']);
        }
        if (pc['secondaryPhone']) setSecondaryPhone(pc['secondaryPhone']);
      }
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.put('/settings', {
        orgName: clubName,
        contactEmail: primaryEmail,
        contactPhone: primaryPhone,
        address,
        socialLinks: {
          ...settings?.socialLinks,
          facebook: facebookUrl || undefined,
          instagram: instagramUrl || undefined,
          youtube: youtubeUrl || undefined,
          tiktok: tiktokUrl || undefined,
          whatsapp: whatsappNumber || undefined,
        },
        portalConfig: {
          clubNepaliName,
          registrationNumber,
          establishedYear: parseInt(establishedYear, 10) || 2020,
          allowPublicRegistration,
          secondaryPhone,
        },
      });

      toast.success('Site settings saved successfully!');
      await queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      await queryClient.refetchQueries({ queryKey: ['site-settings'] });
    } catch (err: any) {
      toast.error('Failed to update settings', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell title="Community Settings">
      <div className="space-y-6 max-w-4xl">
        <div className="bg-card p-4 rounded-xl border border-border/60">
          <h2 className="font-semibold text-sm">Organization Identity & Portal Configuration</h2>
          <p className="text-xs text-muted-foreground">
            Configure legal registration details, community contact numbers, social media links, and membership controls.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* General Identity Card */}
            <Card className="border border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">General Organization Profile</CardTitle>
                <CardDescription>Primary legal and public identity credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="set-name">Club Name (English)</Label>
                    <Input
                      id="set-name"
                      required
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="set-nep-name">Club Name (Nepali)</Label>
                    <Input
                      id="set-nep-name"
                      value={clubNepaliName}
                      onChange={(e) => setClubNepaliName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="set-reg">Govt. Registration Number</Label>
                    <Input
                      id="set-reg"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="set-year">Established Year (A.D.)</Label>
                    <Input
                      id="set-year"
                      value={establishedYear}
                      onChange={(e) => setEstablishedYear(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="set-addr">Physical Address</Label>
                  <Input
                    id="set-addr"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Communication & Socials Card */}
            <Card className="border border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Contact & Social Channels</CardTitle>
                <CardDescription>Displayed on public website footer and contact page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="set-phone">Primary Phone</Label>
                    <Input
                      id="set-phone"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="set-phone-2">Helpline / Mobile</Label>
                    <Input
                      id="set-phone-2"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="set-email">Official Email</Label>
                  <Input
                    id="set-email"
                    type="email"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="set-fb">Facebook URL</Label>
                    <Input
                      id="set-fb"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="set-insta">Instagram URL</Label>
                    <Input
                      id="set-insta"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="set-yt">YouTube Channel URL</Label>
                    <Input
                      id="set-yt"
                      placeholder="https://youtube.com/@highschoolyouthclub"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="set-tiktok">TikTok URL</Label>
                    <Input
                      id="set-tiktok"
                      placeholder="https://tiktok.com/@hsyc172"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="set-whatsapp">WhatsApp Number</Label>
                  <Input
                    id="set-whatsapp"
                    placeholder="+977 98XXXXXXXX or 98XXXXXXXX"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Portal Controls */}
            <Card className="border border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Portal Access Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="set-reg-open" className="text-sm font-semibold">
                      Allow Public Member Registration
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable new volunteers and community members to register accounts online.
                    </p>
                  </div>
                  <Switch
                    id="set-reg-open"
                    checked={allowPublicRegistration}
                    onCheckedChange={setAllowPublicRegistration}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Settings...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
