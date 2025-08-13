import Image from "next/image";

import styles from "../../Header.module.scss";
import Button from "@/shared/ui/Button";

interface HeaderContentProps {
  openModal: () => void;
}

const HeaderContent = ({ openModal }: HeaderContentProps) => {
  return (
    <div className={styles.content}>
      <h1 className={styles.mainTitle}>
        <div className={styles.eliteBadge}>
          <Image
            src="/assets/home/numbers/crown.svg"
            alt="Корона"
            width={24}
            height={24}
          />
          <span className={styles.eliteText}>Элитные</span>
        </div>
        НОМЕРА <br /> ТЕЛЕФОНОВ
        <p className={styles.description}>
          Большой выбор предложений по лучшим ценам <br /> Красивые Номера с
          официальным оформлением
        </p>
      </h1>

      <Button onClick={openModal}>Получить Красивый номер от 2 499 р.</Button>
    </div>
  );
};

export default HeaderContent;
