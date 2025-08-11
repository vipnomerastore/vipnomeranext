import Link from "next/link";

import styles from "./Blog.module.scss";

type Article = {
  id: number | null;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  media: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
};

async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/statis`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return data.data.map((item: any) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || "",
    content: item.content || "",
    media: item.media || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
  }));
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
      <h1>Блог</h1>

      <div className={styles.articles}>
        {articles.map((article) => (
          <article key={article.slug} className={styles.article}>
            <div className={styles.articleMeta}>
              Статья &gt;{" "}
              <span className={styles.articleTitleMeta}>{article.title}</span> |{" "}
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </time>
              )}
            </div>

            <Link
              href={`/blog/${article.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
              aria-label={`Перейти к статье ${article.title}`}
            >
              <h2 className={styles.articleTitle}>{article.title}</h2>

              {article.excerpt ? (
                <p className={styles.articleExcerpt}>{article.excerpt}</p>
              ) : (
                article.content && (
                  <p className={styles.articleExcerpt}>
                    {getContentPreviewMarkdown(article.content)}
                  </p>
                )
              )}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
