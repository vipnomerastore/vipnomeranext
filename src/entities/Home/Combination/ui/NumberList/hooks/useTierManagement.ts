import { useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { NumberTier } from "../const";

interface UseTierManagementProps {
  selectedTier: string;
  onTierSelect: (tier: string) => void;
}

export const useTierManagement = ({
  selectedTier,
  onTierSelect,
}: UseTierManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize possible tiers to avoid recreation on each render
  const possibleTiers = useMemo(
    () => Object.values(NumberTier).map((t) => t.toLowerCase()),
    []
  );

  // Sync tier selection with URL query parameters
  useEffect(() => {
    const tierFromQuery = Array.from(searchParams.keys()).find(
      (key) =>
        possibleTiers.includes(key.toLowerCase()) &&
        searchParams.get(key) === ""
    );

    // Avoid cyclical updates - only if tier actually differs
    if (tierFromQuery && tierFromQuery !== selectedTier) {
      onTierSelect(tierFromQuery);
    } else if (
      Array.from(searchParams.keys()).length > 0 &&
      !tierFromQuery &&
      selectedTier !== "all"
    ) {
      onTierSelect("all");
    }
  }, [searchParams, onTierSelect, possibleTiers]);

  // Handle tier selection with URL update
  const handleTierSelect = useCallback(
    (tier: string) => {
      // Prevent repeated calls with the same tier
      if (tier === selectedTier) return;

      // Apply changes with slight delay for smoothness
      requestAnimationFrame(() => {
        onTierSelect(tier);
        const queryParam = tier !== "all" ? `?${tier.toLowerCase()}` : "/";
        router.replace(queryParam, { scroll: false });
      });
    },
    [onTierSelect, router, selectedTier]
  );

  return {
    handleTierSelect,
  };
};
