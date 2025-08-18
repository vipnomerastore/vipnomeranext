import { useState } from "react";
import Image from "next/image";

import GetNumberModal from "./ui/GetNumberModal";
import Button from "@/shared/ui/Button";

import styles from "./GetNumber.module.scss";

const HomeGetNumber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.info}>
          <h2 className={styles.title}>
            <span className={styles.titleSpan}>НЕ НАШЛИ</span> ПОДХОДЯЩИЙ НОМЕР?
          </h2>

          <p className={styles.pretitle}>Мы подберем его для вас!</p>
        </div>

        <div className={styles.img}>
          <Image
            src="/assets/home/getNumber/sim.webp"
            alt="sim"
            width={200}
            height={150}
          />
        </div>

        <Button onClick={openModal} arrow>
          Подобрать номер
        </Button>
      </div>

      <GetNumberModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default HomeGetNumber;
