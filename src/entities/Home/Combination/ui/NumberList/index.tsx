"use client";

import { memo, useMemo, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "react-hot-toast";
import Script from "next/script";
import Image from "next/image";

import { NumberItem, useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useHydration } from "@/hooks/useHydration";
import {
  paginationStyle,
  getTierConfig,
  NumberTier,
  getNumberTier,
} from "./const";
// import PhoneDescriptionModal from "@/pages/PhoneDescriptionModal";
import SparkleEffect from "./SparkleEffect";
import TierStats from "./TierStats";
import CustomizedMenus from "@/shared/ui/Menu";

import styles from "./NumberList.module.scss";
import AddToCartModal from "../AddToCartModal";

const operatorIcons: Record<string, string> = {
  МТС: "/assets/home/operators/mts.svg",
  Билайн: "/assets/home/operators/beeline.svg",
  Мегафон: "/assets/home/operators/megafon.svg",
  "Теле 2": "/assets/home/promotion/tele2.svg",
};

interface NumberListProps {
  onSortChange: (sortBy: string, order: "asc" | "desc" | "none") => void;

  paginationValue: number;
  itemsPerPage: number;
  handlePaginationChange: (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => void;
  sortedNumbers: NumberItem[];
  loading: boolean;
  error: string | null;
  showDescriptionModal: boolean;
  setShowDescriptionModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNumber: NumberItem | null;
  setSelectedNumber: React.Dispatch<React.SetStateAction<NumberItem | null>>;
  onOpenDescription: (item: NumberItem) => void;
  onCloseDescription: () => void;
  selectedTier: string;
  onTierSelect: (tier: string) => void;
  sortBy: string;
  order: "asc" | "desc" | "none";
  operator: string;
  region: string;
  bestNumber: string[];
  birthNumber: string;
  filterNumber: string[];
  filterPrice: [number, number];
  filterActiveMaskTab: 0 | 1;
}

const NumberList: React.FC<NumberListProps> = memo((props) => {
  const {
    paginationValue,
    itemsPerPage,
    handlePaginationChange,
    sortedNumbers,
    loading,
    error,
    showDescriptionModal,
    setShowDescriptionModal,
    selectedNumber,
    onCloseDescription,
    selectedTier,
    onTierSelect,
    sortBy,
    operator,
    region,
    bestNumber,
    birthNumber,
    filterNumber,
    filterPrice,
    filterActiveMaskTab,
    onSortChange,
    order,
  } = props;

  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPartner = user?.role?.name === "Партнёр";

  const [openAddToCartModal, setOpenAddToCartModal] = useState(false);
  const [phone, setPhone] = useState<NumberItem | null>(null);

  // Мемоизируем possibleTiers чтобы избежать пересоздания на каждом рендере
  const possibleTiers = useMemo(
    () => Object.values(NumberTier).map((t) => t.toLowerCase()),
    []
  );

  useEffect(() => {
    const tierFromQuery = Array.from(searchParams.keys()).find(
      (key) =>
        possibleTiers.includes(key.toLowerCase()) &&
        searchParams.get(key) === ""
    );

    // Избегаем циклических обновлений - только если tier действительно отличается
    if (tierFromQuery && tierFromQuery !== selectedTier) {
      onTierSelect(tierFromQuery);
    } else if (
      Array.from(searchParams.keys()).length > 0 &&
      !tierFromQuery &&
      selectedTier !== "all"
    ) {
      onTierSelect("all");
    }
  }, [searchParams, onTierSelect, possibleTiers]); // Убираем selectedTier из зависимостей

  const filteredNumbers = useMemo(() => {
    if (selectedTier === "all") return sortedNumbers;

    return sortedNumbers.filter(
      (n) => getNumberTier(n.price || 0) === selectedTier
    );
  }, [sortedNumbers, selectedTier]);

  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage);

  const isDefaultFilters = useMemo(
    () =>
      sortBy === "none" &&
      order === "none" &&
      operator === "Все операторы" &&
      region === "Регионы" &&
      (!bestNumber || bestNumber.length === 0) &&
      birthNumber === "Год рождения" &&
      (!filterNumber || filterNumber.every((n) => n === "")) &&
      (!filterPrice ||
        (filterPrice[0] === 1000 && filterPrice[1] === 500000000)) &&
      filterActiveMaskTab === 0,
    [
      sortBy,
      order,
      operator,
      region,
      bestNumber,
      birthNumber,
      filterNumber,
      filterPrice,
      filterActiveMaskTab,
    ]
  );

  const displayedNumbers = useMemo(() => {
    if (selectedTier === "all" && paginationValue === 1 && isDefaultFilters) {
      const tiers = [
        NumberTier.BRONZE,
        NumberTier.SILVER,
        NumberTier.GOLD,
        NumberTier.PLATINUM,
        NumberTier.VIP,
      ];
      const usedIds = new Set<string>();
      const tierNumbers: NumberItem[] = [];

      tiers.forEach((tier) => {
        const found = filteredNumbers.find(
          (n) => getNumberTier(n.price || 0) === tier && !usedIds.has(n.id)
        );

        if (found) {
          tierNumbers.push(found);
          usedIds.add(found.id);
        }
      });

      const restCount = itemsPerPage - tierNumbers.length;
      const rest = filteredNumbers.filter((n) => !usedIds.has(n.id));

      return [...tierNumbers, ...rest.slice(0, restCount)];
    }

    const start = (paginationValue - 1) * itemsPerPage;

    return filteredNumbers.slice(start, start + itemsPerPage);
  }, [
    filteredNumbers,
    paginationValue,
    itemsPerPage,
    selectedTier,
    isDefaultFilters,
  ]);

  const handleAddToCart = useCallback(
    (item: NumberItem) => {
      // const cartItem = {
      //   id: item.id,
      //   phone: item.phone,
      //   price: isPartner ? item.partner_price : item.price,
      //   operator: item.operator,
      //   credit_month_count: item.credit_month_count,
      //   currency: item.currency,
      //   old_price: item.old_price,
      //   region: item.region,
      //   description: item.description,
      //   part_price: item.part_price,
      //   partner_price: item.partner_price,
      //   quantity: 1,
      // };

      // const isAlreadyInCart = useCartStore
      //   .getState()
      //   .items.some((i) => i.phone === cartItem.phone);

      // if (isAlreadyInCart) {
      //   toast.error(`Номер ${item.phone} уже в корзине!`, {
      //     duration: 6000,
      //     position: "top-right",
      //   });

      //   return;
      // }

      // addItem(cartItem);

      // toast.success(`Номер ${item.phone} добавлен в корзину!`, {
      //   duration: 3000,
      //   position: "top-right",
      // });

      // if (showDescriptionModal) {
      //   setShowDescriptionModal(false);
      //   router.push("/");
      // }

      setPhone(item);
      setOpenAddToCartModal(true);
    },
    [addItem, isPartner, router, setShowDescriptionModal, showDescriptionModal]
  );

  const getOperatorIcon = useCallback(
    (op: string) => operatorIcons[op] || "/assets/home/operators/megafon.svg",
    []
  );

  const handleTierSelect = useCallback(
    (tier: string) => {
      // Предотвращаем повторный вызов с тем же tier
      if (tier === selectedTier) return;

      // Применяем изменения с небольшой задержкой для плавности
      requestAnimationFrame(() => {
        onTierSelect(tier);
        const queryParam = tier !== "all" ? `?${tier.toLowerCase()}` : "";

        router.replace(queryParam, { scroll: false });
      });
    },
    [onTierSelect, router, selectedTier]
  );

  const renderNumberItem = (numberItem: NumberItem) => {
    const tierKey = getNumberTier(numberItem.price || 0);

    const priceTitleStyle = numberItem.old_price
      ? styles.numberItemPriceTitleGreen
      : styles.numberItemPriceTitle;

    const rowStyle = numberItem.old_price
      ? styles.numberAndPriceRowDiscount
      : styles.numberAndPriceRow;

    return (
      <div className={styles.numberWrapper} key={numberItem.id}>
        <div className={`${styles.numberItem} ${styles[tierKey]}`}>
          <SparkleEffect
            tierConfig={getTierConfig(numberItem.price || 0)}
            isVisible
            tierKey={tierKey}
          />

          <div className={rowStyle}>
            <div className={styles.numberItemNumber}>
              <Image
                src={getOperatorIcon(numberItem.operator!)}
                alt={`Логотип оператора ${numberItem.operator}`}
                className={styles.numberItemNumberImg}
                width={24}
                height={24}
                priority
              />

              <p className={styles.numberItemNumberTitle}>{numberItem.phone}</p>
            </div>

            {user?.role.name === "Партнёр" ? (
              <p className={styles.numberItemPriceTitlePartner}>
                {numberItem.price} ₽
              </p>
            ) : (
              <div className={styles.priceRowWithDiscount}>
                <p className={priceTitleStyle}>
                  {numberItem.price?.toLocaleString("ru-RU")} ₽
                </p>

                {numberItem.old_price && (
                  <>
                    <span className={styles.numberItemOldPrice}>
                      {numberItem.old_price.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className={styles.numberItemDiscountPercent}>
                      -
                      {Math.abs(
                        Math.round(
                          100 - (numberItem.price! / numberItem.old_price) * 100
                        )
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.installmentAndCartRow}>
            {user?.role.name === "Партнёр" ? (
              <div className={styles.numberItemCreditPartner}>
                <p className={styles.numberItemCreditTitle}>
                  Цена для партнера
                </p>

                <div className={styles.numberItemCreditContent}>
                  <Image
                    src="/assets/home/numberList/percent.svg"
                    alt="Иконка процента"
                    className={styles.numberItemCreditContentImg}
                    width={16}
                    height={16}
                  />
                  <p className={styles.numberItemCreditContentTextPartner}>
                    {numberItem.partner_price} ₽
                  </p>
                </div>
              </div>
            ) : numberItem.part_price ? (
              <div className={styles.numberItemCredit}>
                <p className={styles.numberItemCreditTitle}>
                  В рассрочку без банка
                </p>

                <div className={styles.numberItemCreditContent}>
                  <Image
                    src="/assets/home/numberList/percent.svg"
                    alt="Иконка процента"
                    className={styles.numberItemCreditContentImg}
                    width={16}
                    height={16}
                  />

                  <p className={styles.numberItemCreditContentText}>
                    {numberItem.part_price} x {numberItem.credit_month_count}{" "}
                    мес
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}

            <button
              type="button"
              className={styles.numberItemCart}
              onClick={() => handleAddToCart(numberItem)}
              aria-label={`Добавить номер ${numberItem.phone} в корзину`}
            >
              <Image
                src="/assets/home/numberList/cart.svg"
                alt="Иконка корзины"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const numberListLoader = (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} />
    </div>
  );

  const noResultsMessage = (
    <p className={styles.noResults}>По вашему запросу номеров не найдено.</p>
  );

  const errorMessage = <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.list}>
      <Script
        id="number-list-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Список номеров",
            itemListElement: displayedNumbers.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: item.phone,
                sku: item.id,
                offers: {
                  "@type": "Offer",
                  price: isPartner ? item.partner_price : item.price,
                  priceCurrency: "RUB",
                },
              },
            })),
          }),
        }}
      />

      {!loading && !error && sortedNumbers.length > 0 && (
        <div className={styles.categoriesRow}>
          <TierStats
            numbers={sortedNumbers}
            selectedTier={selectedTier}
            onTierSelect={handleTierSelect}
          />
        </div>
      )}

      <div className={styles.sortBy}>
        <p className={styles.sortByTitle}>Сортировать:</p>

        <CustomizedMenus
          sortBy={sortBy}
          order={order}
          onSortChange={onSortChange}
        />
      </div>

      <div className={styles.numberList}>
        {loading
          ? numberListLoader
          : error
          ? errorMessage
          : displayedNumbers.length === 0
          ? noResultsMessage
          : displayedNumbers.map(renderNumberItem)}
      </div>

      {sortedNumbers.length > 0 && (
        <div className={styles.paginationContainer}>
          <Pagination
            page={paginationValue}
            onChange={handlePaginationChange}
            count={totalPages}
            shape="rounded"
            hidePrevButton
            hideNextButton
            sx={paginationStyle}
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      )}

      {/* {showDescriptionModal && selectedNumber && (
        <div>
           <PhoneDescriptionModal
            number={selectedNumber}
            isPartner={isPartner}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
          /> 
        </div>
      )} */}

      <AddToCartModal
        isOpen={openAddToCartModal}
        onClose={() => setOpenAddToCartModal(false)}
        item={phone}
      />
    </div>
  );
});

export default NumberList;
