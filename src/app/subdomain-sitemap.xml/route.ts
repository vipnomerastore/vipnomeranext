import { NextRequest } from "next/server";

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

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");

  if (!host) {
    return new Response("Host header is required", { status: 400 });
  }

  // Определяем поддомен
  const subdomain = host.split(".")[0];

  // Проверяем, что это валидный региональный поддомен
  if (!regions.includes(subdomain)) {
    return new Response("Invalid subdomain", { status: 404 });
  }

  const baseUrl = `https://${host}`;
  const lastModified = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/credit</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/partner</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/redemption</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms-of-use</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
