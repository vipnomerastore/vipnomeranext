"use client";

import styles from "../Header.module.scss";

const HeaderBanner = () => {
  return (
    <div
      className={styles.bannerTop}
      role="banner"
      tabIndex={0}
      aria-label="Выгодная рассрочка до 12 месяцев без банка и без переплат. Нажмите для подробностей."
    >
      <span className={styles.whiteText}>Выгодная рассрочка до </span>
      <span className={styles.gradientText}>12</span>
      <span className={styles.whiteText}> месяцев </span>
      <span className={styles.gradientText}>без банка</span>
      <span className={styles.whiteText}> и </span>
      <span className={styles.gradientText}>без переплат</span>
    </div>
  );
};

export default HeaderBanner;
