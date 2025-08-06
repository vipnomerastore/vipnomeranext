import { useCallback } from "react";
import Image from "next/image";

import { CREDIT_ITEMS } from "./const";

import styles from "./Credit.module.scss";

const HomeCredit = () => {
  const handleButtonClick = useCallback(() => {
    if (typeof document !== "undefined") {
      const combinationSection = document.getElementById("combination");

      if (combinationSection) {
        combinationSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div id="credit" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>VIP номер в рассрочку</h2>
        </div>

        <div className={styles.items}>
          {CREDIT_ITEMS.map((item) => (
            <div key={item} className={styles.item}>
              <Image
                src="/assets/home/credit/arrow.svg"
                alt="Arrow icon"
                width={16}
                height={16}
                className={styles.icon}
              />

              <p className={styles.itemText}>{item}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={handleButtonClick}
        >
          <span>Выбрать номер</span>
        </button>
      </div>
    </div>
  );
};

export default HomeCredit;
