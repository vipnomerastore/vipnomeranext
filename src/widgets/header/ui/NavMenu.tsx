import Link from "next/link";
import { usePathname } from "next/navigation";

import { useHydration } from "../../../hooks/useHydration";
import ScrollNavLink from "./ScrollNavLink";
import styles from "../Header.module.scss";

interface NavMenuProps {
  setMenuOpen: (open: boolean) => void;
}

const NavMenu = ({ setMenuOpen }: NavMenuProps) => {
  const pathname = usePathname();
  const isHydrated = useHydration();

  const getNavLinkClass = (href: string) => {
    if (href === "/" && !isHydrated) return styles.navItem;

    const isActive =
      href === "/"
        ? pathname === "/" && window.location.hash === ""
        : pathname === href;

    return [styles.navItem, isActive ? styles.active : ""].join(" ");
  };

  return (
    <div className={styles.navWrapper}>
      <Link
        href="/"
        className={getNavLinkClass("/")}
        onClick={() => setMenuOpen(false)}
      >
        Выбрать номер
      </Link>

      <Link
        href="/partner"
        className={getNavLinkClass("/partner")}
        onClick={() => setMenuOpen(false)}
      >
        Партнёрам
      </Link>

      <Link
        href="/redemption"
        className={getNavLinkClass("/redemption")}
        onClick={() => setMenuOpen(false)}
      >
        Продать номер
      </Link>

      <ScrollNavLink href="#contacts" setMenuOpen={setMenuOpen}>
        Контакты
      </ScrollNavLink>

      <Link
        href="/blog"
        className={getNavLinkClass("/blog")}
        onClick={() => setMenuOpen(false)}
      >
        Блог
      </Link>
    </div>
  );
};

export default NavMenu;
