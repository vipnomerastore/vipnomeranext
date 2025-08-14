import React from "react";
import { useRef, useEffect } from "react";

import styles from "./HomeCards.module.scss";

const HomeCards = () => {
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
      const walk = (x - startX) * 1.2; // чувствительность
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
    <div className={styles.cardsContainer} ref={containerRef}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>РЕГИОНАЛЬНЫЕ</h3>
        <p className={styles.cardDescription}>НОМЕРА</p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>ЭКСКЛЮЗИВНЫЕ</h3>
        <p className={styles.cardDescription}>ПРЕДЛОЖЕНИЯ</p>
      </div>

      <div className={styles.card}>
        <p className={styles.cardDescription}>ДОСТУПНЫЕ</p>
        <h3 className={styles.cardTitle}>КРАСИВЫЕ НОМЕРА</h3>
      </div>

      <div className={styles.card}>
        <p className={styles.cardDescription}>НОМЕРА</p>
        <h3 className={styles.cardTitle}>ДЛЯ БИЗНЕСА</h3>
      </div>

      <div className={styles.card}>
        <p className={styles.cardDescription}>НОМЕРА</p>
        <p className={styles.cardTitle}>С ЗОЛОТЫМИ</p>
        <p className={styles.cardDescription}>КОМБИНАЦИЯМИ</p>
      </div>

      <div className={styles.card}>
        <p className={styles.cardDescription}>ЛУЧШИЕ</p>
        <h3 className={styles.cardTitle}>VIP НОМЕРА</h3>
        <p className={styles.cardDescription}>НЕДЕЛИ</p>
      </div>
    </div>
  );
};

export default HomeCards;
