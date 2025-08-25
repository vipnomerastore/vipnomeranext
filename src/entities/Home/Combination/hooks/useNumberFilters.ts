import { useState, useCallback } from "react";

export const useNumberFilters = () => {
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1000000000);

  // Draft states (for UI before applying)
  const [draftNumber, setDraftNumber] = useState(() => {
    const arr = Array(10).fill("");
    arr[0] = "9";
    return arr;
  });
  const [draftPrice, setDraftPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [draftActiveMaskTab, setDraftActiveMaskTab] = useState<0 | 1>(0);

  // Applied filter states
  const [filterNumber, setFilterNumber] = useState(Array(10).fill(""));
  const [filterPrice, setFilterPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [filterActiveMaskTab, setFilterActiveMaskTab] = useState<0 | 1>(0);

  // Other filters
  const [operator, setOperator] = useState("Все операторы");
  const [birthNumber, setBirthNumber] = useState("Год рождения");
  const [bestNumber, setBestNumber] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("none");
  const [order, setOrder] = useState<"asc" | "desc" | "none">("none");

  const applyFilters = useCallback(
    (number: string[], activeMaskTab: 0 | 1, price: [number, number]) => {
      setFilterNumber(number);
      setFilterActiveMaskTab(activeMaskTab);
      setFilterPrice(price);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setDraftActiveMaskTab(0);
    setDraftPrice([minPrice, maxPrice]);
    setDraftNumber(() => {
      const arr = Array(10).fill("");
      arr[0] = "9";
      return arr;
    });
    setSortBy("none");
    setOrder("none");
    setFilterNumber(Array(10).fill(""));
    setOperator("Все операторы");
    setFilterPrice([minPrice, maxPrice]);
    setFilterActiveMaskTab(0);
    setBirthNumber("Год рождения");
    setBestNumber([]);
  }, [minPrice, maxPrice]);

  const updatePriceRange = useCallback((min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setDraftPrice([min, max]);
  }, []);

  return {
    // Draft states
    draftNumber,
    setDraftNumber,
    draftPrice,
    setDraftPrice,
    draftActiveMaskTab,
    setDraftActiveMaskTab,

    // Applied filters
    filterNumber,
    filterPrice,
    filterActiveMaskTab,

    // Other filters
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

    // Price range
    minPrice,
    maxPrice,

    // Actions
    applyFilters,
    resetFilters,
    updatePriceRange,
  };
};
