import { memo } from "react";
import Image from "next/image";

import styles from "./BannerSection.module.scss";

const BannerSection: React.FC = memo(() => (
  <section className={styles.bannerWrapper}>
    <div className={styles.banner}>
      <h1 className={styles.firstActionTitle}>
        Продайте красивый номер{" "}
        <span className={styles.firstActionTitleSpan}>
          по очень выгодной цене!
        </span>
      </h1>

      <div className={styles.benefitsList}>
        <div className={styles.benefitItem}>
          <Image
            src="/assets/redemption/first.svg"
            alt="Быстрая оценка"
            width={20}
            height={20}
            className={styles.benefitIcon}
          />
          <span>Мгновенная оценка стоимости</span>
        </div>

        <div className={styles.benefitItem}>
          <Image
            src="/assets/redemption/second.svg"
            alt="Официальный договор"
            width={20}
            height={20}
            className={styles.benefitIcon}
          />
          <span>Безопасная сделка с договором</span>
        </div>

        <div className={styles.benefitItem}>
          <Image
            src="/assets/redemption/third.svg"
            alt="Оплата сразу"
            width={20}
            height={20}
            className={styles.benefitIcon}
          />
          <span>Деньги сразу на карту</span>
        </div>

        <div className={styles.benefitItem}>
          <Image
            src="/assets/redemption/fourth.svg"
            alt="Личная встреча"
            width={20}
            height={20}
            className={styles.benefitIcon}
          />
          <span>Личное сопровождение сделки</span>
        </div>

        <div className={styles.benefitItem}>
          <Image
            src="/assets/redemption/fifth.svg"
            alt="Конфиденциальность"
            width={20}
            height={20}
            className={styles.benefitIcon}
          />
          <span>100% конфиденциальность</span>
        </div>

        <div className={styles.benefitItem}>
          <Image
            src="/assets/header/user.svg"
            alt="Конфиденциальность"
            width={20}
            height={20}
            className={styles.benefitIcon}
          />
          <span>Следите за продажей в личном кабинете</span>
        </div>
      </div>
    </div>
  </section>
));

export default BannerSection;
