import Link from "next/link";

import styles from "./Blog.module.scss";
import Image from "next/image";

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

async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/statis?populate=media`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data.data.map((item: any) => {
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
}

function getContentPreviewMarkdown(content: string, maxLen = 120) {
  if (!content) return null;

  const trimmed = content.trim().replace(/\n/g, " ");

  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) + "..." : trimmed;
}

// SEO метаданные страницы блога
export const metadata = {
  title: "Блог — vipnomerastore",
  description: "Читайте наши последние статьи и новости в блоге.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await fetchArticles();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Статьи</h1>

        <search></search>
      </div>

      <div className={styles.articles}>
        {articles.map((article) => (
          <article key={article.slug} className={styles.article}>
            <div className={styles.articleMeta}>
              <div className={styles.articleTitleMeta}>Статьи</div>{" "}
              <div className={styles.ellipsis}></div>{" "}
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </time>
              )}
            </div>

            <Link
              href={`/blog/${article.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              aria-label={`Перейти к статье ${article.title}`}
            >
              <h2 className={styles.articleTitle}>{article.title}</h2>

              <p className={styles.articleExcerpt}>
                {getContentPreviewMarkdown(article.excerpt)}
              </p>

              {article.media && (
                <Image
                  src={
                    article.media.url.startsWith("http")
                      ? article.media.url
                      : `${process.env.NEXT_PUBLIC_MEDIA_URL}${article.media.url}`
                  }
                  alt={article.media.alt || article.title}
                  width={article.media.width || undefined}
                  height={article.media.height || undefined}
                  style={{
                    maxWidth: 360,
                    width: "100%",
                    marginBottom: 16,
                    maxHeight: 240,
                    borderRadius: 15,
                  }}
                />
              )}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
