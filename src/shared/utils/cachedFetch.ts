// Утилита для кэшированных API запросов
export const cachedFetch = async (
  url: string,
  options: { revalidate?: number } = {}
) => {
  const { revalidate = 3600 } = options; // По умолчанию 1 час

  const response = await fetch(url, {
    next: { revalidate },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Предустановленные периоды кэширования
export const CACHE_TIMES = {
  STATIC: false, // Никогда не обновлять
  SHORT: 300, // 5 минут
  MEDIUM: 1800, // 30 минут
  LONG: 3600, // 1 час
  DAILY: 86400, // 24 часа
} as const;
