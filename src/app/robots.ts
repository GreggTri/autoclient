import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/privacy', '/terms', '/register'],
    },
    sitemap: 'https://getautoclient.com/sitemap.xml',
  }
}