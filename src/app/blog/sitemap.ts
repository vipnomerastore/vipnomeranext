import { MetadataRoute } from "next";

type Article = {
  id: number | null;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  media: {
    url: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
};

async function fetchAllArticles(): Promise<Article[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/statyas?populate=media&pagination[limit]=100`,
    {
      next: { revalidate: 3600 }, // 1 час
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.data || []).map((item: any): Article => {
    const mediaData = item.media?.data?.[0]?.attributes;
    return {
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || "",
      content: item.content || "",
      media: mediaData
        ? {
            url: mediaData.url,
            alt: mediaData.alternativeText || null,
            width: mediaData.width || null,
            height: mediaData.height || null,
          }
        : null,
      id: item.id || null,
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt || null,
      publishedAt: item.publishedAt || null,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vipnomerastore.ru";

  // Получаем все статьи
  const articles = await fetchAllArticles();

  // Создаём sitemap для статей блога
  const blogUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt
      ? new Date(article.updatedAt)
      : article.publishedAt
      ? new Date(article.publishedAt)
      : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Добавляем главную страницу блога
  const mainBlogUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...mainBlogUrls, ...blogUrls];
}
