import { MetadataRoute } from "next";
// import { getAllNumbers } from '@/shared/api' // Ваша функция для получения номеров

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // SSR страницы (динамические, региональные, меняются часто)
  const dynamicPages: MetadataRoute.Sitemap = [
    {
      url: "https://vipnomerastore.ru",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://vipnomerastore.ru/credit",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://vipnomerastore.ru/partner",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://vipnomerastore.ru/redemption",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Клиентские страницы (интерактивные, средний приоритет)
  const clientPages: MetadataRoute.Sitemap = [
    {
      url: "https://vipnomerastore.ru/cart",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://vipnomerastore.ru/payment",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Статические страницы (SSG, меняются редко)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://vipnomerastore.ru/thank-you",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://vipnomerastore.ru/privacy-policy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://vipnomerastore.ru/terms-of-use",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // Динамические страницы номеров (если нужно)
  // try {
  //   const numbers = await getAllNumbers()
  //   const numberPages: MetadataRoute.Sitemap = numbers.map((number) => ({
  //     url: `https://vipnomerastore.ru/number/${number.id}`,
  //     lastModified: new Date(),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   }))
  //
  //   return [...dynamicPages, ...clientPages, ...staticPages, ...numberPages]
  // } catch (error) {
  //   console.error('Ошибка генерации sitemap:', error)
  //   return [...dynamicPages, ...clientPages, ...staticPages]
  // }

  return [...dynamicPages, ...clientPages, ...staticPages];
}
