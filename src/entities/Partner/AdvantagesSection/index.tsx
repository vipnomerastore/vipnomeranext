import { memo } from "react";

import styles from "./AdvantagesSection.module.scss";
import Image from "next/image";

interface Advantage {
  icon: string;
  title: string;
  description: string;
}

const advantages: Advantage[] = [
  {
    icon: "/assets/partner/1.svg",
    title: "Просто",
    description:
      "Вы сможете зарабатывать не выходя из дома, предлагая востребованный продукт своим клиентам",
  },
  {
    icon: "/assets/partner/2.svg",
    title: "Понятно",
    description:
      "Наши партнеры получают информационную поддержку от экспертов компании. Мы расскажем, как работать, чтобы получать максимальный доход",
  },
  {
    icon: "/assets/partner/3.svg",
    title: "Выгодно",
    description:
      "Благодаря специальным ценам, которые мы установили для наших партнеров, вы сможете зарабатывать от 100 000 рублей ежемесячно",
  },
];

const AdvantagesSection: React.FC = memo(() => (
  <section className={styles.section} aria-labelledby="advantages-title">
    <div className={styles.sectionContent}>
      <div className={styles.textBlock}>
        <h1 className={styles.title} id="advantages-title">
          Преимущества партнёров — программа сотрудничества по красивым номерам
        </h1>
      </div>

      <div className={styles.advantagesGrid}>
        {advantages.map((advantage, index) => (
          <article
            className={styles.advantageItem}
            key={index}
            tabIndex={0}
            aria-label={advantage.title}
          >
            <Image
              loading="lazy"
              width={64}
              height={64}
              src={advantage.icon}
              alt="advantage"
              aria-hidden="true"
            />

            <div>
              <h3 className={styles.advantageTitle}>{advantage.title}</h3>

              <p className={styles.advantageDescription}>
                {advantage.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
));

AdvantagesSection.displayName = "AdvantagesSection";

export default AdvantagesSection;
