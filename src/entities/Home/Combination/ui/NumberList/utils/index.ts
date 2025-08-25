import { NumberItem } from "@/store/cartStore";
import { operatorIcons, defaultOperatorIcon } from "../const";

/**
 * Get operator icon URL for given operator name
 */
export const getOperatorIcon = (operator: string): string => {
  return operatorIcons[operator] || defaultOperatorIcon;
};

/**
 * Calculate discount percentage between old and new price
 */
export const calculateDiscountPercentage = (
  currentPrice: number,
  oldPrice: number
): number => {
  return Math.abs(Math.round(100 - (currentPrice / oldPrice) * 100));
};

/**
 * Create URL search parameters for number item navigation
 */
export const createNumberParams = (numberItem: NumberItem): URLSearchParams => {
  return new URLSearchParams({
    id: numberItem.id,
    phone: numberItem.phone || "",
    price: numberItem.price?.toString() || "0",
    operator: numberItem.operator || "",
    region: numberItem.region.join(","),
    modal: "true", // Add parameter for modal mode
  });
};

/**
 * Format price with Russian locale
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("ru-RU");
};
