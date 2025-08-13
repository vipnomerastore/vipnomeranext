"use client";

import { useState } from "react";
import Image from "next/image";

import HeaderContent from "./ui/HeaderContent";

import VipNumberModal from "./ui/VipNumberModal";

import styles from "./Header.module.scss";
import HomeCards from "./ui/HomeCards";

const HomeHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <HomeCards />

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

          <div className={styles.bannersContainer}>
            <div className={styles.banner}>
              <Image
                src="/og-image.jpg"
                alt="VIP номера со скидками"
                className={styles.bannerImage}
                priority
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                style={{ objectFit: "cover" }}
              />
              <div className={styles.bannerOverlay}>
                <h3 className={styles.bannerTitle}>Скидки до 90%</h3>
                <p className={styles.bannerText}>На все VIP номера</p>
              </div>
            </div>
            <div className={styles.banner}>
              <Image
                src="/og-image.jpg"
                alt="Лучшие телефонные номера"
                className={styles.bannerImage}
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                style={{ objectFit: "cover" }}
              />
              <div className={styles.bannerOverlay}>
                <h3 className={styles.bannerTitle}>Премиум номера</h3>
                <p className={styles.bannerText}>Эксклюзивная коллекция</p>
              </div>
            </div>
            <div className={styles.banner}>
              <Image
                src="/og-image.jpg"
                alt="Быстрая доставка номеров"
                className={styles.bannerImage}
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                style={{ objectFit: "cover" }}
              />
              <div className={styles.bannerOverlay}>
                <h3 className={styles.bannerTitle}>Скидки до 50%</h3>
                <p className={styles.bannerText}>По всей России</p>
              </div>
            </div>
          </div>

          {/* <ScrollIndicator /> */}

          <VipNumberModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
