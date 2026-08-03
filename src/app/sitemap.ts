import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.centrallaundyexpress.com',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: 'https://www.centrallaundyexpress.com/galeri',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
        {
      url: 'https://www.centrallaundyexpress.com/kontak',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: 'https://www.centrallaundyexpress.com/layanan',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: 'https://www.centrallaundyexpress.com/tentang',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },


    // Add more URLs as needed
  ]
}