import styles from "./BlogArticle.module.scss";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Head from "next/head";

function getPlainTextFromContent(content: string | any[]): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (typeof block === "string") return block;
        if (
          block &&
          typeof block === "object" &&
          block.type === "paragraph" &&
          block.children
        ) {
          return block.children.map((ch: any) => ch.text || "").join("");
        }
        return "";
      })
      .join(" ")
      .trim();
  }
  return "";
}

type Article = {
  id: number | null;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  media: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
};

async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/statis?populate=*`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.data || []).map(
    (item: any): Article => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || "",
      content: item.content || "",
      media: item.media?.data?.[0]?.attributes?.url || null,
      id: item.id || null,
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt || null,
      publishedAt: item.publishedAt || null,
    })
  );
}

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const res = await fetch(
    `${baseUrl}/statis?filters[slug][$eq]=${slug}&populate=media`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;

  const data = await res.json();

  const item = data.data?.[0];
  if (!item) return null;
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || "",
    content: item.content || "",
    media: item.media?.data?.[0]?.attributes?.url || null,
    id: item.id || null,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    publishedAt: item.publishedAt || null,
  };
}

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return {};

  const plain = getPlainTextFromContent(article.content);

  // Используем excerpt если есть, иначе первые 160 символов из контента
  const description = article.excerpt
    ? article.excerpt.slice(0, 160)
    : plain.slice(0, 160);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  const imageUrl =
    article.media &&
    (article.media.startsWith("http")
      ? article.media
      : `${baseUrl}${article.media}`);

  return {
    title: article.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description,
      url: canonicalUrl,
      siteName: "Название сайта",
      type: "article",
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await fetchArticleBySlug(slug);

  if (!article) notFound();

  const plain = getPlainTextFromContent(article.content);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  // JSON-LD schema.org Article для SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ? article.excerpt : plain,
    image:
      article.media &&
      (article.media.startsWith("http")
        ? article.media
        : `${baseUrl}${article.media}`),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: "Автор статьи", // можно сделать динамическим
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, (k, v) =>
              v === undefined ? null : v
            ),
          }}
        />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>{article.title}</h1>

        {article.media && (
          <img
            src={
              article.media.startsWith("http")
                ? article.media
                : `${baseUrl}${article.media}`
            }
            alt={article.title}
            style={{ maxWidth: 600, width: "100%", marginBottom: 24 }}
          />
        )}

        {article.excerpt && (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            {article.excerpt}
          </p>
        )}

        <article className={styles.articleContent}>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      </div>
    </>
  );
}
