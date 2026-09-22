import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://highschoolyouthclub.org';

  const routes = [
    '',
    '/about',
    '/events',
    '/activities',
    '/gallery',
    '/notices',
    '/members',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/events' || route === '/notices' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
