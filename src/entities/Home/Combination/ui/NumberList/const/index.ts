import { SxProps, Theme } from "@mui/material";

export const paginationStyle: SxProps<Theme> = {
  "& .MuiPaginationItem-root": {
    color: "#ffffff",
    backgroundColor: "transparent",
    border: "1px solid #333333",
    borderRadius: "10px",
    margin: "0 5px",
    minWidth: "40px",
    height: "40px",
    fontSize: "14px",
    fontWeight: "600",
    "&:hover": {
      backgroundColor: "rgba(253, 252, 164, 0.1)",
      borderColor: "#fdfca4",
    },
    "&.Mui-selected": {
      borderColor: "#fdfca4",
      "&:hover": {},
    },
  },
};

// Система tier'ов для номеровя
export enum NumberTier {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
  VIP = "vip",
}

export interface TierConfig {
  name: string;
  price: string;
  color: string;
  gradient: string;
  borderColor: string;
  shadowColor: string;
  sparkleColor: string;
  glowIntensity: number;
  animationDuration: string;
}

export const TIER_CONFIGS: Record<NumberTier, TierConfig> = {
  [NumberTier.BRONZE]: {
    name: "Бронза",
    price: "До 10 000 ₽",
    color: "#cd7f32",
    gradient: "linear-gradient(135deg, #cd7f32 0%, #b8860b 100%)",
    borderColor: "#cd7f32",
    shadowColor: "rgba(205, 127, 50, 0.3)",
    sparkleColor: "#ffd700",
    glowIntensity: 1,
    animationDuration: "2s",
  },
  [NumberTier.SILVER]: {
    name: "Серебро",
    price: "До 30 000 ₽",
    color: "#b9f2ff",
    gradient: "linear-gradient(135deg, #b9f2ff 0%, #e0ffff 100%)",
    borderColor: "#b9f2ff",
    shadowColor: "rgba(185, 242, 255, 0.7)",
    sparkleColor: "#e0ffff",
    glowIntensity: 3,
    animationDuration: "1.2s",
  },
  [NumberTier.GOLD]: {
    name: "Золото",
    price: "До 50 000 ₽",
    color: "#ffd700",
    gradient: "linear-gradient(135deg, #ffd700 0%, #ffa500 100%)",
    borderColor: "#ffd700",
    shadowColor: "rgba(255, 215, 0, 0.5)",
    sparkleColor: "#fff8dc",
    glowIntensity: 2,
    animationDuration: "1.5s",
  },
  [NumberTier.PLATINUM]: {
    name: "Платина",
    price: "До 150 000 ₽",
    color: "#e5e4e2",
    gradient: "linear-gradient(135deg, #e5e4e2 0%, #b3b6b7 100%)",
    borderColor: "#e5e4e2",
    shadowColor: "rgba(229, 228, 226, 0.4)",
    sparkleColor: "#b3b6b7",
    glowIntensity: 1.5,
    animationDuration: "1.8s",
  },
  [NumberTier.VIP]: {
    name: "VIP",
    price: "От 150 000 ₽",
    color: "#a259ff",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #a259ff 100%)",
    borderColor: "#a259ff",
    shadowColor: "rgba(162, 89, 255, 0.4)",
    sparkleColor: "#e6deff",
    glowIntensity: 2.5,
    animationDuration: "1.2s",
  },
};

export const TIER_EMOJI: Record<NumberTier, string> = {
  [NumberTier.BRONZE]: "",
  [NumberTier.SILVER]: "",
  [NumberTier.GOLD]: "",
  [NumberTier.PLATINUM]: "",
  [NumberTier.VIP]: "",
};

export const getNumberTier = (price: number): NumberTier => {
  if (price < 10000) return NumberTier.BRONZE;

  if (price < 30000) return NumberTier.SILVER;

  if (price < 50000) return NumberTier.GOLD;

  if (price < 150000) return NumberTier.PLATINUM;

  return NumberTier.VIP;
};

export const getTierConfig = (price: number): TierConfig => {
  const tier = getNumberTier(price);

  return TIER_CONFIGS[tier];
};

export const TIER_FILTER_OPTIONS = [
  { value: "all", label: "Все категории" },
  { value: NumberTier.BRONZE, label: "До 10 000 ₽" },
  { value: NumberTier.SILVER, label: "До 30 000 ₽" },
  { value: NumberTier.GOLD, label: "До 50 000 ₽" },
  { value: NumberTier.PLATINUM, label: "До 150 000 ₽" },
  { value: NumberTier.VIP, label: "От 150 000 ₽" },
];
