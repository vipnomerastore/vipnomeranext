"use client";

import { useState } from "react";
import Image from "next/image";

import HeaderContent from "./ui/HeaderContent";

import VipNumberModal from "./ui/VipNumberModal";

import styles from "./Header.module.scss";

const HomeHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.fogBackground}>
        <Image
          src="/assets/home/numbers/fog.webp"
          alt="fog"
          className={styles.fogImage}
          aria-hidden="true"
          priority
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.container}>
        <HeaderContent openModal={openModal} />

        {/* <ScrollIndicator /> */}

        <VipNumberModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default HomeHeader;
