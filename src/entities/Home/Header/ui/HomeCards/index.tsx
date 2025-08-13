import React from "react";
import styles from "./HomeCards.module.scss";
import Image from "next/image";

const cards = [
  {
    title: "Лучшие VIP номера недели",
    description: "Подборка лучших VIP номеров за эту неделю.",
  },
  {
    title: "Номера с золотыми комбинациями",
    description: "Редкие и запоминающиеся номера с комбинациями 777, 888, 999.",
  },
  {
    title: "Номера для бизнеса",
    description: "Престижные номера, которые легко запомнят ваши клиенты.",
  },
  {
    title: "Доступные красивые номера",
    description: "Красивые комбинации по доступной цене от 2 499 ₽.",
  },
  {
    title: "Эксклюзивные предложения",
    description: "Уникальные VIP номера в единственном экземпляре.",
  },
  {
    title: "Региональные номера",
    description: "Красивые номера с кодом вашего города или региона.",
  },
];

import { useRef, useEffect } from "react";

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
      {cards.map((card, idx) => (
        <div className={styles.card} key={idx}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDescription}>{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HomeCards;
