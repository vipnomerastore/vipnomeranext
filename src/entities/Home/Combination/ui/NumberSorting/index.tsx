import { memo, useCallback, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import { getNumberTier } from "../NumberList/const";
import Menu from "@/shared/ui/Menu";
import styles from "./NumberSorting.module.scss";

interface GroupedNumbers {
  partner_price?: number;
  price?: number;
  credit_month_count?: number;
  part_price?: number;
  phones: string[];
}

const groupNumbers = (
  numbers: any[],
  isPartner: boolean
): Record<string, GroupedNumbers> => {
  return numbers.reduce<Record<string, GroupedNumbers>>((acc, item) => {
    const partnerPrice = String(item.partner_price);
    const userPrice = `${item.price}_${item.credit_month_count}`;

    const key = isPartner ? partnerPrice : userPrice;

    if (!acc[key]) {
      const partnerNumber = { partner_price: item.partner_price, phones: [] };
      const userNumber = {
        price: item.price,
        credit_month_count: item.credit_month_count,
        part_price: Math.round(item.part_price),
        phones: [],
      };

      acc[key] = isPartner ? partnerNumber : userNumber;
    }

    acc[key].phones.push(`${item.phone} ${item.operator}`);

    return acc;
  }, {});
};

const formatNumbersText = (
  grouped: Record<string, GroupedNumbers>,
  isPartner: boolean
): string => {
  return Object.values(grouped)
    .map((group) => {
      if (isPartner) {
        const priceFormatted =
          group.partner_price?.toLocaleString("ru-RU") || "";

        return `Цена партнёра ${priceFormatted} ₽\n${group.phones.join("\n")}`;
      } else {
        const priceFormatted = group.price?.toLocaleString("ru-RU") || "";
        const partPriceFormatted =
          group.part_price?.toLocaleString("ru-RU") || "";
        const formatedText = `Цена ${priceFormatted} ₽\nВ рассрочку ${partPriceFormatted}₽ x ${
          group.credit_month_count
        } мес\n${group.phones.join("\n")}`;

        return formatedText;
      }
    })
    .join("\n\n");
};

interface NumberSortProps {
  sortBy: string;
  order: "asc" | "desc" | "none";
  onSortChange: (sortBy: string, order: "asc" | "desc" | "none") => void;
  onReset: () => void;
  numbers?: any[];
  operator: string;
  setOperator: (value: string) => void;
  birthNumber: string;
  setBirthNumber: (value: string) => void;
  selectedTier: string;
  region?: string;
  setRegion?: (value: string) => void;
}

const NumberSort = (props: NumberSortProps) => {
  const {
    onReset,
    numbers = [],
    operator,
    setOperator,
    birthNumber,
    setBirthNumber,
    selectedTier,
  } = props;

  const { user } = useAuthStore();
  const isPartner = user?.role?.name === "Партнёр";
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filteredNumbers =
    selectedTier && selectedTier !== "all"
      ? numbers.filter((n) => getNumberTier(n.price || 0) === selectedTier)
      : numbers;

  const handleCopyNumbers = useCallback(async () => {
    const grouped = groupNumbers(filteredNumbers, isPartner);
    const numbersText = formatNumbersText(grouped, isPartner);

    try {
      await navigator.clipboard.writeText(numbersText);
    } catch (error) {
      console.log(error);
    }
  }, [filteredNumbers, isPartner]);

  return (
    <div className={styles.sorting}>
      <div className={styles.sortMenuContainer}>
        <button
          className={styles.sortMenuButton}
          onClick={() => setFiltersVisible(!filtersVisible)}
          aria-label="Открыть фильтры"
        >
          Все фильтры
        </button>

        <button
          className={styles.sortMenuButton}
          onClick={onReset}
          aria-label="Сбросить фильтр"
        >
          Сбросить фильтр
        </button>

        <button
          className={styles.copyButton}
          onClick={handleCopyNumbers}
          aria-label="Скопировать номера"
        >
          📋
        </button>
      </div>

      <div className={filtersVisible ? styles.filters : styles.filtersHidden}>
        <div className={styles.selectFilters}>
          <Menu
            value={operator}
            onChange={(opt) => setOperator(opt.value!)}
            options={[
              { label: "Все операторы", value: "Все операторы" },
              {
                value: "МТС",
                label: "МТС",
                icon: "/assets/home/operators/mts.svg",
              },
              {
                value: "Билайн",
                label: "Билайн",
                icon: "/assets/home/operators/beeline.svg",
              },

              {
                value: "Мегафон",
                label: "Мегафон",
                icon: "/assets/home/operators/megafon.svg",
              },
              {
                value: "Теле 2",
                label: "Теле 2",
                icon: "/assets/home/promotion/tele2.svg",
              },
            ]}
          />

          <Menu
            value={birthNumber}
            onChange={(opt) => setBirthNumber(opt.value!)}
            options={[
              { value: "Год рождения", label: "Год рождения" },
              { value: "1960-е", label: "1960-е" },
              { value: "1970-е", label: "1970-е" },
              { value: "1980-е", label: "1980-е" },
              { value: "1990-е", label: "1990-е" },
              { value: "2000-е", label: "2000-е" },
              { value: "2010-е", label: "2010-е" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(NumberSort);
