import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host");

  // Определяем базовый URL в зависимости от домена
  const baseUrl = host ? `https://${host}` : "https://vipnomerastore.ru";

  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/cart",
        "/payment/",
        "/thank-you/",
        "/*?*",
        "/private/",
      ],
    },
    {
      userAgent: ["Googlebot", "Bingbot", "Slurp", "YandexBot"],
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/cart",
        "/payment/",
        "/thank-you/",
        "/privacy-policy/",
        "/terms-of-use/",
      ],
    },
  ];

  // Для поддоменов указываем их собственные sitemap
  const sitemap =
    host && !host.startsWith("vipnomerastore.ru")
      ? [`${baseUrl}/sitemap.xml`]
      : [`${baseUrl}/sitemap.xml`, `${baseUrl}/blog/sitemap.xml`];

  return {
    rules,
    sitemap,
    host: baseUrl,
  };
}
