"use client";

import Link from "next/link";
import Image from "next/image";

import PaginationClient from "@/entities/Blog/PaginationClient";

import styles from "../../app/blog/Blog.module.scss";

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

function getContentPreviewMarkdown(content: string, maxLen = 120) {
  if (!content) return null;

  const trimmed = content.trim().replace(/\n/g, " ");

  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) + "..." : trimmed;
}

interface BlogListClientProps {
  articles: Article[];
  page: number;
  totalPages: number;
}

export default function BlogListClient(props: BlogListClientProps) {
  const { articles, page, totalPages } = props;

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);

    return readTime;
  };

  return (
    <>
      <div className={styles.articles}>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
            aria-label={`Перейти к статье ${article.title}`}
          >
            <article className={styles.article}>
              {article.media && (
                <div className={styles.imageContainer}>
                  <Image
                    src={
                      article.media.url.startsWith("http")
                        ? article.media.url
                        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${article.media.url}`
                    }
                    alt={article.media.alt || article.title}
                    width={400}
                    height={200}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                    }}
                  />
                </div>
              )}

              <div className={styles.content}>
                <h2 className={styles.articleTitle}>{article.title}</h2>

                <p className={styles.articleExcerpt}>
                  {getContentPreviewMarkdown(article.excerpt)}
                </p>

                <div className={styles.articleMeta}>
                  <div className={styles.articleTitleMeta}>
                    {article.publishedAt && (
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString(
                          "ru-RU"
                        )}
                      </time>
                    )}
                  </div>

                  <div className={styles.readTime}>
                    {calculateReadTime(article.content)} мин чтения
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <PaginationClient page={page} count={totalPages} />
        </div>
      )}
    </>
  );
}
