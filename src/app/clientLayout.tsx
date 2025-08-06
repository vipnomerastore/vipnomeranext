"use client";

import { useState, useCallback } from "react";
import { useHydration } from "../hooks/useHydration";

import headerStyles from "@/widgets/header/Header.module.scss";
import styles from "./clientLayout.module.scss";
import RegionManager from "@/widgets/regionManager";

// Обычные импорты вместо lazy
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import SecondFooter from "@/widgets/secondFooter";
import Sidebar from "@/widgets/sidebar";
import Popup from "@/entities/mainPopUp";
import RotatingHeaderBanner from "@/widgets/header/ui/RotatingHeaderBanner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasBanner, setHasBanner] = useState(true);
  const isHydrated = useHydration();

  const handleBannerVisibilityChange = useCallback((visible: boolean) => {
    setHasBanner(visible);
  }, []);

  // Показываем простую заглушку до гидратации
  if (!isHydrated) {
    return (
      <div className={styles.layout}>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={headerStyles.bannerHeaderSmoke}>
        <RotatingHeaderBanner
          onBannerVisibilityChange={handleBannerVisibilityChange}
        />

        <header className={styles.header}>
          <Header hasBanner={hasBanner} />
        </header>
      </div>

      <RegionManager />

      <main>{children}</main>

      <aside>
        <Sidebar />
      </aside>

      <footer>
        <Footer />
        <SecondFooter />
      </footer>

      <Popup />
    </div>
  );
}
