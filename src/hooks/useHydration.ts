import { useEffect, useState } from "react";

/**
 * Хук для определения, когда компонент гидратирован на клиенте.
 * Используется для безопасного доступа к window, document и другим клиентским API.
 */
export function useHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
