import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

import styles from "./Feature.module.scss";

const FEATURE_ITEMS = [
  {
    icon: "/assets/home/features/card.svg",
    goldIcon: "/assets/home/features/gold-card.svg",
    title: "Доступные цены для вас",
    description: "Лучшие предложения для любого бюджета",
  },
  {
    icon: "/assets/home/features/numbers.svg",
    goldIcon: "/assets/home/features/gold-numbers.svg",
    title: "Рассрочка на все номера",
    description: "От 7 банков-партнеров без переплат и первого взноса",
  },
  {
    icon: "/assets/home/features/lock.svg",
    goldIcon: "/assets/home/features/gold-lock.svg",
    title: "Надежность наше кредо",
    description: "На рынке услуг мобильной связи с 2018 года",
  },
  {
    icon: "/assets/home/features/horse.svg",
    goldIcon: "/assets/home/features/gold-horse.svg",
    title: "Быстрое оформление",
    description: "Получение номера в день заказа в любом городе",
  },
  {
    icon: "/assets/home/features/cash.svg",
    goldIcon: "/assets/home/features/gold-cash.svg",
    title: "Любые формы официальной оплаты",
    description: "Наличный и безналичный расчет",
  },
  {
    icon: "/assets/home/features/shield.svg",
    goldIcon: "/assets/home/features/gold-shield.svg",
    title: "Безопасность вашей покупки",
    description: "Возможна личная встреча и оплата по факту оформления",
  },
];

const FeatureCard = ({ item }: { item: (typeof FEATURE_ITEMS)[0] }) => (
  <div className={styles.cardWrapper}>
    <Image
      src={item.goldIcon}
      alt="goldIcon"
      width={80}
      height={80}
      className={styles.goldIcon}
      aria-hidden="true"
    />

    <div className={styles.card}>
      <Image
        src={item.icon}
        alt="card"
        width={60}
        height={60}
        className={styles.icon}
        aria-hidden="true"
      />

      <div className={styles.content}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDescription}>{item.description}</p>
      </div>
    </div>
  </div>
);

const HomeFeature = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Лучше условия для покупки красивого номера
          </h2>
        </div>

        <div className={styles.grid}>
          {FEATURE_ITEMS.map((item, index) => (
            <FeatureCard key={index} item={item} />
          ))}
        </div>

        <div className={styles.slider}>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 20 },
            }}
          >
            {FEATURE_ITEMS.map((item, index) => (
              <SwiperSlide key={index}>
                <FeatureCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <p className={styles.disclaimer}>*условия обсуждаются индивидуально</p>
      </div>
    </section>
  );
};

export default HomeFeature;
