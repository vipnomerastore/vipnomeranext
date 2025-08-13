import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vipnomerastore.ru";

  return {
    rules: [
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
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/blog/sitemap.xml`],
    host: baseUrl,
  };
}
