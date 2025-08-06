import Link from "next/link";

import styles from "./secondFooter.module.scss";

const SecondFooter = () => {
  const footerItems = [
    {
      href: "/privacy-policy",
      label: "Политика конфиденциальности",
      isLink: true,
    },
    {
      href: "/terms-of-use",
      label: "Пользовательское соглашение",
      isLink: true,
    },
    { label: "Copyright © 2025 ООО «ВИП СТОРЕ»", isLink: false },
  ];

  return (
    <section className={styles.footerWrapper}>
      <div className={styles.footer}>
        {footerItems.map((item) =>
          item.isLink ? (
            <Link key={item.label} href={item.href!} className={styles.item}>
              {item.label}
            </Link>
          ) : (
            <p key={item.label} className={styles.item}>
              {item.label}
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default SecondFooter;
