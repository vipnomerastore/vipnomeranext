"use client";

import { useState, useEffect } from "react";

import RegionModal from "@/widgets/regionModal";
import { regionName } from "@/shared/utils";
import { getRegionSlugFromHost, getSubdomainFromSlug } from "./utils";
import styles from "./RegionSelector.module.scss";

const RegionSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRegion(getRegionSlugFromHost(window.location.hostname));
    }
  }, []);

  const handleRegionSelect = (slug: string) => {
    const subdomain = getSubdomainFromSlug(slug);

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
      >
        <span className={styles.regionText}>
          {regionName(currentRegion) || "Выбрать регион"}
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
