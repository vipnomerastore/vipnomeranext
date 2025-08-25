import { useMemo } from "react";
import { NumberItem } from "@/store/cartStore";
import { regionEndingsMap } from "../const/regionEndingsMap";
import {
  matchesExactHierarchy,
  matchesMask,
  matchesBirthNumber,
  matchesBestNumberCombined,
} from "../utils/matchingUtils";

interface UseFilteredNumbersProps {
  allNumbers: NumberItem[];
  filterNumber: string[];
  filterPrice: [number, number];
  filterActiveMaskTab: 0 | 1;
  operator: string;
  birthNumber: string;
  bestNumber: string[];
  sortBy: string;
  order: "asc" | "desc" | "none";
  region: string;
}

export const useFilteredNumbers = ({
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
}: UseFilteredNumbersProps) => {
  // Filtered numbers with hierarchical search
  const filteredNumbers = useMemo(() => {
    const nonEmptyCriteriaLength = filterNumber.filter(Boolean).length;

    const filterItem = (item: NumberItem, exactMatch: boolean = true) => {
      const priceMatch =
        item.price! >= filterPrice[0] && item.price! <= filterPrice[1];
      const operatorMatch =
        operator === "Все операторы" || item.operator === operator;
      const birthMatch = matchesBirthNumber(item.phone!, birthNumber);
      const bestNumMatch = matchesBestNumberCombined(item.phone!, bestNumber);

      let numberMatch = true;
      if (filterNumber.some((n) => n !== "")) {
        if (filterActiveMaskTab === 0) {
          const matchLength = matchesExactHierarchy(item.phone!, filterNumber);
          numberMatch = exactMatch
            ? matchLength === nonEmptyCriteriaLength
            : matchLength >= 2;
        } else {
          numberMatch = matchesMask(item.phone!, filterNumber);
        }
      }

      return (
        priceMatch && operatorMatch && birthMatch && bestNumMatch && numberMatch
      );
    };

    // Try exact match first
    let results = allNumbers.filter((item) => filterItem(item, true));

    // If no exact matches and we have criteria, try partial matches
    if (results.length === 0 && filterNumber.some((n) => n !== "")) {
      const maxMatchLength = Math.max(
        ...allNumbers.map((item) =>
          matchesExactHierarchy(item.phone!, filterNumber)
        )
      );

      if (maxMatchLength >= 2) {
        results = allNumbers.filter((item) => {
          const matchLength = matchesExactHierarchy(item.phone!, filterNumber);
          return filterItem(item, false) && matchLength === maxMatchLength;
        });
      }
    }

    return results;
  }, [
    allNumbers,
    filterPrice,
    operator,
    birthNumber,
    bestNumber,
    filterNumber,
    filterActiveMaskTab,
  ]);

  // Sorted numbers with region priority
  const sortedNumbers = useMemo(() => {
    const endings = regionEndingsMap[region] || [];

    const prioritizedNumbers = [...filteredNumbers].sort((a, b) => {
      const aEndsWith = endings.some((end) =>
        a.phone?.replace(/\D/g, "").endsWith(end)
      );
      const bEndsWith = endings.some((end) =>
        b.phone?.replace(/\D/g, "").endsWith(end)
      );

      if (aEndsWith && !bEndsWith) return -1;
      if (!aEndsWith && bEndsWith) return 1;

      // fallback: регион приоритет
      const isAInRegion = a.region?.includes(region);
      const isBInRegion = b.region?.includes(region);

      if (isAInRegion && !isBInRegion) return -1;
      if (!isAInRegion && isBInRegion) return 1;

      return 0;
    });

    if (sortBy === "none" || order === "none") return prioritizedNumbers;

    return prioritizedNumbers.sort((a, b) => {
      if (sortBy === "price")
        return order === "asc" ? a.price! - b.price! : b.price! - a.price!;
      if (sortBy === "phone")
        return order === "asc"
          ? a.phone!.localeCompare(b.phone!)
          : b.phone!.localeCompare(a.phone!);
      return 0;
    });
  }, [filteredNumbers, sortBy, order, region]);

  return {
    filteredNumbers,
    sortedNumbers,
  };
};
