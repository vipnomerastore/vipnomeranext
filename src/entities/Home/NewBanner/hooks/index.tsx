import { useEffect, useState } from "react";
import Image from "next/image";

import { SlideData } from "..";
import Button from "@/shared/ui/Button";
import styles from "../NewBanner.module.scss";

const CartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 18"
    id="cart-2"
    className={styles.cartIcon}
  >
    <path strokeLinecap="round" />
    <path
      d="M13 12.167H4.292c-.121 0-.182 0-.228-.005a.832.832 0 0 1-.723-1.003c.02-.073.042-.146.068-.218.043-.128.064-.192.088-.25a1.666 1.666 0 0 1 .415-1.02c.062-.004.13-.004.264-.004h4.491"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.107 9.667H7.145c-1.013 0-1.52 0-1.91-.23a1.667 1.667 0 0 1-.435-.367c-.291-.348-.375-.848-.54-1.847-.17-1.013-.254-1.52-.053-1.894.083-.157.2-.294.34-.402.337-.259.85-.259 1.877-.259h5.546c1.209 0 1.813 0 2.058.395.244.396-.027.936-.567 2.017l-.372.745c-.449.897-.673 1.345-1.075 1.594-.404.249-.905.249-1.907.249z"
      strokeLinecap="round"
    />
    <path d="M12.167 15.5a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667zM5.5 15.5a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667z" />
  </svg>
);

interface UseSlideProps {
  slidesData: (SlideData | null)[];
  setIsModalOpen: (value: boolean) => void;
}

export const UseSlide = ({ slidesData, setIsModalOpen }: UseSlideProps) => {
  const [timeLeft, setTimeLeft] = useState(
    Array(6).fill({ hours: 0, minutes: 0, seconds: 0 })
  );

  // Скролл к секции "combination"
  const handleCombinationScroll = () => {
    if (typeof document !== "undefined") {
      const section = document.getElementById("combination");

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) =>
        prev.map((_, idx) => {
          const timerString = slidesData[idx]?.timer;
          const now = new Date();
          const end = timerString
            ? new Date(timerString)
            : new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              );

          const diff = end.getTime() - now.getTime();

          if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

          return {
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [slidesData]);

  // Форматирование таймера в строку
  const formatTimeLeft = (index: number) => {
    const t = timeLeft[index];

    return `${String(t.hours).padStart(2, "0")} ч ${String(t.minutes).padStart(
      2,
      "0"
    )} мин ${String(t.seconds).padStart(2, "0")} сек`;
  };

  const Slide1 = () => {
    const data = slidesData![0];

    if (!data) return <p>Загрузка...</p>;

    const item = data.numbers[0];

    return (
      <div className={styles.firstAction}>
        <div className={styles.firstActionContent}>
          <Image
            src="/assets/home/newBanner/icon-1.webp"
            alt="Фоновая иконка для первого слайда"
            width={300}
            height={300}
            className={styles.backIcon}
            aria-hidden="true"
            style={{ height: "auto" }}
          />

          <div className={styles.innerContent}>
            <div className={styles.firstActionHeader}>
              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
                <p className={styles.timerText}>Горячее предложение</p>
              </div>

              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />

                <p className={styles.timerText}>До смены номеров:</p>

                <p className={styles.timerText}>{formatTimeLeft!(0)}</p>
              </div>
            </div>

            <p className={styles.firstActionTitle}>
              {data.title ?? "VIP-НОМЕР"} СО СКИДКОЙ ДО {data.discount ?? "30"}{" "}
              %
            </p>

            <div className={styles.firstActionPricesWrapper}>
              <p className={styles.firstPrice}>{item?.phone ?? ""}</p>

              {item?.old_price && (
                <p className={styles.secondPrice}>
                  {item.old_price.toLocaleString("ru-RU", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₽
                </p>
              )}
              <div
                className={styles.thirdPriceWrapper}
                role="button"
                onClick={() => setIsModalOpen(true)}
              >
                {CartIcon}
                <p className={styles.thirdPriceTitle}>
                  {(item?.price ?? 250000).toLocaleString("ru-RU", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₽
                </p>
              </div>
            </div>

            <Button onClick={() => setIsModalOpen(true)}>
              <span>Забрать со скидкой</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const Slide2 = () => {
    const data = slidesData![1];

    if (!data) return <p>Загрузка...</p>;

    return (
      <div className={styles.secondAction}>
        <div className={styles.secondActionContent}>
          <div className={styles.innerContent}>
            <Image
              src="/assets/home/newBanner/icon-2.webp"
              alt="back"
              width={300}
              height={300}
              className={styles.backIcon}
              aria-hidden="true"
              style={{ height: "auto" }}
            />

            <div className={styles.secondActionHeader}>
              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
                <p className={styles.timerText}>Распродажа недели</p>
              </div>
            </div>

            <p className={styles.secondActionTitle}>{data.title}</p>

            <div className={styles.secondActionPrices}>
              {data.numbers.length ? (
                data.numbers.map((item, i) => (
                  <div key={i} className={styles.secondActionPricesWrapper}>
                    <p className={styles.firstPrice}>{item.phone}</p>
                    {item.old_price && (
                      <p className={styles.secondPrice}>
                        {item.old_price.toLocaleString("ru-RU", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ₽
                      </p>
                    )}
                    <div
                      className={styles.thirdPriceWrapper}
                      role="button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {CartIcon}

                      <p className={styles.thirdPriceTitle}>
                        {item.price?.toLocaleString("ru-RU", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ₽
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Нет данных</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Slide3 = () => {
    const data = slidesData![2];

    if (!data) return <p>Загрузка...</p>;

    const item = data.numbers[0];

    return (
      <div className={styles.thirdAction}>
        <div className={styles.thirdActionContent}>
          <Image
            src="/assets/home/newBanner/icon-3.webp"
            alt="back"
            width={400}
            height={400}
            className={styles.backIcon}
            aria-hidden="true"
          />

          <div className={styles.innerContent}>
            <div className={styles.thirdActionHeader}>
              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
                <p className={styles.timerText}>Предложение дня</p>
              </div>

              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />

                <p className={styles.timerText}>Предложение сгорит через:</p>

                <p className={styles.timerText}>{formatTimeLeft!(2)}</p>
              </div>
            </div>
            <p className={styles.thirdActionTitle}>{data.title}</p>

            <div className={styles.thirdActionPricesWrapper}>
              <p className={styles.firstPrice}>{item?.phone}</p>
              <div
                className={styles.thirdPriceWrapper}
                role="button"
                onClick={() => setIsModalOpen(true)}
              >
                {CartIcon}

                <p className={styles.thirdPriceTitle}>
                  {(item?.price ?? 250000).toLocaleString("ru-RU", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₽
                </p>
              </div>
            </div>

            <Button onClick={() => setIsModalOpen(true)}>
              Забрать со скидкой
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const Slide4 = () => {
    const data = slidesData![3];

    if (!data) return <p>Загрузка...</p>;

    return (
      <div className={styles.fourthAction}>
        <div className={styles.fourthActionContent}>
          <Image
            src="/assets/home/newBanner/icon-4.webp"
            alt="back"
            width={400}
            height={400}
            className={styles.backIcon}
            aria-hidden="true"
          />

          <div className={styles.innerContent}>
            <div className={styles.fourthActionHeader}>
              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
                <p className={styles.timerText}>Лидеры продаж</p>
              </div>
            </div>

            <p className={styles.fourthActionTitle}>{data.title}</p>

            <div className={styles.fourthActionPrices}>
              {data.numbers.length ? (
                data.numbers.map((item, i) => (
                  <div key={i} className={styles.fourthActionPricesWrapper}>
                    <p className={styles.firstPrice}>{item.phone}</p>

                    <div
                      className={styles.thirdPriceWrapper}
                      role="button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {CartIcon}

                      <p className={styles.thirdPriceTitle}>
                        {item.price?.toLocaleString("ru-RU", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ₽
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Нет данных</p>
              )}
            </div>

            <Button onClick={handleCombinationScroll}>
              Выбрать как у 1000+ клиентов
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const Slide5 = () => {
    const data = slidesData![4];

    if (!data) return <p>Загрузка...</p>;

    const [first, second] = data.numbers;

    const totalPrice = data.numbers.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );

    return (
      <div className={styles.fifthAction}>
        <div className={styles.fifthActionContent}>
          <Image
            src="/assets/home/newBanner/icon-5.webp"
            alt="back"
            width={300}
            height={300}
            className={styles.backIcon}
            aria-hidden="true"
          />

          <div className={styles.innerContent}>
            <div className={styles.fifthActionHeader}>
              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
                <p className={styles.timerText}>Парой дешевле</p>
              </div>

              <div className={styles.timer}>
                <Image
                  loading="lazy"
                  src="/assets/home/promotion/hot.svg"
                  alt="New banner hot image"
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
                <p className={styles.timerText}>Скидка 15%</p>
              </div>
            </div>
            <p className={styles.fifthActionTitle}>{data.title}</p>
            <div className={styles.fifthActionPrices}>
              <div
                className={styles.fifthActionPricesWrapper}
                key={first?.phone || "0"}
              >
                <p className={styles.fifthActionPriceTitle}>
                  {first?.phone || "-"}
                </p>
              </div>
              <p className={styles.firstPrice}>+</p>
              <div
                className={styles.fifthActionPricesWrapper}
                key={second?.phone || "1"}
              >
                <p className={styles.fifthActionPriceTitle}>
                  {second?.phone || "-"}
                </p>
              </div>
              <div className={styles.equal}>=</div>

              <div
                className={styles.thirdPriceWrapper}
                role="button"
                onClick={() => setIsModalOpen(true)}
              >
                {CartIcon}

                <p className={styles.thirdPriceTitle}>
                  {totalPrice.toLocaleString("ru-RU", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₽
                </p>
              </div>
            </div>

            <div className={styles.fifthActionBottom}>
              <p className={styles.fifthActionTitle}>
                ЭКОНОМИЯ{" "}
                <span className={styles.fifthActionTitleSpan}>15%</span>!
              </p>

              <Button onClick={() => setIsModalOpen(true)}>
                Хочу больше вариантов
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSlide = (slideIndex: number) => {
    switch (slideIndex) {
      case 0:
        return <Slide1 />;
      case 1:
        return <Slide2 />;
      case 2:
        return <Slide3 />;
      case 3:
        return <Slide4 />;
      case 4:
        return <Slide5 />;
      default:
        return <p>Нет данных</p>;
    }
  };

  return { renderSlide };
};
