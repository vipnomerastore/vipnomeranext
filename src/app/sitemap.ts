import type { MetadataRoute } from "next";

// Константы для URL-ов
const BASE_URL = "https://vipnomerastore.ru";
const regions = [
  // Основные региональные поддомены
  "msk",
  "spb",
  "nsk",
  "ekb",
  "nn",
  "kzn",
  "chel",
  "omsk",
  "smr",
  "rostov",
  "ufa",
  "krsk",
  "perm",
  "voronezh",
  "volgograd",
  "krasnodar",
  "saratov",
  "tyumen",
  "togliatti",
  "izhevsk",
  "barnaul",
  "ulyanovsk",
  "irkutsk",
  "habarovsk",
  "yaroslavl",
  "vladivostok",
  "mahachkala",
  "tomsk",
  "orenburg",
  "kemerovo",
  "ryazan",
  "astrakhan",
  "penza",
  "lipetsk",

  // Дополнительные региональные поддомены
  "sochi",
  "kaluga",
  "grozny",
  "stavropol",
  "sevastopol",
  "naberezhnye",
  "balashikha",
  "novokuznetsk",
  "cheboksary",
  "kaliningrad",
  "kirov",
  "tula",
  "ulanude",
  "kursk",
  "surgut",
  "tver",
  "magnitogorsk",
  "yakutsk",
  "bryansk",
  "ivanovo",
  "vladimir",
  "chita",
  "belgorod",
  "podolsk",
  "volzhsky",
  "vologda",
  "smolensk",
  "saransk",
  "kurgan",
  "cherepovets",
  "arkhangelsk",
  "vladikavkaz",
  "orel",
  "yoshkarola",
  "sterlitamak",
  "kostroma",
  "murmansk",
  "novorossiysk",
  "tambov",
  "taganrog",
  "blagoveshchensk",
  "vnovgorod",
  "shakhty",
  "syktyvkar",
  "pskov",
  "orsk",
  "khmao",
  "nazran",
  "derbent",
  "nizhnevartovsk",
  "noyabrsk",
  "gatchina",
  "kyzyl",
  "nalchik",
  "elista",
  "magadan",
  "kamchatka",
  "domodedovo",
  "khimki",
  "mytishchi",
  "lyubertsy",
  "hasavyurt",
  "kaspiysk",
  "kizlyar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // SSR страницы (динамические, региональные)
  const dynamicPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/credit`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partner`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/redemption`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  // Клиентские страницы
  const clientPages = [
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/payment`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Статические страницы (SSG)
  const staticPages = [
    {
      url: `${BASE_URL}/thank-you`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  // Генерируем региональные URL-ы (основные страницы для каждого региона)
  const regionalPages = regions.flatMap((region) => [
    // Главная страница региона
    {
      url: `https://${region}.vipnomerastore.ru`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Региональные версии основных страниц
    {
      url: `https://${region}.vipnomerastore.ru/credit`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `https://${region}.vipnomerastore.ru/partner`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `https://${region}.vipnomerastore.ru/redemption`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  return [...dynamicPages, ...clientPages, ...staticPages, ...regionalPages];
}
