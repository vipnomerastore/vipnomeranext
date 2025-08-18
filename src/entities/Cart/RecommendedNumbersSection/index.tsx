import { memo, useEffect, useState, useCallback } from "react";
import Image from "next/image";

import { NumberItem } from "@/store/cartStore";
import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";

import styles from "./RecommendedNumbersSection.module.scss";

const OPERATOR_ICONS: Record<string, string> = {
  МТС: "/assets/home/operators/mts.svg",
  Билайн: "/assets/home/operators/beeline.svg",
  Мегафон: "/assets/home/operators/megafon.svg",
  "Теле 2": "/assets/home/promotion/tele2.svg",
};

const RECOMMENDED_LIMIT = 5;

const getOperatorIcon = (opState: string): string =>
  OPERATOR_ICONS[opState] || "/assets/home/operators/megafon.svg";

const formatPrice = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

interface NumberCardProps {
  number: NumberItem;
  onAdd: (item: NumberItem) => void;
}

const NumberCard = memo(({ number, onAdd }: NumberCardProps) => (
  <div className={styles.numberItem} key={number.id} role="listitem">
    <div className={styles.numberItemNumber}>
      <Image
        src={getOperatorIcon(number.operator!)}
        alt={`Логотип оператора ${number.operator}`}
        width={24}
        height={24}
        className={styles.numberItemNumberImg}
      />

      <p className={styles.numberItemNumberTitle}>{number.phone}</p>
    </div>

    <div className={styles.numberItemPrice}>
      <p className={styles.numberItemPriceTitle}>
        {formatPrice(number.price!)} ₽
      </p>

      <div className={styles.numberItemCredit}>
        <p className={styles.numberItemCreditTitle}>В рассрочку без банка</p>

        <div className={styles.numberItemCreditContent}>
          <Image
            src="/assets/home/numberList/percent.svg"
            alt="Процент"
            width={16}
            height={16}
            className={styles.numberItemCreditContentImg}
          />

          <p className={styles.numberItemCreditContentText}>
            {formatPrice(Math.floor(number.price! / 10))} ₽ x 10 мес
          </p>
        </div>
      </div>
    </div>

    <button
      className={styles.numberItemCart}
      onClick={() => onAdd(number)}
      aria-label={`Добавить номер ${number.phone} в корзину`}
    >
      <Image
        src="/assets/home/numberList/cart.svg"
        alt="Добавить в корзину"
        width={24}
        height={24}
      />
    </button>
  </div>
));

NumberCard.displayName = "NumberCard";

interface RecommendedNumbersSectionProps {
  onAddToCart: (item: NumberItem) => void;
}

interface RawNumberItem {
  documentId: string;
  phone?: string;
  number?: string;
  price?: number;
  part_price?: number;
  operator?: string;
  partner_price?: number;
  credit_month_count?: number;
  old_price?: number | null;
  currency?: string;
  region?: string[];
}

const RecommendedNumbersSection = memo(
  ({ onAddToCart }: RecommendedNumbersSectionProps) => {
    const [numbers, setNumbers] = useState<NumberItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const adaptNumberItem = (item: RawNumberItem): NumberItem => ({
      id: item.documentId,
      phone: item.phone || item.number || "",
      price: item.price || 0,
      part_price: item.part_price || 0,
      operator: item.operator || "",
      partner_price: item.partner_price || 0,
      credit_month_count: item.credit_month_count || 0,
      old_price: item.old_price || 0,
      currency: item.currency || "RUB",
      region: item.region || [],
      quantity: 1,
    });

    const fetchNumbers = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const pageSize = 100;
        let currentPage = 1;
        let allItems: RawNumberItem[] = [];
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

          if (meta) {
            totalPages = meta.pageCount;
          }

          allItems = [...allItems, ...pageData];
          currentPage++;
        } while (currentPage <= totalPages);

        const allData: NumberItem[] = allItems
          .map(adaptNumberItem)
          .slice(0, RECOMMENDED_LIMIT);

        setNumbers(allData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Не удалось загрузить номера: ${err.message}`);
        } else {
          setError("Не удалось загрузить номера: неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchNumbers();
    }, [fetchNumbers]);

    if (error) {
      return <p className={styles.error}>Ошибка: {error}</p>;
    }

    if (loading) {
      return <p className={styles.loading}>Загрузка...</p>;
    }

    return (
      <section className={styles.recommendWrapper}>
        <h2 className={styles.recommendTitle}>Рекомендуемые товары</h2>

        <div className={styles.recommendList} role="list">
          {numbers.map((number) => (
            <NumberCard key={number.id} number={number} onAdd={onAddToCart} />
          ))}
        </div>
      </section>
    );
  }
);

export default RecommendedNumbersSection;
