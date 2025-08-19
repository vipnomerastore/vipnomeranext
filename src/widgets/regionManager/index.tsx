import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHydration } from "../../hooks/useHydration";

import { getSubdomain, regionName } from "@/shared/utils";
import { useRegion } from "@/hooks/useRegion";
import RegionModal from "../regionModal";

import styles from "./RegionManager.module.scss";

// Функция для чтения cookie
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Функция для установки cookie
const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

// Функции для localStorage (dismissedPrompt)
const getLocalStorage = (key: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const setLocalStorage = (key: string, value: boolean) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value.toString());
  } catch {
    // Ignore localStorage errors
  }
};

const CITY_TO_SLUG: Record<string, string> = {
  // Основные и алиасы
  msk: "moskva",
  moscow: "moskva",
  moskva: "moskva",
  spb: "spb",
  nsk: "novosibirsk",
  novosibirsk: "novosibirsk",
  ekb: "ekaterinburg",
  ekaterinburg: "ekaterinburg",
  nn: "nnovgorod",
  nnovgorod: "nnovgorod",
  kzn: "kazan",
  kazan: "kazan",
  chel: "chelyabinsk",
  chelyabinsk: "chelyabinsk",
  omsk: "omsk",
  smr: "samara",
  samara: "samara",
  rostov: "rostov",
  ufa: "ufa",
  krsk: "krasnoyarsk",
  krasnoyarsk: "krasnoyarsk",
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
  khabarovsk: "khabarovsk",
  yaroslavl: "yaroslavl",
  vladivostok: "vladivostok",
  mahachkala: "makhachkala",
  makhachkala: "makhachkala",
  tomsk: "tomsk",
  orenburg: "orenburg",
  kemerovo: "kemerovo",
  ryazan: "ryazan",
  astrakhan: "astrakhan",
  penza: "penza",
  lipetsk: "lipetsk",
  // Дополнительные поддомены
  sochi: "sochi",
  kaluga: "kaluga",
  grozny: "grozny",
  stavropol: "stavropol",
  sevastopol: "sevastopol",
  naberezhnye: "nabchelny",
  nabchelny: "nabchelny",
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
  khantymansiysk: "khantymansiysk",
  nazran: "nazran",
  derbent: "derbent",
  nizhnevartovsk: "nizhnevartovsk",
  noyabrsk: "novyurengoy",
  novyurengoy: "novyurengoy",
  gatchina: "gatchina",
  kyzyl: "kyzyl",
  nalchik: "nalchik",
  elista: "elista",
  magadan: "magadan",
  kamchatka: "pkamchatsky",
  pkamchatsky: "pkamchatsky",
  domodedovo: "domodedovo",
  khimki: "khimki",
  mytishchi: "mytishchi",
  lyubertsy: "lyubertsy",
  hasavyurt: "hasavyurt",
  kaspiysk: "kaspiysk",
  kizlyar: "kizlyar",
};

const mapCityToSlug = (cityRaw: string): string | null => {
  const normalized = cityRaw.toLowerCase().replace(/\s|-/g, "");

  return CITY_TO_SLUG[normalized] || null;
};

const RegionManager = () => {
  const router = useRouter();
  const { region, setRegion } = useRegion();
  const isHydrated = useHydration();

  // Локальное состояние для dismissedPrompt
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detectedRegion, setDetectedRegion] = useState<string | null>(null);

  // Инициализация dismissed из localStorage
  useEffect(() => {
    if (!isHydrated) return;
    const dismissedFromStorage = getLocalStorage("region-dismissed");
    setDismissed(dismissedFromStorage);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    // Сначала читаем cookie, установленную middleware
    const cookieRegion = getCookie("region");

    if (cookieRegion && cookieRegion !== region) {
      // Синхронизируем store с cookie
      setRegion(cookieRegion);
      return;
    }

    // Если cookie нет, но есть поддомен
    const subdomain = getSubdomain();
    if (subdomain && subdomain !== "www" && regionName(subdomain)) {
      setRegion(subdomain);
      setCookie("region", subdomain);
      return;
    }

    // Если нет ни cookie, ни поддомена - используем геолокацию
    const hasSubdomain = Boolean(subdomain);
    const isLocalhost = window.location.hostname === "localhost";

    if (!hasSubdomain && !dismissed && !isLocalhost && !cookieRegion) {
      fetch("https://ipinfo.io/json")
        .then((res) => res.json())
        .then((data) => {
          if (data.city) {
            const slug = mapCityToSlug(data.city);

            if (slug) {
              setDetectedRegion(slug);
              setShowPrompt(true);
            }
          }
        })
        .catch((err) => {
          console.error("Geo API failed", err);
        });
    }
  }, [isHydrated, region, dismissed, setRegion]);

  const handleAccept = () => {
    if (!detectedRegion) return;

    setDismissed(true);
    setLocalStorage("region-dismissed", true);
    setRegion(detectedRegion);
    setCookie("region", detectedRegion);

    const domain = window.location.hostname.split(".").slice(-2).join(".");
    const currentSubdomain = window.location.hostname.split(".")[0];

    if (currentSubdomain !== detectedRegion) {
      // Используем Next.js router
      const currentUrl = new URL(window.location.href);
      currentUrl.hostname = `${detectedRegion}.${domain}`;
      router.push(currentUrl.toString());
    }
  };

  const handleChangeRegion = () => {
    setShowPrompt(false);
    setShowModal(true);
  };

  const handleSelectRegion = (slug: string) => {
    setDismissed(false);
    setLocalStorage("region-dismissed", false);
    setRegion(slug);
    setCookie("region", slug);

    const domain = window.location.hostname.split(".").slice(-2).join(".");
    const currentSubdomain = window.location.hostname.split(".")[0];

    if (currentSubdomain !== slug) {
      // Используем Next.js router
      const currentUrl = new URL(window.location.href);
      currentUrl.hostname = `${slug}.${domain}`;
      router.push(currentUrl.toString());
    }
  };

  const regionLabel = regionName(detectedRegion || "");

  return (
    <>
      {isHydrated && showPrompt && detectedRegion && (
        <div className={styles.regionPrompt}>
          <span>
            Ваш регион <strong>{regionLabel}</strong>?
          </span>

          <div className={styles.actions}>
            <button onClick={handleAccept}>Да</button>
            <button onClick={handleChangeRegion}>Сменить регион</button>
          </div>
        </div>
      )}

      {isHydrated && showModal && (
        <RegionModal
          isOpen={true}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectRegion}
        />
      )}
    </>
  );
};

export default RegionManager;
