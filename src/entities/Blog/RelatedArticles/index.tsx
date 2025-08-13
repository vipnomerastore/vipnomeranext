"use client";

import Link from "next/link";

import styles from "./RelatedArticles.module.scss";

interface Article {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt: string | null;
}

interface RelatedArticlesProps {
  currentSlug: string;
  articles: Article[];
  maxArticles?: number;
}

export default function RelatedArticles({
  currentSlug,
  articles,
  maxArticles = 3,
}: RelatedArticlesProps) {
  const relatedArticles = articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, maxArticles);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Читайте также</h3>

      <div className={styles.articles}>
        {relatedArticles.map((article) => (
          <article key={article.slug} className={styles.article}>
            <Link href={`/blog/${article.slug}`} className={styles.link}>
              <h4 className={styles.articleTitle}>{article.title}</h4>

              {article.excerpt && (
                <p className={styles.excerpt}>{article.excerpt}</p>
              )}

              {article.publishedAt && (
                <time dateTime={article.publishedAt} className={styles.date}>
                  {new Date(article.publishedAt).toLocaleDateString("ru-RU")}
                </time>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
