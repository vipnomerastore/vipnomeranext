import { useCallback } from "react";
import Image from "next/image";

import styles from "./Esim.module.scss";
import Button from "@/shared/ui/Button";

const HomeEsim = () => {
  const handleButtonClick = useCallback(() => {
    if (typeof document !== "undefined") {
      const combinationSection = document.getElementById("combination");

      if (combinationSection) {
        combinationSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Оформите E-SIM за 5 минут</h2>

          <div className={styles.feature}>
            <Image
              src="/assets/home/esim/offer-card.svg"
              alt="eSIM карта"
              width={100}
              height={100}
              className={styles.cardImage}
              style={{ height: "auto" }}
            />

            <div className={styles.text}>
              <p className={styles.featureTitle}>
                Удаленная активация прямо из дома
              </p>

              <p className={styles.featureSubtitle}>
                Возможности нового поколения SIM-Карт
              </p>
            </div>
          </div>

          <Button onClick={handleButtonClick} variant="outline">
            Выбрать номер
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeEsim;
