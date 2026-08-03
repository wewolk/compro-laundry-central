import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Robots {
  return {
    rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/admin']
    },
    sitemap: 'https://www.centrallaundryexpress.com/sitemap.xml'
  }
}