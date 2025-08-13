"use client";
import { useState, useEffect } from "react";
import RegionModal from "@/widgets/regionModal";
import { regionName } from "@/shared/utils";
import styles from "./RegionSelector.module.scss";

const RegionSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<string>("default");

  // Определяем текущий регион из URL (поддомена) или cookie
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      // Извлекаем поддомен
      const parts = hostname.split(".");
      if (parts.length > 2 && parts[0] !== "www") {
        const subdomain = parts[0];

        // Маппинг поддоменов обратно к slug'ам для отображения
        const subdomainToSlug: Record<string, string> = {
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

          // Дополнительные поддомены
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

        const regionSlug = subdomainToSlug[subdomain] || "default";
        setCurrentRegion(regionSlug);
      } else {
        // Если это основной сайт без поддомена, показываем "Вся Россия"
        setCurrentRegion("default");
      }
    }
  }, []);

  const currentRegionName = regionName(currentRegion);

  const handleRegionSelect = (slug: string) => {
    // Специальная обработка для "Вся Россия"
    if (slug === "all-russia") {
      const newUrl = `https://vipnomerastore.ru${window.location.pathname}`;
      window.location.href = newUrl;
      setIsModalOpen(false);
      return;
    }

    // Полный маппинг slug'ов из RegionModal на поддомены
    const slugToSubdomain: Record<string, string | null> = {
      // Специальная опция для основного сайта
      "all-russia": null,

      // Основные регионы с поддоменами
      moskva: "msk",
      spb: "spb",
      novosibirsk: "nsk",
      ekaterinburg: "ekb",
      nnovgorod: "nn",
      kazan: "kzn",
      chelyabinsk: "chel",
      omsk: "omsk",
      samara: "smr",
      rostov: "rostov",
      ufa: "ufa",
      krasnoyarsk: "krsk",
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
      khabarovsk: "habarovsk",
      yaroslavl: "yaroslavl",
      vladivostok: "vladivostok",
      makhachkala: "mahachkala",
      tomsk: "tomsk",
      orenburg: "orenburg",
      kemerovo: "kemerovo",
      ryazan: "ryazan",
      astrakhan: "astrakhan",
      penza: "penza",
      lipetsk: "lipetsk",

      // Дополнительные регионы с новыми поддоменами
      sochi: "sochi",
      kaluga: "kaluga",
      grozny: "grozny",
      stavropol: "stavropol",
      sevastopol: "sevastopol",
      nabchelny: "naberezhnye",
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
      khantymansiysk: "khmao",
      nazran: "nazran",
      derbent: "derbent",
      nizhnevartovsk: "nizhnevartovsk",
      novyurengoy: "noyabrsk",
      gatchina: "gatchina",
      kyzyl: "kyzyl",
      nalchik: "nalchik",
      elista: "elista",
      magadan: "magadan",
      pkamchatsky: "kamchatka",
      domodedovo: "domodedovo",
      khimki: "khimki",
      mytishchi: "mytishchi",
      lyubertsy: "lyubertsy",
      hasavyurt: "hasavyurt",
      kaspiysk: "kaspiysk",
      kizlyar: "kizlyar",
    };

    const subdomain = slugToSubdomain[slug];
    const newUrl = subdomain
      ? `https://${subdomain}.vipnomerastore.ru${window.location.pathname}`
      : `https://vipnomerastore.ru${window.location.pathname}`;

    window.location.href = newUrl;
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={styles.regionButton}
        onClick={() => setIsModalOpen(true)}
        aria-label="Выбрать регион"
      >
        <span className={styles.regionText}>
          {currentRegionName || "Выбрать регион"}
        </span>
        <svg
          className={styles.arrow}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="currentColor"
        >
          <path d="M6 8L0 0h12L6 8z" />
        </svg>
      </button>

      <RegionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleRegionSelect}
      />
    </>
  );
};

export default RegionSelector;
