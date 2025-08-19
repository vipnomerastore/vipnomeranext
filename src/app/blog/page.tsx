import { redirect } from "next/navigation";

import BlogListClient from "@/entities/Blog/BlogListClient";

import styles from "./Blog.module.scss";

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

const PAGE_SIZE = 8;

async function fetchArticles(
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; total: number }> {
  const start = (page - 1) * pageSize;

  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/statyas?populate=media&pagination[start]=${start}&pagination[limit]=${pageSize}&sort=publishedAt:desc`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) return { articles: [], total: 0 };

  const data = await res.json();

  const total = data.meta?.pagination?.total || 0;

  const articles = (data.data || []).map((item: any) => {
    const mediaObj = Array.isArray(item.media) ? item.media[0] : item.media;

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || "",
      content: item.content || "",
      media:
        mediaObj && mediaObj.url
          ? {
              url: mediaObj.url,
              alt: mediaObj.alternativeText || null,
              width: mediaObj.width || null,
              height: mediaObj.height || null,
            }
          : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
    };
  });

  return { articles, total };
}

function getContentPreviewMarkdown(content: string, maxLen = 120) {
  if (!content) return null;

  const trimmed = content.trim().replace(/\n/g, " ");

  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) + "..." : trimmed;
}

// SEO метаданные страницы блога
export const metadata = {
  title: "Блог о номерах | vipnomerastore",
  description:
    "Последние статьи и новости о номерах, виртуальных номерах, мтс, мегафон, йота, теле 2, билайн. Полезные советы и инструкции.",
  keywords: [
    "блог",
    "виртуальные номера",
    "мтс теле 2",
    "мегафон йота",
    "билайн",
    "номера телефона",
    "красивые номера телефона",
    "купить номера телефона",
  ],
  alternates: { canonical: "https://vipnomerastore.ru/blog" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Блог о номерах телефона | vipnomerastore",
    description:
      "Последние статьи и новости о номерах телефона, виртуальных номерах, мтс, мегафон, билайн, теле 2, йота.",
    url: "https://vipnomerastore.ru/blog",
    type: "website",
    siteName: "vipnomerastore",
    locale: "ru_RU",
    images: [
      {
        url: "https://vipnomerastore.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "vipnomerastore блог о номерах телефона",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог о номерах телефона | vipnomerastore",
    description:
      "Последние статьи и новости о номерах телефона, виртуальных номерах, мтс, мегафон, билайн, теле 2, йота.",
    images: ["https://vipnomerastore.ru/og-image.jpg"],
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  // Ожидаем searchParams в Next.js 15
  const resolvedSearchParams = await searchParams;
  const page =
    Number(resolvedSearchParams?.page) > 0
      ? Number(resolvedSearchParams?.page)
      : 1;

  const { articles, total } = await fetchArticles(page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Если пользователь ввёл несуществующую страницу — редирект на первую
  if (totalPages > 0 && page > totalPages) {
    redirect("/blog");
  }

  // JSON-LD для списка статей
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://vipnomerastore.ru/blog",
    name: "Блог vipnomerastore",
    description: "Последние статьи о номерах телефона и виртуальных номерах",
    url: "https://vipnomerastore.ru/blog",
    publisher: {
      "@type": "Organization",
      name: "vipnomerastore",
      logo: "https://vipnomerastore.ru/logo.svg",
    },
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      "@id": `https://vipnomerastore.ru/blog/${article.slug}`,
      headline: article.title,
      description: article.excerpt || "",
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      url: `https://vipnomerastore.ru/blog/${article.slug}`,
    })),
  };

  return (
    <main className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Статьи</h1>
      </div>

      <BlogListClient articles={articles} page={page} totalPages={totalPages} />
    </main>
  );
}
