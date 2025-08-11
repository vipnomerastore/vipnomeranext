import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useHydration } from "../../../hooks/useHydration";

import { NumberItem, useCartStore } from "@/store/cartStore";
import { SERVER_URL } from "@/shared/api";

import styles from "./Promotion.module.scss";
import Button from "@/shared/ui/Button";

const operatorIcons: Record<string, string> = {
  МТС: "/assets/home/operators/mts.svg",
  Билайн: "/assets/home/operators/beeline.svg",
  Мегафон: "/assets/home/operators/megafon.svg",
  "Теле 2": "/assets/home/promotion/tele2.svg",
};

const getOperatorIcon = (operator: string) =>
  operatorIcons[operator] ?? "/assets/home/promotion/tele2.svg";

const HomePromotion = () => {
  const router = useRouter();
  const { addItem, lastAddedItem, clearLastAddedItem, items } = useCartStore();
  const isHydrated = useHydration();

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [allNumbers, setAllNumbers] = useState<NumberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNumbers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const pageSize = 100;
      let currentPage = 1;
      let allItems: any[] = [];
      let totalPages = 1;

      do {
        // Кэшированный API запрос с revalidate 30 минут
        const response = await fetch(
          `${SERVER_URL}/katalog-nomerovs?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
          {
            next: { revalidate: 1800 }, // 30 минут кэш
          }
        );
        const data = await response.json();

        const pageData = data?.data || [];
        const meta = data?.meta?.pagination;

        if (meta) totalPages = meta.pageCount;

        allItems = allItems.concat(pageData);
        currentPage++;
      } while (currentPage <= totalPages);

      const filtered = allItems
        .filter((item) => item.old_price != null)
        .slice(0, 30)
        .map((item) => ({
          id: item.documentId,
          phone: item.phone || item.number || "",
          price: item.price || 0,
          part_price: item.part_price || "",
          operator: item.operator || "",
          partner_price: item.partner_price || "",
          credit_month_count: item.credit_month_count || "",
          old_price: item.old_price || null,
          currency: item.currency || "₽",
          region: item.region || [],
        }));

      setAllNumbers(filtered);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error?.message || "Ошибка при отправке формы",
          { duration: 4000, position: "top-right" }
        );
      } else if (error instanceof Error) {
        toast.error(error.message, { duration: 4000, position: "top-right" });
      } else {
        toast.error("Неизвестная ошибка", {
          duration: 4000,
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNumbers();
  }, [fetchNumbers]);

  useEffect(() => {
    if (!isHydrated) return;

    // Инициализируем время сразу после гидратации
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isHydrated]);

  function calculateTimeLeft() {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const diff = endOfDay.getTime() - now.getTime();

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  const formattedTimeLeft = useMemo(() => {
    const fmt = (num: number) => String(num).padStart(2, "0");

    return `${fmt(timeLeft.hours)} ч ${fmt(timeLeft.minutes)} мин ${fmt(
      timeLeft.seconds
    )} сек`;
  }, [timeLeft]);

  const handleAddToCart = useCallback(
    (item: NumberItem) => {
      const isAlreadyInCart = items.some((i) => i.phone === item.phone);

      if (isAlreadyInCart) {
        toast.error(`Номер ${item.phone} уже в корзине!`, {
          duration: 6000,
          position: "top-right",
        });
        return;
      }

      addItem({ ...item, quantity: 1 });

      toast.success(`Номер ${item.phone} добавлен в корзину!`, {
        duration: 3000,
        position: "top-right",
      });
    },
    [addItem, items]
  );

  const handleCloseModal = () => clearLastAddedItem();

  const handleGoToCart = () => {
    clearLastAddedItem();
    router.push("/cart");
  };

  return (
    <div className={styles.PromotionWrapper}>
      <div className={styles.Promotion}>
        <div className={styles.header}>
          <div className={styles.PromotionTimer}>
            <p className={styles.timerTitle}>До смены номеров:</p>

            <div className={styles.timer}>
              <Image
                loading="lazy"
                src="/assets/home/promotion/hot.svg"
                alt="Promotional hot image"
                aria-hidden="true"
                width={24}
                height={24}
              />
              <p className={styles.timerText}>
                {isHydrated ? formattedTimeLeft : "-- ч -- мин -- сек"}
              </p>
            </div>
          </div>

          <p className={styles.PromotionTitle}>
            акции <span className={styles.PromotionTitleSpan}>на номера</span>
          </p>
        </div>

        <div className={styles.PromotionCarusels}>
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader} />
            </div>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : allNumbers.length === 0 ? (
            <p className={styles.noResults}>Номера не найдены.</p>
          ) : (
            <Swiper
              spaceBetween={20}
              modules={[Scrollbar]}
              slidesPerView={1.2}
              scrollbar={{ enabled: true, draggable: true }}
              grabCursor
              freeMode
              breakpoints={{
                480: { slidesPerView: 1.5, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2.5, spaceBetween: 20 },
                1024: { slidesPerView: 3.5, spaceBetween: 20 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {allNumbers.map((item) => (
                <SwiperSlide key={item.id}>
                  <article className={styles.PromotionCarusel}>
                    <div className={styles.PromotionCaruselTitle}>
                      <Image
                        loading="lazy"
                        src={getOperatorIcon(item.operator!)}
                        alt={`Логотип оператора ${item.operator}`}
                        width={32}
                        height={32}
                      />
                      <p className={styles.PromotionCaruselText}>
                        {item.phone}
                      </p>
                    </div>

                    <div className={styles.PromotionCaruselPrices}>
                      <p className={styles.PromotionCaruselPrice}>
                        {new Intl.NumberFormat("ru-RU").format(item.price || 0)}{" "}
                        ₽
                      </p>

                      {item.old_price && (
                        <p className={styles.PromotionCaruselOldPrice}>
                          {new Intl.NumberFormat("ru-RU").format(
                            item.old_price
                          )}{" "}
                          ₽
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleAddToCart(item)}
                      variant="outline"
                    >
                      В корзину
                    </Button>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {lastAddedItem && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.modalText}>Номер добавлен в корзину</p>

            <button className={styles.modalButton} onClick={handleGoToCart}>
              В корзину
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePromotion;
