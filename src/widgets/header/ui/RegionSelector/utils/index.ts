// Поддомены → Slug
export const subdomainToSlug: Record<string, string> = {
  msk: "moskva",
  spb: "spb",
  nsk: "novosibirsk",
  ekb: "ekaterinburg",
  nn: "nnovgorod",
  kzn: "kazan",
  chel: "chelyabinsk",
  omsk: "omsk",
  smr: "samara",
  rostov: "rostov",
  ufa: "ufa",
  krsk: "krasnoyarsk",
  perm: "perm",
  voronezh: "voronezh",
  volgograd: "volgograd",
  krasnodar: "krasnodar",
  saratov: "saratov",
  tyumen: "tyumen",
  togliatti: "togliatti",
  izhevsk: "izhevsk",
  barnaul: "barnaul",
  ulyanovsk: "ulyanovsk",
  irkutsk: "irkutsk",
  habarovsk: "khabarovsk",
  yaroslavl: "yaroslavl",
  vladivostok: "vladivostok",
  mahachkala: "makhachkala",
  tomsk: "tomsk",
  orenburg: "orenburg",
  kemerovo: "kemerovo",
  ryazan: "ryazan",
  astrakhan: "astrakhan",
  penza: "penza",
  lipetsk: "lipetsk",
  sochi: "sochi",
  kaluga: "kaluga",
  grozny: "grozny",
  stavropol: "stavropol",
  sevastopol: "sevastopol",
  naberezhnye: "nabchelny",
  balashikha: "balashikha",
  novokuznetsk: "novokuznetsk",
  cheboksary: "cheboksary",
  kaliningrad: "kaliningrad",
  kirov: "kirov",
  tula: "tula",
  ulanude: "ulanude",
  kursk: "kursk",
  surgut: "surgut",
  tver: "tver",
  magnitogorsk: "magnitogorsk",
  yakutsk: "yakutsk",
  bryansk: "bryansk",
  ivanovo: "ivanovo",
  vladimir: "vladimir",
  chita: "chita",
  belgorod: "belgorod",
  podolsk: "podolsk",
  volzhsky: "volzhsky",
  vologda: "vologda",
  smolensk: "smolensk",
  saransk: "saransk",
  kurgan: "kurgan",
  cherepovets: "cherepovets",
  arkhangelsk: "arkhangelsk",
  vladikavkaz: "vladikavkaz",
  orel: "orel",
  yoshkarola: "yoshkarola",
  sterlitamak: "sterlitamak",
  kostroma: "kostroma",
  murmansk: "murmansk",
  novorossiysk: "novorossiysk",
  tambov: "tambov",
  taganrog: "taganrog",
  blagoveshchensk: "blagoveshchensk",
  vnovgorod: "vnovgorod",
  shakhty: "shakhty",
  syktyvkar: "syktyvkar",
  pskov: "pskov",
  orsk: "orsk",
  khmao: "khantymansiysk",
  nazran: "nazran",
  derbent: "derbent",
  nizhnevartovsk: "nizhnevartovsk",
  noyabrsk: "novyurengoy",
  gatchina: "gatchina",
  kyzyl: "kyzyl",
  nalchik: "nalchik",
  elista: "elista",
  magadan: "magadan",
  kamchatka: "pkamchatsky",
  domodedovo: "domodedovo",
  khimki: "khimki",
  mytishchi: "mytishchi",
  lyubertsy: "lyubertsy",
  hasavyurt: "hasavyurt",
  kaspiysk: "kaspiysk",
  kizlyar: "kizlyar",
};

// Slug → Поддомены
export const slugToSubdomain: Record<string, string | null> =
  Object.fromEntries(
    Object.entries(subdomainToSlug).map(([sub, slug]) => [slug, sub])
  );

// Добавляем спец. вариант "Вся Россия"
slugToSubdomain["all-russia"] = null;

export function getRegionSlugFromHost(hostname: string): string {
  const parts = hostname.split(".");

  if (parts.length > 2 && parts[0] !== "www") {
    const subdomain = parts[0];
    return subdomainToSlug[subdomain] || "default";
  }

  return "default";
}

export function getSubdomainFromSlug(slug: string): string | null {
  return slugToSubdomain[slug] ?? null;
}
