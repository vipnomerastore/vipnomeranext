import { useEffect, useMemo, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import Image from "next/image";

import { useHydration } from "../../../hooks/useHydration";
import { NumberItem } from "@/store/cartStore";
import { SERVER_URL } from "@/shared/api";
import Button from "@/shared/ui/Button";
import AddToCartModal from "@/shared/ui/AddToCartModal";
import styles from "./Promotion.module.scss";

const operatorIcons: Record<string, string> = {
  МТС: "/assets/home/operators/mts.svg",
  Билайн: "/assets/home/operators/beeline.svg",
  Мегафон: "/assets/home/operators/megafon.svg",
  "Теле 2": "/assets/home/promotion/tele2.svg",
};

const getOperatorIcon = (operator: string) =>
  operatorIcons[operator] ?? operatorIcons["Теле 2"];

const HomePromotion = () => {
  const [openAddToCartModal, setOpenAddToCartModal] = useState(false);
  const [phone, setPhone] = useState<NumberItem>();
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
        const res = await fetch(
          `${SERVER_URL}/katalog-nomerovs?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
          { next: { revalidate: 1800 } }
        );

        const data = await res.json();
        const pageData = data?.data ?? [];
        const meta = data?.meta?.pagination;

        if (meta) totalPages = meta.pageCount;

        allItems.push(...pageData);
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
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке номеров");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNumbers();
  }, [fetchNumbers]);

  const calculateTimeLeft = useCallback(() => {
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
      hours: Math.floor((diff / 1000 / 60 / 60) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    return () => clearInterval(timer);
  }, [isHydrated, calculateTimeLeft]);

  const formattedTimeLeft = useMemo(() => {
    const pad = (num: number) => String(num).padStart(2, "0");

    return `${pad(timeLeft.hours)} ч ${pad(timeLeft.minutes)} мин ${pad(
      timeLeft.seconds
    )} сек`;
  }, [timeLeft]);

  useEffect(() => {
    const handler = () => {
      const el = document.getElementById("promotion");

      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("scrollToPromotion", handler);

    return () => window.removeEventListener("scrollToPromotion", handler);
  }, []);

  const handleOpenModal = useCallback((item: NumberItem) => {
    setPhone(item);
    setOpenAddToCartModal(true);
  }, []);

  return (
    <div id="promotion" className={styles.promotionWrapper}>
      <div className={styles.promotion}>
        <div className={styles.header}>
          <div className={styles.promotionTimer}>
            <p className={styles.timerTitle}>До смены номеров:</p>

            <div className={styles.timer}>
              <Image
                loading="lazy"
                src="/assets/home/promotion/hot.svg"
                alt=""
                width={24}
                height={24}
              />

              <p className={styles.timerText}>
                {isHydrated ? formattedTimeLeft : "-- ч -- мин -- сек"}
              </p>
            </div>
          </div>

          <p className={styles.promotionTitle}>
            акции <span className={styles.promotionTitleSpan}>на номера</span>
          </p>
        </div>

        <div className={styles.promotionCarusels}>
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
                480: { slidesPerView: 1.5 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3.5 },
                1200: { slidesPerView: 4 },
              }}
            >
              {allNumbers.map((item) => (
                <SwiperSlide key={item.id}>
                  <article className={styles.promotionCarusel}>
                    <div className={styles.promotionCaruselTitle}>
                      <Image
                        loading="lazy"
                        src={getOperatorIcon(item.operator!)}
                        alt="оператор"
                        width={32}
                        height={32}
                      />

                      <p className={styles.promotionCaruselText}>
                        {item.phone}
                      </p>
                    </div>

                    <div className={styles.promotionCaruselPrices}>
                      <p className={styles.promotionCaruselPrice}>
                        {new Intl.NumberFormat("ru-RU").format(item.price ?? 0)}{" "}
                        ₽
                      </p>

                      {item.old_price && (
                        <p className={styles.promotionCaruselOldPrice}>
                          {new Intl.NumberFormat("ru-RU").format(
                            item.old_price
                          )}{" "}
                          ₽
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleOpenModal(item)}
                      variant="outline"
                    >
                      Купить
                    </Button>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      <AddToCartModal
        isOpen={openAddToCartModal}
        onClose={() => setOpenAddToCartModal(false)}
        item={phone!}
      />
    </div>
  );
};

export default HomePromotion;
