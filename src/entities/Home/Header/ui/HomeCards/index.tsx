import { useRef, useEffect, useState } from "react";
import Image from "next/image";

import styles from "./HomeCards.module.scss";
import EsimModal from "../EsimModal";

const HomeCards = () => {
  const [openEsimModal, setOpenEsimModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove("dragging");
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("dragging");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;

      e.preventDefault();

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className={styles.cardsContainer} ref={containerRef}>
        <div
          className={styles.card}
          onClick={() => {
            window.dispatchEvent(new CustomEvent("scrollToPromotion"));
          }}
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/assets/home/newBanner/icon-2.webp"
            alt="Hot offer"
            width={50}
            height={50}
            className={styles.cardIcon1}
          />
          <h3 className={styles.cardTitle}>АКЦИИ</h3>
          <p className={styles.cardDescription}>НА НОМЕРА</p>
        </div>

        <div
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("scrollToNewBanner", { detail: 1 })
            );
          }}
          className={styles.card}
        >
          <Image
            src="/assets/home/newBanner/icon-3.webp"
            alt="Daily offer"
            width={50}
            height={50}
            className={styles.cardIcon2}
          />
          <p className={styles.cardDescription}>VIP НОМЕРА СО СКИДКОЙ</p>
          <h3 className={styles.cardTitle}>50%</h3>
        </div>

        <div
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("scrollToNewBanner", { detail: 1 })
            );
          }}
          className={styles.card}
        >
          <Image
            src="/assets/home/promotion/hot.svg"
            alt="VIP discount"
            width={50}
            height={50}
            className={styles.cardIcon}
          />
          <p className={styles.cardDescription}>VIP НОМЕРА СО СКИДКОЙ</p>
          <h3 className={styles.cardTitle}>30%</h3>
        </div>

        <div
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("scrollToNewBanner", { detail: 3 })
            );
          }}
          className={styles.card}
        >
          <Image
            src="/assets/home/newBanner/icon-4.webp"
            alt="Business hit"
            width={50}
            height={50}
            className={styles.cardIcon}
          />
          <p className={styles.cardDescription}>ХИТ 2025</p>
          <h3 className={styles.cardTitle}>ДЛЯ БИЗНЕСА</h3>
        </div>

        <div
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("scrollToNewBanner", { detail: 4 })
            );
          }}
          className={styles.card}
        >
          <Image
            src="/assets/home/newBanner/icon-5.webp"
            alt="Pair offer"
            width={50}
            height={50}
            className={styles.cardIcon}
          />
          <p className={styles.cardDescription}>ПАКЕТ</p>
          <p className={styles.cardTitle}>2 НОМЕРА</p>
          <p className={styles.cardDescription}>ЗА ОДНУ ЦЕНУ</p>
        </div>

        <div
          className={styles.card}
          onClick={() => {
            window.dispatchEvent(new CustomEvent("scrollToCreditBanner"));
          }}
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/assets/home/newBanner/icon-1.webp"
            alt="Credit offer"
            width={50}
            height={50}
            className={styles.cardIcon}
          />
          <p className={styles.cardDescription}>НОМЕРА В РАССРОЧКУ</p>
          <h3 className={styles.cardTitle}>БЕЗ БАНКА</h3>
          <p className={styles.cardTitle}>0%</p>
        </div>

        <div onClick={() => setOpenEsimModal(true)} className={styles.card}>
          <Image
            src="/assets/home/esim/offer-card.svg"
            alt="eSIM"
            width={50}
            height={50}
            className={styles.cardIcon}
          />
          <p className={styles.cardDescription}>ОФОРМИТЕ</p>
          <h3 className={styles.cardTitle}>ESIM</h3>
          <p className={styles.cardTitle}>ЗА 5 МИНУТ</p>
        </div>
      </div>

      {openEsimModal && (
        <EsimModal
          isOpen={openEsimModal}
          onClose={() => setOpenEsimModal(false)}
        />
      )}
    </>
  );
};

export default HomeCards;
