import Link from "next/link";
import { Metadata } from "next";

import styles from "./SuccessOrder.module.scss";

// Принудительно статичная генерация
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Спасибо за ваш заказ | vipnomerastore.ru",
  description:
    "Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.",
  keywords: "спасибо, заказ подтверждён, vip номера",
  openGraph: {
    title: "Спасибо за ваш заказ | vipnomerastore.ru",
    description:
      "Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.",
    url: "https://vipnomerastore.ru/thank-you",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Спасибо за ваш заказ | vipnomerastore.ru",
    description:
      "Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const ThankYouPage = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Спасибо за заявку!</h1>

      <p className={styles.promocode}>
        В течении{" "}
        <b className={styles.span} style={{ color: "#e63946", fontSize: 28 }}>
          15 минут
        </b>{" "}
        менеджер свяжется с вами
      </p>

      <p className={styles.text}>
        Подписывайтесь на наши соцсети, чтобы не пропустить акции и новости:
      </p>

      <div className={styles.socials}>
        <Link
          className={styles.socialLink}
          href="https://t.me/+WNyOLaEoQ_dlMmEy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </Link>

        <Link
          className={styles.socialLink}
          href="https://vk.com/vipnomerastore"
          target="_blank"
          rel="noopener noreferrer"
        >
          VK
        </Link>

        <Link
          className={styles.socialLink}
          href="https://api.whatsapp.com/send/?phone=%2B79333333311&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </Link>
      </div>

      <Link href="/" className={styles.backToShop}>
        <span>Вернуться к покупкам</span>

        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: 8 }}
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
};

export default ThankYouPage;
