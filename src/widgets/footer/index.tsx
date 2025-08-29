import Link from "next/link";
import Image from "next/image";

import ScrollNavLink from "../header/ui/ScrollNavLink";

import styles from "./footer.module.scss";

const Footer = () => (
  <section className={styles.wrapper}>
    <div className={styles.footer}>
      <div className={styles.left}>
        <Link href="/" aria-label="На главную">
          <Image
            src="/assets/header/logo.svg"
            alt="Логотип"
            className={styles.logo}
            width={120}
            height={40}
          />
        </Link>

        <div className={styles.contactInfo}>
          <p>ИНН: 562002631053</p>
          <p>ОГРНИП: 318565800043151</p>
        </div>
      </div>

      <div className={styles.right}>
        <nav className={styles.navColumn}>
          <ScrollNavLink href="/#combination" className={styles.navLink}>
            Выбрать номер
          </ScrollNavLink>

          <ScrollNavLink href="/#action" className={styles.navLink}>
            Акции
          </ScrollNavLink>

          <Link href="/partner" className={styles.navLink}>
            Партнерам
          </Link>
        </nav>

        <nav className={styles.navColumn}>
          <Link href="/redemption" className={styles.navLink}>
            Продать номер
          </Link>

          <ScrollNavLink href="/#contacts" className={styles.navLink}>
            Контакты
          </ScrollNavLink>
        </nav>

        <div className={styles.thirdColumn}>
          <div className={styles.contactsAndSocial}>
            <a
              href="tel:+79333333311"
              className={styles.phoneNumberLink}
              aria-label="Позвонить по номеру +7 933 333 33 11"
            >
              <Image
                src="/assets/header/phone.svg"
                alt="Телефон"
                width={20}
                height={20}
              />
              <span className={styles.phoneNumber}>+7 933 333 33 11</span>
            </a>

            <div className={styles.socialLinks}>
              <a
                href="https://api.whatsapp.com/send/?phone=%2B79333333311"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Открыть WhatsApp"
                className={styles.socialLink}
              >
                <Image
                  src="/assets/header/whatsapp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                />
              </a>

              <a
                href="https://t.me/+WNyOLaEoQ_dlMmEy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Открыть Telegram"
                className={styles.socialLink}
              >
                <Image
                  src="/assets/header/tg.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              </a>
            </div>
          </div>

          <Link
            href="/#combination"
            className={styles.chooseButton}
            aria-label="Выбрать номер"
          >
            Выбрать номер
          </Link>
        </div>
      </div>
    </div>

    <div className={styles.mobileFooterText}>
      <Link href="/policy-privacy" className={styles.navLink}>
        Политика конфиденциальности
      </Link>

      <Link href="/terms-of-use" className={styles.navLink}>
        Пользовательское соглашение
      </Link>

      <p className={styles.copyright}>© 2025 Все права защищены</p>

      <p className={styles.copyright}>Copyright © 2025 ООО «ВИП СТОРЕ»</p>
    </div>
  </section>
);

export default Footer;
