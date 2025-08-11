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
        НОМЕРА <br /> ТЕЛЕФОНОВ
      </h1>

      <p className={styles.description}>
        Большой выбор VIP предложений по лучшим ценам <br /> Номера с
        официальным оформлением
      </p>

      <Button onClick={openModal}>Получить VIP номер от 2 499 р.</Button>
    </div>
  );
};

export default HeaderContent;
