import styles from "./BlogArticle.module.scss";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/entities/Blog/Breadcrumbs";
import RelatedArticles from "@/entities/Blog/RelatedArticles";
import ShareButtons from "@/entities/Blog/ShareButtons";

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
    `${process.env.NEXT_PUBLIC_SERVER_URL}/statyas?populate=*`,
    {
      next: { revalidate: 60 },
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

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const res = await fetch(
    `${baseUrl}/statyas?filters[slug][$eq]=${slug}&populate=media`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;

  const data = await res.json();

  const item = data.data?.[0];

  if (!item) return null;

  const mediaObj = Array.isArray(item.media) ? item.media[0] : item.media;

  return {
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

  const description = article.excerpt
    ? article.excerpt.slice(0, 160)
    : plain.slice(0, 160);

  const baseUrl = "https://vipnomerastore.ru";

  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  const imageUrl = article.media?.url
    ? article.media.url.startsWith("http")
      ? article.media.url
      : `${baseUrl}${article.media.url}`
    : null;

  return {
    title: `${article.title} | vipnomerastore`,
    description,
    alternates: { canonical: canonicalUrl },
    keywords: [
      ...article.title.split(" ").slice(0, 3), // Первые 3 слова заголовка
      "Купить красивый номер",
      "Красивый номер телефона",
      "Красивый мобильный номер",
      "Красивый номер",
      "Элитный номер",
      "Вип номер",
      "VIP номер",
      "Золотой номер",
      "Красивый локальный номер",
      "Красивый городской номер",
      "Красивый короткий номер",
      "Красивый номер МТС",
      "Красивый номер Билайн",
      "Красивый номер Мегафон",
      "Красивый номер Теле2",
      "Красивый номер Йота",
      "Красивый номер Т-банк",
      "Красивый номер Yota",
      "Красивый номер ВТБ",
      "Красивый номер СБЕР",
      "Уникальный номер",
      "Эксклюзивный номер",
    ].join(", "),
    openGraph: {
      title: article.title,
      description,
      url: canonicalUrl,
      siteName: "vipnomerastore",
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

  // Получаем связанные статьи
  const relatedArticles = await fetchArticles();

  const plain = getPlainTextFromContent(article.content);
  const baseUrl = "https://vipnomerastore.ru";
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  const imageUrl = article.media?.url
    ? article.media.url.startsWith("http")
      ? article.media.url
      : `${baseUrl}${article.media.url}`
    : null;

  // JSON-LD schema.org Article для SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || plain.slice(0, 160),
    image: imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Organization",
      name: "vipnomerastore",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "vipnomerastore",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/assets/logo/logo.svg`,
        width: 300,
        height: 100,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    wordCount: plain.split(" ").length,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      name: "vipnomerastore",
      url: baseUrl,
    },
  };

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Блог", href: "/blog" },
    { label: article.title },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd, (k, v) =>
            v === undefined ? null : v
          ),
        }}
      />

      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.articleMeta}>
          <div className={styles.articleTitleMeta}>Статья</div>{" "}
          <div className={styles.ellipsis}></div>{" "}
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </time>
          )}
        </div>

        <h1 className={styles.title}>{article.title}</h1>

        {article.media && (
          <div
            style={{
              position: "relative",
              width: "100%",
              minHeight: 300,
              marginBottom: 24,
            }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${article.media.url}`}
              alt={article.media.alt || article.title}
              fill
              style={{
                objectFit: "fill",
                borderRadius: 15,
                background: "#fff",
              }}
              sizes="100vw"
              priority
            />
          </div>
        )}

        {article.excerpt && (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            {article.excerpt}
          </p>
        )}

        <article className={styles.articleContent}>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        <ShareButtons
          url={canonicalUrl}
          title={article.title}
          description={article.excerpt || plain.slice(0, 160)}
        />

        <RelatedArticles
          currentSlug={article.slug}
          articles={relatedArticles}
          maxArticles={3}
        />
      </div>
    </>
  );
}
