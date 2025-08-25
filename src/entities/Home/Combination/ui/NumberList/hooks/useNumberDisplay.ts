import { useMemo } from "react";

import { NumberItem } from "@/store/cartStore";
import {
  tierOrderForDisplay,
  defaultFilterValues,
  getNumberTier,
} from "../const";

interface UseNumberDisplayProps {
  sortedNumbers: NumberItem[];
  selectedTier: string;
  paginationValue: number;
  itemsPerPage: number;
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

export const useNumberDisplay = ({
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
}: UseNumberDisplayProps) => {
  // Filter numbers by selected tier
  const filteredNumbers = useMemo(() => {
    if (selectedTier === "all") return sortedNumbers;

    return sortedNumbers.filter(
      (n) => getNumberTier(n.price || 0) === selectedTier
    );
  }, [sortedNumbers, selectedTier]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage);

  // Check if filters are in default state
  const isDefaultFilters = useMemo(
    () =>
      sortBy === defaultFilterValues.sortBy &&
      order === defaultFilterValues.order &&
      operator === defaultFilterValues.operator &&
      region === defaultFilterValues.region &&
      (!bestNumber || bestNumber.length === 0) &&
      birthNumber === defaultFilterValues.birthNumber &&
      (!filterNumber || filterNumber.every((n) => n === "")) &&
      (!filterPrice ||
        (filterPrice[0] === defaultFilterValues.minPrice &&
          filterPrice[1] === defaultFilterValues.maxPrice)) &&
      filterActiveMaskTab === defaultFilterValues.activeMaskTab,
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

  // Calculate displayed numbers with tier priority on first page
  const displayedNumbers = useMemo(() => {
    if (selectedTier === "all" && paginationValue === 1 && isDefaultFilters) {
      const usedIds = new Set<string>();
      const tierNumbers: NumberItem[] = [];

      // Get one number from each tier for display priority
      tierOrderForDisplay.forEach((tier: any) => {
        const found = filteredNumbers.find(
          (n) => getNumberTier(n.price || 0) === tier && !usedIds.has(n.id)
        );

        if (found) {
          tierNumbers.push(found);
          usedIds.add(found.id);
        }
      });

      // Fill remaining slots with other numbers
      const restCount = itemsPerPage - tierNumbers.length;
      const rest = filteredNumbers.filter((n) => !usedIds.has(n.id));

      return [...tierNumbers, ...rest.slice(0, restCount)];
    }

    // Regular pagination
    const start = (paginationValue - 1) * itemsPerPage;
    return filteredNumbers.slice(start, start + itemsPerPage);
  }, [
    filteredNumbers,
    paginationValue,
    itemsPerPage,
    selectedTier,
    isDefaultFilters,
  ]);

  return {
    filteredNumbers,
    totalPages,
    isDefaultFilters,
    displayedNumbers,
  };
};
