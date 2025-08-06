import { memo, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";

import styles from "./RecommendedNumbersSection.module.scss";

interface NumberItem {
  id: string;
  phone: string;
  price: number;
  operator: string;
  description: string;
  region: string[];
}

interface RecommendedNumbersSectionProps {
  onAddToCart: (item: NumberItem) => void;
}

const OPERATOR_ICONS: Record<string, string> = {
  МТС: "/assets/home/operators/mts.svg",
  Билайн: "/assets/home/operators/beeline.svg",
  Мегафон: "/assets/home/operators/megafon.svg",
  "Теле 2": "/assets/home/promotion/tele2.svg",
};

const getOperatorIcon = (opState: string): string => {
  return OPERATOR_ICONS[opState] || "/assets/home/operators/megafon.svg";
};

const RecommendedNumbersSection: React.FC<RecommendedNumbersSectionProps> =
  memo(({ onAddToCart }) => {
    const [numbers, setNumbers] = useState<NumberItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
          const response = await fetch(
            `${SERVER_URL}/katalog-nomerovs?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
            {
              next: { revalidate: CACHE_TIMES.MEDIUM },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          const pageData = responseData?.data || [];
          const meta = responseData?.meta?.pagination;
          if (meta) totalPages = meta.pageCount;

          allItems = [...allItems, ...pageData];
          currentPage++;
        } while (currentPage <= totalPages);

        const sliced = allItems
          .map((item: any) => ({
            id: item.documentId,
            phone: item.phone || item.number || "",
            price: item.price || 0,
            description: item.description || "",
            region: item.region,
            operator: item.operator || "",
          }))
          .slice(0, 5);

        setNumbers(sliced);
      } catch (err: any) {
        setError(`Не удалось загрузить номера: ${err.message || "Ошибка"}`);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchNumbers();
    }, [fetchNumbers]);

    if (error) {
      return (
        <section className={styles.recommendWrapper}>
          <p className={styles.error}>Ошибка: {error}</p>
          <button
            onClick={fetchNumbers}
            className={styles.retryButton}
            aria-label="Повторить загрузку номеров"
          >
            Повторить
          </button>
        </section>
      );
    }

    if (loading) {
      return (
        <section className={styles.recommendWrapper}>
          <div
            className={styles.loader}
            role="status"
            aria-live="polite"
            aria-label="Загрузка номеров"
          ></div>
        </section>
      );
    }

    return (
      <section className={styles.recommendWrapper}>
        <h2 className={styles.recommendTitle}>Рекомендуемые товары</h2>

        <div
          className={styles.recommendList}
          role="list"
          aria-label="Список рекомендуемых номеров"
        >
          {numbers.map((number) => (
            <div
              className={styles.numberItem}
              key={number.id}
              role="listitem"
              aria-label={`Номер телефона ${number.phone}, оператор ${
                number.operator
              }, цена ${number.price.toLocaleString("ru-RU")} рублей`}
            >
              <div className={styles.numberItemNumber}>
                <Image
                  loading="lazy"
                  src={getOperatorIcon(number.operator)}
                  alt={`Логотип оператора ${number.operator}`}
                  className={styles.numberItemNumberImg}
                  width={32}
                  height={32}
                />
                <p className={styles.numberItemNumberTitle}>{number.phone}</p>
              </div>

              <div className={styles.numberItemPrice}>
                <p className={styles.numberItemPriceTitle}>
                  {number.price.toLocaleString("ru-RU")} ₽
                </p>

                <div className={styles.numberItemCredit}>
                  <p className={styles.numberItemCreditTitle}>
                    В рассрочку без банка
                  </p>

                  <div className={styles.numberItemCreditContent}>
                    <Image
                      loading="lazy"
                      src="/assets/home/numberList/percent.svg"
                      alt="Процент"
                      className={styles.numberItemCreditContentImg}
                      width={16}
                      height={16}
                    />

                    <p className={styles.numberItemCreditContentText}>
                      {Math.floor(number.price / 10).toLocaleString("ru-RU")} ₽
                      x 10 мес
                    </p>
                  </div>
                </div>
              </div>

              <button
                className={styles.numberItemCart}
                onClick={() => onAddToCart(number)}
                aria-label={`Добавить номер ${number.phone} в корзину`}
                type="button"
              >
                <Image
                  loading="lazy"
                  src="/assets/home/numberList/cart.svg"
                  alt="Добавить в корзину"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  });

export default RecommendedNumbersSection;
