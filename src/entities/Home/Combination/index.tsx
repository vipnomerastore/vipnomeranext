import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

import NumberSort from "./ui/NumberSorting";
import NumberList from "./ui/NumberList";
import Mask from "./ui/NumberMask";

import { NumberItem } from "@/store/cartStore";
import { useRegion } from "@/hooks/useRegion";
import { useNumberFilters } from "./hooks/useNumberFilters";
import { useNumberData } from "./hooks/useNumberData";
import { useFilteredNumbers } from "./hooks/useFilteredNumbers";
import styles from "./Combination.module.scss";

const ITEMS_PER_PAGE = 20;

const HomeCombination = () => {
  // Navigation and refs
  const { region } = useRegion();
  const router = useRouter();
  const params = useParams();
  const numberListRef = useRef<HTMLDivElement | null>(null);
  const urlPhone = typeof params.phone === "string" ? params.phone : "";

  // State management
  const [selectedTier, setSelectedTier] = useState("all");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<NumberItem | null>(null);
  const [paginationValue, setPaginationValue] = useState(1);

  // Custom hooks for data and filters
  const { allNumbers, tempNumbers, loading, error } = useNumberData();
  const {
    draftNumber,
    setDraftNumber,
    draftPrice,
    draftActiveMaskTab,
    setDraftActiveMaskTab,
    filterNumber,
    filterPrice,
    filterActiveMaskTab,
    operator,
    setOperator,
    birthNumber,
    setBirthNumber,
    bestNumber,
    setBestNumber,
    sortBy,
    setSortBy,
    order,
    setOrder,
    applyFilters,
    resetFilters,
    updatePriceRange,
  } = useNumberFilters();

  // Filtered and sorted numbers
  const { filteredNumbers, sortedNumbers } = useFilteredNumbers({
    allNumbers,
    filterNumber,
    filterPrice,
    filterActiveMaskTab,
    operator,
    birthNumber,
    bestNumber,
    sortBy,
    order,
    region,
  });

  // Update price range when data is loaded
  useEffect(() => {
    if (allNumbers.length > 0) {
      const prices = allNumbers.map((item) => item.price ?? 0);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      updatePriceRange(min, max);
    }
  }, [allNumbers, updatePriceRange]);

  // Modal management for phone descriptions
  useEffect(() => {
    if (urlPhone && allNumbers.length) {
      const found = allNumbers.find(
        (item) => item.phone?.replace(/\D/g, "") === urlPhone.replace(/\D/g, "")
      );

      if (found) {
        setSelectedNumber(found);
        setShowDescriptionModal(true);
      }
    } else {
      setShowDescriptionModal(false);
      setSelectedNumber(null);
    }
  }, [urlPhone, allNumbers]);

  // Event handlers
  const handleApplyFilter = useCallback(() => {
    applyFilters(draftNumber, draftActiveMaskTab, draftPrice);
    setPaginationValue(1);

    setTimeout(() => {
      if (numberListRef.current) {
        const top =
          numberListRef.current.getBoundingClientRect().top +
          window.pageYOffset -
          110;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 0);
  }, [draftNumber, draftActiveMaskTab, draftPrice, applyFilters]);

  const handleReset = useCallback(() => {
    resetFilters();
    setPaginationValue(1);
  }, [resetFilters]);

  const handlePaginationChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      setPaginationValue(value);
    },
    []
  );

  const handleSortChange = useCallback(
    (newSortBy: string, newOrder: "asc" | "desc" | "none") => {
      setSortBy(newSortBy);
      setOrder(newOrder);
    },
    [setSortBy, setOrder]
  );

  const handleTierSelect = useCallback((tier: string) => {
    setSelectedTier(tier);
    setPaginationValue(1);
  }, []);

  const numbersToDisplay = allNumbers.length > 0 ? sortedNumbers : tempNumbers;

  return (
    <div id="combination" className={styles.combinationWrapper}>
      <Mask
        activeMaskTab={draftActiveMaskTab}
        setActiveMaskTab={setDraftActiveMaskTab}
        number={draftNumber}
        setNumber={setDraftNumber}
        onApplyFilter={handleApplyFilter}
        bestNumber={bestNumber}
        setBestNumber={setBestNumber}
      />

      <NumberSort
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        onReset={handleReset}
        numbers={sortedNumbers}
        operator={operator}
        setOperator={setOperator}
        birthNumber={birthNumber}
        setBirthNumber={setBirthNumber}
        region={region}
        selectedTier={selectedTier}
      />

      <div ref={numberListRef}>
        <NumberList
          sortBy={sortBy}
          order={order}
          onSortChange={handleSortChange}
          paginationValue={paginationValue}
          itemsPerPage={ITEMS_PER_PAGE}
          handlePaginationChange={handlePaginationChange}
          sortedNumbers={numbersToDisplay}
          loading={loading}
          error={error}
          showDescriptionModal={showDescriptionModal}
          setShowDescriptionModal={setShowDescriptionModal}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          selectedTier={selectedTier}
          onTierSelect={handleTierSelect}
          operator={operator}
          region={region}
          bestNumber={bestNumber}
          birthNumber={birthNumber}
          filterNumber={filterNumber}
          filterPrice={filterPrice}
          filterActiveMaskTab={filterActiveMaskTab}
        />
      </div>
    </div>
  );
};

export default HomeCombination;
