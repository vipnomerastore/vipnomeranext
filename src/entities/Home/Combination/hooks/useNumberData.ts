import { useState, useEffect, useCallback } from "react";
import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";
import type { NumberItem } from "@/store/cartStore";

export const useNumberData = () => {
  const [allNumbers, setAllNumbers] = useState<NumberItem[]>([]);
  const [tempNumbers, setTempNumbers] = useState<NumberItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapApiDataToNumberItem = useCallback(
    (item: any): NumberItem => ({
      id: item.documentId,
      phone: item.phone || item.number || "",
      price: item.price || 0,
      part_price: item.part_price || 0,
      operator: item.operator || "",
      partner_price: item.partner_price || 0,
      old_price: item.old_price,
      credit_month_count: item.credit_month_count || 0,
      currency: item.currency || "RUB",
      region: item.region || [],
      description: item.description || "",
    }),
    []
  );

  const fetchFirst20Numbers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${SERVER_URL}/katalog-nomerovs?pagination[page]=1&pagination[pageSize]=20`,
        { next: { revalidate: 1800 } } // 30 minutes cache
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const fetchedData = data.data.map(mapApiDataToNumberItem);
      setTempNumbers(fetchedData);
    } catch (err: any) {
      console.error("Error fetching first 20 numbers:", err);
      setError("Failed to fetch numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [mapApiDataToNumberItem]);

  const fetchRemainingNumbers = useCallback(async () => {
    setError(null);

    try {
      let allData: NumberItem[] = [];
      let page = 2;
      const pageSize = 100;

      while (true) {
        const res = await fetch(
          `${SERVER_URL}/katalog-nomerovs?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
          { next: { revalidate: CACHE_TIMES.MEDIUM } }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const resData = await res.json();
        const fetchedData = resData.data.map(mapApiDataToNumberItem);
        allData.push(...fetchedData);

        const totalPages = Math.ceil(resData.meta.pagination.total / pageSize);
        if (page >= totalPages) break;
        page++;
      }

      setAllNumbers([...tempNumbers, ...allData]);
      setTempNumbers([]);
    } catch (err: any) {
      console.error("Error fetching remaining numbers:", err);
      setError(
        "Failed to fetch all numbers. Some numbers may not be displayed."
      );
    }
  }, [tempNumbers, mapApiDataToNumberItem]);

  useEffect(() => {
    fetchFirst20Numbers();
  }, [fetchFirst20Numbers]);

  useEffect(() => {
    if (tempNumbers.length > 0) {
      fetchRemainingNumbers();
    }
  }, [tempNumbers, fetchRemainingNumbers]);

  return {
    allNumbers,
    tempNumbers,
    loading,
    error,
  };
};
