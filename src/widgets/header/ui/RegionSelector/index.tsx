"use client";
import { useState } from "react";
import RegionModal from "@/widgets/regionModal";
import { useRegion } from "@/hooks/useRegion";
import { regionName } from "@/shared/utils";
import styles from "./RegionSelector.module.scss";

const RegionSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { region } = useRegion();

  const currentRegionName = regionName(region);

  const handleRegionSelect = (slug: string) => {
    // Маппинг slug'ов из RegionModal на поддомены
    const slugToSubdomain: Record<string, string> = {
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
        <span className={styles.regionText}>{currentRegionName}</span>
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
