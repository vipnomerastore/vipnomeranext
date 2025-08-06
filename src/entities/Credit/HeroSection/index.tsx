import { memo } from "react";
import Image from "next/image";

import styles from "./HeroSection.module.scss";

interface HeroSectionProps {
  onScrollToForm: () => void;
}

const HeroSection = memo(({ onScrollToForm }: HeroSectionProps) => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <div className={styles.textBlock}>
        <h2 className={styles.title}>
          У нас вы можете купить <br /> VIP-номер в рассрочку!
        </h2>

        <p className={styles.subtitle}>
          Необязательно платить все сразу — разделите стоимость <br />
          номера на 12 комфортных платежей. Мы предлагаем рассрочку <br />
          без банка — вам не нужно будет платить проценты
        </p>
      </div>

      <button type="button" onClick={onScrollToForm} className={styles.button}>
        Купить в рассрочку
      </button>

      <Image
        src="/assets/credit/credit-img.svg"
        alt="Иллюстрация рассрочки"
        width={400}
        height={300}
        className={styles.creditImage}
      />
    </div>
  </section>
));

export default HeroSection;
