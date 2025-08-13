import type { MetadataRoute } from "next";
import { headers } from "next/headers";

// Функция для получения текущего поддомена
async function getCurrentSubdomain(): Promise<string | null> {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return null;

  const subdomain = host.split(".")[0];
  return subdomain !== "vipnomerastore" ? subdomain : null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const subdomain = await getCurrentSubdomain();

  // Если это основной домен, возвращаем пустой sitemap (основной sitemap в корне)
  if (!subdomain) {
    return [];
  }

  const BASE_URL = `https://${subdomain}.vipnomerastore.ru`;

  // Страницы для конкретного поддомена
  const subdomainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/credit`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partner`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/redemption`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  return subdomainPages;
}
