import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useHydration } from "../../hooks/useHydration";
import Logo from "./ui/Logo";
import NavMenu from "./ui/NavMenu";
import RegionSelector from "./ui/RegionSelector";
import MobileMenu from "./ui/MobileMenu";
import Actions from "./ui/Actions";
import ToasterConfig from "./ui/ToasterConfig";
import LoginModal from "./ui/LoginModal";
import RegisterModal from "./ui/RegisterModal";

import styles from "./Header.module.scss";

const Header = ({ hasBanner = true }: { hasBanner?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const isHydrated = useHydration();

  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const openLoginModal = () => {
    setMenuOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 10);
      }
    };

    handleScroll();

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  }, [pathname]);

  return (
    <div
      className={`${styles.headerWrapper} ${
        isHydrated && scrolled ? styles.scrolled : ""
      } ${!hasBanner ? styles.noBanner : ""}`}
    >
      <ToasterConfig />

      <div className={styles.header}>
        <Logo />

        <NavMenu setMenuOpen={setMenuOpen} />

        <RegionSelector />

        <Actions openLoginModal={openLoginModal} toggleMenu={toggleMenu} />

        <button className={styles.burgerButton} onClick={toggleMenu}>
          <Image
            src="/assets/header/menu.svg"
            alt="Меню"
            width={24}
            height={24}
          />
        </button>

        <MobileMenu
          isOpen={menuOpen}
          toggleMenu={toggleMenu}
          openLoginModal={openLoginModal}
          hasBanner={hasBanner}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          onOpenRegister={openRegisterModal}
        />

        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
        />
      </div>
    </div>
  );
};

export default Header;
