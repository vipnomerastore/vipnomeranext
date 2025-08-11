import { memo } from "react";

import styles from "./HeroSection.module.scss";
import Button from "@/shared/ui/Button";

interface HeroSectionProps {
  onScrollToForm: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = memo(({ onScrollToForm }) => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <div className={styles.textBlock}>
        <h2 className={styles.title}>
          У нас можно не только купить красивые номера, <br /> но и стать нашим
          партнером
        </h2>

        <p className={styles.subtitle}>
          Мы предлагаем <span className={styles.accent}>эксклюзивные цены</span>{" "}
          на VIP-номера для наших партнеров. <br />
          Чтобы ознакомиться с ними, отправьте заявку и начните зарабатывать уже
          сегодня
        </p>

        <Button onClick={onScrollToForm}>Стать партнером</Button>
      </div>
    </div>
  </section>
));

HeroSection.displayName = "HeroSection";

export default HeroSection;
