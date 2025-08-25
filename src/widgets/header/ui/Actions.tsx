import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";

import styles from "../Header.module.scss";

interface ActionsProps {
  openLoginModal: () => void;
  toggleMenu: () => void;
}

const Actions = ({ openLoginModal, toggleMenu }: ActionsProps) => {
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + (item.quantity ?? 0), 0)
  );
  const { isAuthenticated, user, logout } = useAuthStore();
  const { clearCart } = useCartStore();

  const handleLogout = () => {
    logout();
    clearCart();
  };

  return (
    <div className={styles.mainControls}>
      <div className={styles.actionsWrapper}>
        <a
          href="tel:+79333333311"
          className={styles.phoneWrapperBig}
          aria-label="Позвонить +7 933 333 33 11"
        >
          <Image
            src="/assets/header/phone.svg"
            alt="Телефон"
            width={24}
            height={24}
          />
          <p>+7 933 333 33 11</p>
        </a>

        {isAuthenticated && user ? (
          <div
            className={styles.userWrapper}
            role="region"
            aria-label="Пользователь"
          >
            <Image
              src="/assets/header/user.svg"
              alt="Иконка пользователя"
              className={styles.userIcon}
              width={24}
              height={24}
            />

            <span className={styles.userName} title={user.username}>
              {user.username}
            </span>

            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              aria-label="Выйти из аккаунта"
              type="button"
            >
              <Image
                src="/assets/header/logout.svg"
                alt="Иконка выхода"
                width={20}
                height={20}
              />
            </button>
          </div>
        ) : (
          <button
            className={styles.loginButton}
            onClick={openLoginModal}
            aria-label="Войти в аккаунт"
            type="button"
          >
            <Image
              src="/assets/header/user.svg"
              alt="Иконка пользователя"
              width={20}
              height={20}
            />
            <span>Войти</span>
          </button>
        )}

        <Link
          href="/cart"
          className={styles.cartLink}
          aria-label={`Перейти в корзину, товаров: ${cartCount}`}
        >
          <button
            className={styles.iconButton}
            type="button"
            aria-live="polite"
            aria-atomic="true"
          >
            <Image
              src="/assets/header/cart.svg"
              alt="Корзина"
              width={24}
              height={24}
            />

            {cartCount > 0 && (
              <span
                className={styles.cartBadge}
                aria-label={`${cartCount} товар${
                  cartCount > 1 ? "ов" : ""
                } в корзине`}
              >
                {cartCount}
              </span>
            )}
            <p>Корзина</p>
          </button>
        </Link>
      </div>

      <div className={styles.mobileControls}>
        <a
          href="tel:+79333333311"
          className={styles.phoneWrapper}
          aria-label="Позвонить +7 933 333 33 11"
        >
          <Image
            src="/assets/header/phone.svg"
            alt="Телефон"
            width={24}
            height={24}
          />
          <p>+7 933 333 33 11</p>
        </a>
      </div>

      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
        aria-label="Открыть меню"
        type="button"
      >
        <Image
          src="/assets/header/menu.svg"
          alt="Меню"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default Actions;
