import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/query-provider';

// ─── Google Fonts ─────────────────────────────────────────────────────────
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// ─── Site Metadata ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'High School Youth Club — Gulariya, Krishnapur-5, Kanchanpur',
    template: '%s | High School Youth Club',
  },
  description:
    'High School Youth Club is a dedicated youth community organization in Gulariya, Krishnapur-5, Kanchanpur committed to youth empowerment, education, civic leadership, and cultural unity.',
  keywords: [
    'High School Youth Club',
    'Gulariya',
    'Krishnapur-5',
    'Kanchanpur',
    'Nepali youth club',
    'community organization',
    'Sudurpashchim Nepal',
    'youth club',
    'education',
    'sports',
    'social work',
  ],
  authors: [{ name: 'High School Youth Club' }],
  creator: 'High School Youth Club',
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_APP_URL'] || 'https://highschoolyouthclub.org'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'High School Youth Club',
    title: 'High School Youth Club — Gulariya, Krishnapur-5, Kanchanpur',
    description:
      'Youth empowerment, sports, culture, and community leadership in Gulariya, Krishnapur-5, Kanchanpur.',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'High School Youth Club Crest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High School Youth Club — Krishnapur-5, Kanchanpur',
    description: 'Youth Club Portal — Events, Notices, Gallery, Members & Outreach',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#9E1B1B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

// ─── Root Layout ──────────────────────────────────────────────────────────
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/lib/language-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-background text-foreground transition-colors duration-200 min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <QueryProvider>
              <AuthProvider>
                {children}
                <Toaster richColors position="top-right" />
              </AuthProvider>
            </QueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
