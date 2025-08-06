import { useState, useEffect } from "react";

// Простой хук для работы с регионом через cookies
export function useRegion() {
  const [region, setRegionState] = useState<string>("");

  // Функция для чтения cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

    return null;
  };

  // Функция для установки cookie
  const setCookie = (name: string, value: string, days: number = 30) => {
    if (typeof document === "undefined") return;

    const expires = new Date(Date.now() + days * 864e5).toUTCString();

    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  // Загружаем регион при монтировании
  useEffect(() => {
    const cookieRegion = getCookie("region");

    setRegionState(cookieRegion || "");
  }, []);

  // Функция для установки региона
  const setRegion = (newRegion: string) => {
    setRegionState(newRegion);
    setCookie("region", newRegion);
  };

  return {
    region,
    setRegion,
  };
}
