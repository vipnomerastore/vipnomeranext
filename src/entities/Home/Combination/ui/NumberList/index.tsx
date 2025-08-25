"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { NumberItem } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import TierStats from "../TierStats/TierStats";
import AddToCartModal from "../../../../../shared/ui/AddToCartModal";
import PhoneDescriptionModal from "@/app/phone-descriptional/PhoneDescriptionalClient";
import { useNumberDisplay } from "./hooks/useNumberDisplay";
import { useTierManagement } from "./hooks/useTierManagement";
import { NumberItemComponent } from "../NumberItem";
import { createNumberParams } from "./utils";
import Menu from "@/shared/ui/Menu";
import Pagination from "@/shared/ui/Pagination";
import styles from "./NumberList.module.scss";

interface NumberListProps {
  onSortChange: (sortBy: string, order: "asc" | "desc" | "none") => void;
  paginationValue: number;
  itemsPerPage: number;
  handlePaginationChange: (value: number) => void;
  sortedNumbers: NumberItem[];
  loading: boolean;
  error: string | null;
  showDescriptionModal: boolean;
  setShowDescriptionModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNumber: NumberItem | null;
  setSelectedNumber: React.Dispatch<React.SetStateAction<NumberItem | null>>;
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

  const { user } = useAuthStore();
  const router = useRouter();
  const isPartner = user?.role?.name === "Партнёр";

  const [openAddToCartModal, setOpenAddToCartModal] = useState(false);
  const [phone, setPhone] = useState<NumberItem | null>(null);

  // Custom hooks for logic separation
  const { displayedNumbers, totalPages } = useNumberDisplay({
    sortedNumbers,
    selectedTier,
    paginationValue,
    itemsPerPage,
    sortBy,
    order,
    operator,
    region,
    bestNumber,
    birthNumber,
    filterNumber,
    filterPrice,
    filterActiveMaskTab,
  });

  const { handleTierSelect } = useTierManagement({
    selectedTier,
    onTierSelect,
  });

  // Event handlers
  const handleNumberClick = useCallback(
    (numberItem: NumberItem) => {
      const params = createNumberParams(numberItem);
      router.push(`/?${params.toString()}`);
    },
    [router]
  );

  const handleAddToCart = useCallback((item: NumberItem) => {
    setPhone(item);
    setOpenAddToCartModal(true);
  }, []);

  // Render helpers
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

        <Menu
          sortBy={sortBy}
          order={order}
          onChange={(opt) => onSortChange(opt.sortBy!, opt.order!)}
          options={[
            { label: "По умолчанию", sortBy: "none", order: "none" },
            { label: "Сначала дешевле", sortBy: "price", order: "asc" },
            { label: "Сначала дороже", sortBy: "price", order: "desc" },
          ]}
        />
      </div>

      <div className={styles.numberList}>
        {loading
          ? numberListLoader
          : error
          ? errorMessage
          : displayedNumbers.length === 0
          ? noResultsMessage
          : displayedNumbers.map((numberItem) => (
              <NumberItemComponent
                key={numberItem.id}
                numberItem={numberItem}
                isPartner={isPartner}
                onNumberClick={handleNumberClick}
                onAddToCart={handleAddToCart}
              />
            ))}
      </div>

      {sortedNumbers.length > 0 && (
        <div className={styles.paginationContainer}>
          <Pagination
            page={paginationValue}
            onChange={(value: number) => handlePaginationChange(value)}
            count={totalPages}
          />
        </div>
      )}

      {showDescriptionModal && selectedNumber && (
        <div>
          <PhoneDescriptionModal
            number={selectedNumber}
            isPartner={isPartner}
            onClose={() => setShowDescriptionModal(false)}
          />
        </div>
      )}

      <AddToCartModal
        isOpen={openAddToCartModal}
        onClose={() => setOpenAddToCartModal(false)}
        item={phone}
      />
    </div>
  );
});

export default NumberList;
