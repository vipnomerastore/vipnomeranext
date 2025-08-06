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
  "moskva",
  "spb",
  "rostov",
  "ekaterinburg",
  "makhachkala",
  "novosibirsk",
  "nnovgorod",
  "tyumen",
  "samara",
  "kazan",
  "sochi",
  "kaluga",
  "grozny",
  "ufa",
  "voronezh",
  "chelyabinsk",
  "krasnoyarsk",
  "omsk",
  "volgograd",
  "orenburg",
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
