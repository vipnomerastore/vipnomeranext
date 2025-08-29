"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import PhoneDescriptionalContent from "./PhoneDescriptionalContent";
import { NumberItem } from "@/store/cartStore";

interface PhoneDescriptionalPageClientProps {
  defaultNumber?: NumberItem;
}

export default function PhoneDescriptionalPageClient({
  defaultNumber,
}: PhoneDescriptionalPageClientProps) {
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const isPartner = user?.role?.name === "Партнёр";

  useEffect(() => {
    const referrer = document.referrer;

    const isFromMainPage =
      referrer.includes(window.location.origin) &&
      (referrer.endsWith("/") || referrer.includes("/?"));

    const modalParam = searchParams.get("modal");

    setIsModal(isFromMainPage || modalParam === "true");
  }, [searchParams]);

  const phoneParam = searchParams.get("phone");
  const priceParam = searchParams.get("price");
  const operatorParam = searchParams.get("operator");
  const regionParam = searchParams.get("region");
  const idParam = searchParams.get("id");

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

  return (
    <PhoneDescriptionalContent
      number={mockNumber}
      isPartner={isPartner}
      onClose={isModal ? handleClose : undefined}
      isModal={isModal}
    />
  );
}
