"use client";

import { useHydration } from "../hooks/useHydration";
import headerStyles from "@/widgets/header/Header.module.scss";
import RegionManager from "@/widgets/regionManager";
import HeaderBanner from "@/widgets/header/ui/HeaderBanner";

// Обычные импорты вместо lazy
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import SecondFooter from "@/widgets/secondFooter";
import Sidebar from "@/widgets/sidebar";
import Popup from "@/entities/mainPopUp";
import styles from "./clientLayout.module.scss";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHydrated = useHydration();

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
        <HeaderBanner />

        <header className={styles.header}>
          <Header />
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
