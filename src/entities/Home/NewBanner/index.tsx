"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useForm } from "react-hook-form";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./NewBanner.module.scss";

interface NumberData {
  id: string;
  phone: string;
  region: string[];
  price?: number;
  old_price?: number | null;
  credit_month_count?: number;
  part_price?: number;
  partner_price?: number;
}

interface SlideData {
  title: string;
  timer?: string;
  discount?: string;
  numbers: NumberData[];
}

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

interface FormData {
  fio: string;
  email: string;
  phone: string;
  info: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  fio: "",
  email: "",
  phone: "",
  info: "",
  agreement: true,
};

const HomeNewBanner = () => {
  const [slidesData, setSlidesData] = useState<(SlideData | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [timeLeft, setTimeLeft] = useState(
    Array(6).fill({ hours: 0, minutes: 0, seconds: 0 })
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swiperRef = useRef<any>(null);

  const { control, reset, handleSubmit } = useForm({ defaultValues });

  const router = useRouter();

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const slideIdx = customEvent.detail ?? 0;
      const el = document.getElementById("action");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (swiperRef.current && swiperRef.current.slideTo) {
        swiperRef.current.slideTo(slideIdx, 500);
      }
    };
    window.addEventListener("scrollToNewBanner", handler as EventListener);
    return () =>
      window.removeEventListener("scrollToNewBanner", handler as EventListener);
  }, []);

  const addItem = useCartStore((state) => state.addItem);

  const fetchSlideData = useCallback(
    async (index: number, endpoint: string, count: number) => {
      try {
        const response = await fetch(
          `${SERVER_URL}/${endpoint}?pagination[page]=1&pagination[pageSize]=1&populate=numbers`,
          {
            next: { revalidate: CACHE_TIMES.LONG },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const data = responseData?.data || {};
        const numbers = (data.numbers || [])
          .slice(0, count)
          .map((item: any) => ({
            id: item.documentId,
            phone: item.phone || "+799 2222 7 222",
            price: item.price || 250000,
            old_price: item.old_price || 300000,
            credit_month_count: item.credit_month_count,
            part_price: item.part_price,
            partner_price: item.partner_price,
            region: item.region || [],
          }));

        setSlidesData((prev) => {
          const newArr = [...prev];

          newArr[index] = {
            title: data.title ?? `Слайд ${index + 1}`,
            timer: data.timer,
            discount: data.discount,
            numbers,
          };

          return newArr;
        });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  useEffect(() => {
    fetchSlideData(0, "banner-s-tajmerom", 1);
    fetchSlideData(1, "banner-s-4-nomerami", 4);
    fetchSlideData(2, "nomer-dnya", 1);
    fetchSlideData(3, "chasto-pokupayut", 2);
    fetchSlideData(4, "parnye-nomera", 2);
    fetchSlideData(5, "nomera-v-rezerv", 4);
  }, [fetchSlideData]);

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

  const onModalClose = () => {
    reset();
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const onModalOpen = () => {
    setIsModalOpen(false);
  };

  // Отправка формы модального окна
  const onSubmitHandler = async (data: { fio: string; phone: string }) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = { data: { name: data.fio, phone: data.phone } };

      await axios.post(`${SERVER_URL}/forma-s-banneras`, payload);

      onModalClose();
      router.push("/thank-you");
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAddToCart = (items: NumberData[]) => {
    items.forEach((item) => {
      const isAlreadyInCart = useCartStore
        .getState()
        .items.some((i) => i.phone === item.phone);

      if (isAlreadyInCart) {
        return;
      } else {
        addItem({
          ...item,
          quantity: 1,
          old_price: item.old_price || undefined, // Ensure compatibility with NumberItem type
        });
      }
    });
  };

  // Скролл к секции "combination"
  const handleCombinationScroll = () => {
    if (typeof document !== "undefined") {
      const section = document.getElementById("combination");

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const modalContent = isModalOpen ? (
    <div className={styles.modalOverlay} onClick={onModalOpen}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.modalTitle}>Заполните форму</h2>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className={styles.modalForm}
        >
          <Input
            control={control}
            name="fio"
            required
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput fullWidth name="phone" control={control} />

          <Checkbox name="agreement" control={control} />

          <Button
            type="submit"
            disabled={isSubmitting}
            fullWidth
            variant="outline"
          >
            Отправить
          </Button>
        </form>
      </div>
    </div>
  ) : null;

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  const Slide1 = () => {
    const data = slidesData[0];

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
                <p className={styles.timerText}>{formatTimeLeft(0)}</p>
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
                tabIndex={0}
                onClick={() => item && handleAddToCart([item])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    item && handleAddToCart([item]);
                  }
                }}
                aria-label={`Добавить номер ${item?.phone} в корзину`}
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
    const data = slidesData[1];

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
                      tabIndex={0}
                      onClick={() => handleAddToCart([item])}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleAddToCart([item]);
                        }
                      }}
                      aria-label={`Добавить номер ${item.phone} в корзину`}
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
    const data = slidesData[2];

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
                <p className={styles.timerText}>{formatTimeLeft(2)}</p>
              </div>
            </div>
            <p className={styles.thirdActionTitle}>{data.title}</p>

            <div className={styles.thirdActionPricesWrapper}>
              <p className={styles.firstPrice}>{item?.phone}</p>
              <div
                className={styles.thirdPriceWrapper}
                role="button"
                tabIndex={0}
                onClick={() => item && handleAddToCart([item])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    item && handleAddToCart([item]);
                  }
                }}
                aria-label={`Добавить номер ${item?.phone} в корзину`}
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
    const data = slidesData[3];

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
                      tabIndex={0}
                      onClick={() => handleAddToCart([item])}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleAddToCart([item]);
                        }
                      }}
                      aria-label={`Добавить номер ${item.phone} в корзину`}
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
    const data = slidesData[4];

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
                tabIndex={0}
                onClick={() => handleAddToCart(data.numbers)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleAddToCart(data.numbers);
                  }
                }}
                aria-label="Добавить пару номеров в корзину"
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

  const renderSlide = (index: number) => {
    switch (index) {
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
    }
  };

  return (
    <div id="action" className={styles.actionGalleryWrapper}>
      {modalRoot && createPortal(modalContent, modalRoot)}

      <div className={styles.actionWrapper}>
        <div className={styles.actionContent}>
          <Swiper
            modules={[FreeMode]}
            className={styles.mainSwiper}
            autoHeight={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
          >
            {[0, 1, 2, 3, 4].map((idx) => (
              <SwiperSlide key={idx}>{renderSlide(idx)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeNewBanner;
