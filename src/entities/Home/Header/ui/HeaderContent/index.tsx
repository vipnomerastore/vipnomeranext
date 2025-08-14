import Image from "next/image";

import styles from "../../Header.module.scss";
import Button from "@/shared/ui/Button";

interface HeaderContentProps {
  openModal: () => void;
}

const HeaderContent = ({ openModal }: HeaderContentProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.eliteBadge}>
        <Image
          src="/assets/home/numbers/crown.svg"
          alt="Корона"
          width={24}
          height={24}
        />
        <span className={styles.eliteText}>Элитные</span>
      </div>
      <h1 className={styles.mainTitle}>
        НОМЕРА <span className={styles.block}>ТЕЛЕФОНОВ</span>
        <span className={styles.description}>
          Большой выбор Красивых, Запоминающихся, Выгодных номеров
        </span>
      </h1>

      <p className={styles.description}>
        Предложения по лучшим ценам <br /> Красивые Номера с официальным
        оформлением
      </p>

      <Button onClick={openModal}>ПОЛУЧИТЬ КРАСИВЫЙ НОМЕР ОТ 2 499₽</Button>
    </div>
  );
};

export default HeaderContent;
