"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import PhoneDescriptionalContent from "./PhoneDescriptionalContent";
import { NumberItem } from "@/store/cartStore";

interface PhoneDescriptionalPageClientProps {
  defaultNumber?: NumberItem;
}

export default function PhoneDescriptionalPageClient({
  defaultNumber,
}: PhoneDescriptionalPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const isPartner = user?.role?.name === "Партнёр";

  // Определяем, пришел ли пользователь с главной страницы (т.е. нужна ли модалка)
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    // Если есть referrer и это главная страница, показываем как модалку
    const referrer = document.referrer;
    const isFromMainPage =
      referrer.includes(window.location.origin) &&
      (referrer.endsWith("/") || referrer.includes("/?"));

    // Или можно проверить наличие специального параметра modal=true
    const modalParam = searchParams.get("modal");

    setIsModal(isFromMainPage || modalParam === "true");
  }, [searchParams]);

  // Получаем данные номера из URL параметров
  const phoneParam = searchParams.get("phone");
  const priceParam = searchParams.get("price");
  const operatorParam = searchParams.get("operator");
  const regionParam = searchParams.get("region");
  const idParam = searchParams.get("id");

  // Мок-объект для fallback
  const mockNumber: NumberItem = defaultNumber || {
    id: idParam || "1",
    phone: phoneParam || "+7 (999) 123-45-67",
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

  const handleClose = () => {
    router.back();
  };

  const handleAddToCart = (item: NumberItem) => {
    const cartItem = {
      ...item,
      price: isPartner ? item.partner_price : item.price,
      quantity: 1,
    };

    const isAlreadyInCart = useCartStore
      .getState()
      .items.some((i) => i.phone === cartItem.phone);

    if (isAlreadyInCart) {
      return;
    }

    addItem(cartItem);

    router.push("/cart");
  };

  return (
    <PhoneDescriptionalContent
      number={mockNumber}
      isPartner={isPartner}
      onClose={isModal ? handleClose : undefined}
      isModal={isModal}
    />
  );
}
