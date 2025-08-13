import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHydration } from "../../../hooks/useHydration";

import ScrollNavLink from "./ScrollNavLink";

import styles from "../Header.module.scss";

const NavMenu = ({ setMenuOpen }: { setMenuOpen: (open: boolean) => void }) => {
  const pathname = usePathname();
  const isHydrated = useHydration();

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return [styles.navItem, isActive ? styles.active : ""].join(" ");
  };

  const isHomeActive =
    pathname === "/" && (!isHydrated || window.location.hash === "");

  return (
    <div className={styles.navWrapper}>
      <Link
        href="/"
        className={[styles.navItem, isHomeActive ? styles.active : ""].join(
          " "
        )}
        onClick={() => setMenuOpen(false)}
      >
        Выбрать номер
      </Link>

      <ScrollNavLink href="#action" setMenuOpen={setMenuOpen}>
        Акции
      </ScrollNavLink>

      <Link
        href="/credit"
        className={getNavLinkClass("/credit")}
        onClick={() => setMenuOpen(false)}
      >
        Рассрочка без банка
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
