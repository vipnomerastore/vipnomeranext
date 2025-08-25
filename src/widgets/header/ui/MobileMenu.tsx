import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";

import ScrollNavLink from "./ScrollNavLink";
import styles from "../Header.module.scss";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  openLoginModal: () => void;
  hasBanner?: boolean;
}

const MobileMenu = ({
  isOpen,
  toggleMenu,
  openLoginModal,
  hasBanner = true,
}: MobileMenuProps) => {
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + (item.quantity ?? 0), 0)
  );
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    toggleMenu();
  };

  const navLinks = [
    { href: "/", label: "Выбрать номер" },
    { href: "/partner", label: "Партнёрам" },
    { href: "/redemption", label: "Продать номер" },
    { href: "/blog", label: "Блог" },
  ];

  const getLinkClass = (href: string) =>
    href === pathname ? `${styles.navItem} ${styles.active}` : styles.navItem;

  return (
    <div
      className={styles.mobileMenu}
      style={{ paddingTop: hasBanner ? 22 : 0 }}
    >
      <div className={styles.mobileMenuHeader}>
        <Link href="/" onClick={toggleMenu} aria-label="На главную">
          <Image
            className={styles.logo}
            src="/assets/header/logo.svg"
            alt="Логотип"
            width={120}
            height={40}
            style={{ height: "auto" }}
          />
        </Link>

        <button
          className={styles.burgermenuButton}
          onClick={toggleMenu}
          aria-label="Закрыть меню"
          type="button"
        >
          <Image
            src="/assets/header/menu.svg"
            alt="Меню"
            width={32}
            height={32}
          />
        </button>
      </div>

      <nav className={styles.mobileMenuNav} aria-label="Основное меню">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={toggleMenu}
            className={getLinkClass(link.href)}
          >
            {link.label}
          </Link>
        ))}

        <ScrollNavLink href="/#contacts" setMenuOpen={toggleMenu}>
          Контакты
        </ScrollNavLink>
      </nav>

      <div className={styles.mobileActions}>
        <div className={styles.leftButtons}>
          <Link
            href="tel:+79333333311"
            className={styles.phoneWrapper}
            aria-label="Позвонить по номеру +7 933 333 33 11"
          >
            <Image
              src="/assets/header/phone.svg"
              alt="Телефон"
              width={20}
              height={20}
            />

            <p>+7 933 333 33 11</p>
          </Link>

          {isAuthenticated && user ? (
            <div className={styles.userWrapper}>
              <Image
                src="/assets/header/user.svg"
                alt="Пользователь"
                className={styles.userIcon}
                width={24}
                height={24}
              />
              <span className={styles.userName} title={user.username}>
                {user.username}
              </span>

              <button
                className={styles.logoutButtonMobile}
                onClick={handleLogout}
                aria-label="Выйти из аккаунта"
                type="button"
              >
                <Image
                  src="/assets/header/logout.svg"
                  alt="Выйти"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          ) : (
            <button
              className={styles.loginButtonMobile}
              onClick={openLoginModal}
              type="button"
              aria-label="Открыть окно входа"
            >
              <Image
                src="/assets/header/user.svg"
                alt="Пользователь"
                width={24}
                height={24}
              />

              <span>Войти</span>
            </button>
          )}

          <Link
            href="/cart"
            className={styles.iconButton}
            aria-label="Перейти в корзину"
          >
            <p>Корзина</p>

            <Image
              src="/assets/header/cart.svg"
              alt="Корзина"
              width={24}
              height={24}
            />

            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
