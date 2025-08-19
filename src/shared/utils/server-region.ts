/**
 * Серверные утилиты для работы с регионами
 * Используются в middleware и Server Components
 */

export function getSubdomainFromHost(host: string): string | null {
  if (!host) return null;

  const parts = host.split(".");
  if (parts.length < 3) return null; // нет поддомена

  const subdomain = parts[0];
  if (subdomain === "www") return null;

  return subdomain;
}

export const SUPPORTED_REGIONS = [
  // Основные и алиасы
  "moskva",
  "msk",
  "spb",
  "novosibirsk",
  "nsk",
  "ekaterinburg",
  "ekb",
  "nnovgorod",
  "nn",
  "kazan",
  "kzn",
  "chelyabinsk",
  "chel",
  "omsk",
  "samara",
  "smr",
  "rostov",
  "ufa",
  "krasnoyarsk",
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
  "khabarovsk",
  "habarovsk",
  "yaroslavl",
  "vladivostok",
  "makhachkala",
  "mahachkala",
  "tomsk",
  "orenburg",
  "kemerovo",
  "ryazan",
  "astrakhan",
  "penza",
  "lipetsk",
  // Дополнительные поддомены
  "sochi",
  "kaluga",
  "grozny",
  "stavropol",
  "sevastopol",
  "nabchelny",
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
  "khantymansiysk",
  "khmao",
  "nazran",
  "derbent",
  "nizhnevartovsk",
  "novyurengoy",
  "noyabrsk",
  "gatchina",
  "kyzyl",
  "nalchik",
  "elista",
  "magadan",
  "pkamchatsky",
  "kamchatka",
  "domodedovo",
  "khimki",
  "mytishchi",
  "lyubertsy",
  "hasavyurt",
  "kaspiysk",
  "kizlyar",
];

export function isValidRegion(region: string): boolean {
  return SUPPORTED_REGIONS.includes(region);
}

export function getRegionFromRequest(
  host: string,
  cookie?: string
): string | null {
  // Приоритет: cookie -> поддомен
  if (cookie && isValidRegion(cookie)) {
    return cookie;
  }

  const subdomain = getSubdomainFromHost(host);
  if (subdomain && isValidRegion(subdomain)) {
    return subdomain;
  }

  return null;
}
