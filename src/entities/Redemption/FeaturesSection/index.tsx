import { memo } from "react";
import Image from "next/image";

import styles from "./FeaturesSection.module.scss";

interface Feature {
  icon: string;
  title: string;
  alt: string;
}

const features: Feature[] = [
  {
    icon: "/assets/redemption/first.svg",
    title: "Быстрая оценка",
    alt: "Быстрая оценка",
  },
  {
    icon: "/assets/redemption/second.svg",
    title: "Официальный договор",
    alt: "Официальный договор",
  },
  {
    icon: "/assets/redemption/third.svg",
    title: "Оплата сразу при переоформлении",
    alt: "Оплата сразу",
  },
  {
    icon: "/assets/redemption/fourth.svg",
    title: "Личная встреча (индивидуально)",
    alt: "Личная встреча",
  },
  {
    icon: "/assets/redemption/fifth.svg",
    title: "Конфиденциальность сделки",
    alt: "Конфиденциальность",
  },
];

const FeaturesSection: React.FC = memo(() => (
  <section className={styles.tabWrapper}>
    <div className={styles.tabItemTop}>
      {features.slice(0, 3).map((feature, index) => (
        <div key={index} className={styles.tabItem}>
          <Image
            loading="lazy"
            src={feature.icon}
            alt={feature.alt}
            width={48}
            height={48}
          />
          <p className={styles.tabItemTitle}>{feature.title}</p>
        </div>
      ))}
    </div>

    <div className={styles.tabItemBottom}>
      {features.slice(3).map((feature, index) => (
        <div key={index} className={styles.tabItem}>
          <Image
            loading="lazy"
            src={feature.icon}
            alt={feature.alt}
            width={48}
            height={48}
          />
          <p className={styles.tabItemTitle}>{feature.title}</p>
        </div>
      ))}
    </div>
  </section>
));

export default FeaturesSection;
