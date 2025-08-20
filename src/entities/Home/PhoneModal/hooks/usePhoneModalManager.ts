"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NumberItem } from "@/store/cartStore";

export const usePhoneModalManager = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Состояние для модального окна
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<NumberItem | null>(null);

  // Проверяем URL параметры для открытия модального окна
  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    const modalParam = searchParams.get("modal");

    if (phoneParam && modalParam === "true") {
      const priceParam = searchParams.get("price");
      const operatorParam = searchParams.get("operator");
      const regionParam = searchParams.get("region");
      const idParam = searchParams.get("id");

      const phoneData: NumberItem = {
        id: idParam || "1",
        phone: phoneParam,
        price: priceParam ? parseInt(priceParam) : 10000,
        region: regionParam ? regionParam.split(",") : ["Москва"],
        old_price: 12000,
        part_price: 2500,
        partner_price: 9000,
        credit_month_count: 4,
        currency: "₽",
        description: "Красивый номер телефона",
        operator: operatorParam || "МТС",
      };

      setSelectedPhone(phoneData);
      setShowPhoneModal(true);
    } else if (!phoneParam || modalParam !== "true") {
      // Закрываем модалку если параметры изменились
      setShowPhoneModal(false);
      setSelectedPhone(null);
    }
  }, [searchParams]);

  const closeModal = () => {
    setShowPhoneModal(false);
    setSelectedPhone(null);
    // Убираем параметры из URL
    const url = new URL(window.location.href);
    url.searchParams.delete("phone");
    url.searchParams.delete("modal");
    url.searchParams.delete("price");
    url.searchParams.delete("operator");
    url.searchParams.delete("region");
    url.searchParams.delete("id");
    router.replace(url.pathname + (url.search ? url.search : ""));
  };

  return {
    showPhoneModal,
    selectedPhone,
    closeModal,
  };
};
