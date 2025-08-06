import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vipnomerastore.store";

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
        userAgent: ["Googlebot", "Bingbot", "Slurp"],
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
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
