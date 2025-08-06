import Link from "next/link";
import Image from "next/image";

import { useCartStore } from "@/store/cartStore";

import styles from "./sidebar.module.scss";

const Sidebar = () => {
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + (item.quantity || 0), 0)
  );

  return (
    <nav
      className={styles.sidebar}
      aria-label="Боковая панель с контактами и корзиной"
    >
      <a
        href="tel:+73532456789"
        className={styles.iconLink}
        aria-label="Позвонить по номеру +7 353 245 67 89"
      >
        <Image
          src="/assets/sidebar/phone.svg"
          alt="Phone icon"
          aria-hidden="true"
          width={20}
          height={20}
        />
      </a>

      <a
        href="https://api.whatsapp.com/send/?phone=%2B79333333311&text&type=phone_number&app_absent=0"
        className={styles.iconLink}
        aria-label="Открыть WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/assets/sidebar/whatsapp.svg"
          alt="WhatsApp icon"
          width={20}
          height={20}
          aria-hidden="true"
        />
      </a>

      <a
        href="https://t.me/+WNyOLaEoQ_dlMmEy"
        className={styles.iconLink}
        aria-label="Открыть Telegram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/assets/sidebar/telegram.svg"
          alt="Telegram icon"
          aria-hidden="true"
          width={20}
          height={20}
        />
      </a>

      <Link
        href="/cart"
        className={styles.iconLink}
        aria-label={`Корзина, ${cartCount} товаров`}
      >
        <Image
          src="/assets/header/cart.svg"
          alt="Корзина"
          width={24}
          height={24}
        />
        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
      </Link>
    </nav>
  );
};

export default Sidebar;
