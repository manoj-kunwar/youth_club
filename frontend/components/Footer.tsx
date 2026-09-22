'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useSiteSettings } from '@/hooks/use-queries';

// ─── Social Media Icons ──────────────────────────────────────────────────────

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.031 2C6.495 2 2 6.493 2 12.029c0 1.96.565 3.791 1.545 5.342L2.09 22l4.805-1.428a9.99 9.99 0 0 0 5.136 1.458c5.535 0 10.03-4.494 10.03-10.03C22.061 6.494 17.566 2 12.031 2zm5.728 14.154c-.24.672-1.396 1.285-1.922 1.368-.504.079-1.157.112-3.666-.928-3.08-1.278-5.06-4.41-5.215-4.613-.153-.203-1.238-1.649-1.238-3.146 0-1.498.784-2.235 1.062-2.54.278-.305.607-.381.81-.381.202 0 .405.002.582.01.188.009.438-.071.684.522.254.61.861 2.102.937 2.255.076.152.127.33.025.533-.102.203-.153.33-.304.508-.152.177-.32.395-.457.53-.152.152-.31.317-.133.621.177.304.786 1.294 1.687 2.097 1.158 1.033 2.136 1.353 2.44 1.505.304.153.482.127.66-.076.177-.203.76-.888.963-1.192.202-.304.405-.254.683-.152.279.102 1.773.836 2.077.989.304.152.507.228.583.355.076.127.076.736-.164 1.408z" />
    </svg>
  );
}

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function YouTubeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 9.162v5.676L15.194 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Footer() {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();

  // Contact info priority: real backend settings -> translations
  const contactPhone = settings?.contactPhone || '9748886690';
  const displayPhone = settings?.contactPhone || '+977 9748886690';
  const helplinePhone = settings?.portalConfig?.secondaryPhone as string | undefined;
  const contactEmail = settings?.contactEmail || 'hsyc172@gmail.com';
  const contactAddress = settings?.address || t('footer.address');

  // Real Social Links
  const facebookUrl = settings?.socialLinks?.facebook || 'https://www.facebook.com/share/1EKK6u46Qd/';
  const whatsappSetting = settings?.socialLinks?.whatsapp;
  const whatsappClean = whatsappSetting
    ? whatsappSetting.replace(/^https?:\/\/wa\.me\//, '').replace(/\D/g, '')
    : contactPhone.replace(/\D/g, '');
  const whatsappUrl = whatsappSetting
    ? (whatsappSetting.startsWith('http') ? whatsappSetting : `https://wa.me/${whatsappClean}`)
    : `https://wa.me/${whatsappClean}`;
  const whatsappDisplay = whatsappSetting || displayPhone;
  const tiktokUrl = settings?.socialLinks?.tiktok || 'https://www.tiktok.com/@hsyc172';
  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/hsyc172';
  const youtubeUrl = settings?.socialLinks?.youtube || 'https://www.youtube.com/@hsyc172';

  const exploreLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/activities', label: t('nav.activities') },
    { href: '/events', label: t('nav.events') },
    { href: '/members', label: t('nav.members') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/notices', label: t('nav.notices') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="border-t border-border/60 bg-card text-card-foreground transition-colors duration-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Row 1: All five sections in one horizontal row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-8">
          
          {/* Col 1: Logo / About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-red-600/30 shadow-md bg-white">
                <Image
                  src="/logo.png"
                  alt="High School Youth Club Crest"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-base leading-tight tracking-tight">
                  {t('common.siteName')}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {t('common.siteAddress')}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>

            {/* Official Social Media Channels */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-2">
                Official Channels
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="High School Youth Club Facebook Page"
                  title="Facebook"
                >
                  <FacebookIcon className="h-3.5 w-3.5" />
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="High School Youth Club WhatsApp Direct"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                </a>

                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="High School Youth Club Instagram Profile"
                  title="Instagram"
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                </a>

                {/* YouTube */}
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="High School Youth Club YouTube Channel"
                  title="YouTube"
                >
                  <YouTubeIcon className="h-3.5 w-3.5" />
                </a>

                {/* TikTok */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="High School Youth Club TikTok"
                  title="TikTok"
                >
                  <TikTokIcon className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm sm:text-base tracking-tight text-foreground">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {exploreLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Get Involved */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm sm:text-base tracking-tight text-foreground">
              {t('footer.getInvolved')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/member/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.joinVolunteer')}
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.executiveTeam')}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('homeSections.eventsTitle')}
                </Link>
              </li>
              <li>
                <Link href="/notices" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('homeSections.noticesTitle')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.communityPartners')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community Office */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm sm:text-base tracking-tight text-foreground">
              {t('footer.communityOffice')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug text-xs">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="hover:text-foreground transition-colors font-medium hover:underline text-xs"
                >
                  {displayPhone}
                </a>
              </li>
              {helplinePhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <a
                    href={`tel:${helplinePhone.replace(/\s+/g, '')}`}
                    className="hover:text-foreground transition-colors font-medium hover:underline text-xs"
                  >
                    {helplinePhone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-foreground transition-colors font-medium hover:underline break-all text-xs"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>

            {/* Quick WhatsApp Action Button */}
            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center items-center gap-2 px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[38px] text-center"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 5: Legal */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm sm:text-base tracking-tight text-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Terms & Conditions</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 2: Centered Copyright Only */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>© 2026 High School Youth Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
