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

  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cart
Disallow: /payment/
Disallow: /thank-you/
Disallow: /*?*
Disallow: /private/

User-agent: Googlebot
User-agent: Bingbot  
User-agent: Slurp
User-agent: YandexBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cart
Disallow: /payment/
Disallow: /thank-you/
Disallow: /privacy-policy/
Disallow: /terms-of-use/

Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}`;

  return new Response(robots, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
