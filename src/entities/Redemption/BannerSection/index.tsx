import { memo } from "react";
import Image from "next/image";

import styles from "./BannerSection.module.scss";

const BannerSection: React.FC = memo(() => (
  <section className={styles.bannerWrapper}>
    <div className={styles.banner}>
      <div className={styles.timer}>
        <Image
          loading="lazy"
          src="/assets/home/promotion/hot.svg"
          alt="Продать номер"
          width={24}
          height={24}
        />
        <p className={styles.timerText}>Продать номер</p>
      </div>

      <h1 className={styles.firstActionTitle}>
        Хотите продать <br />
        <span className={styles.firstActionTitleSpan}>
          красивый номер телефона?
        </span>
      </h1>

      <p className={styles.firstActionDescription}>
        Оперативный выкуп с официальным оформлением сделки
      </p>
    </div>
  </section>
));

export default BannerSection;
