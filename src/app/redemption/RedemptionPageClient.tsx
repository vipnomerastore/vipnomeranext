"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Breadcrumbs from "@/entities/Redemption/Breadcrumbs";
import BannerSection from "@/entities/Redemption/BannerSection";
import FeaturesSection from "@/entities/Redemption/FeaturesSection";
import NumberCriteriaSection from "@/entities/Redemption/NumberCriteriaSection";
import SellFormSection from "@/entities/Redemption/SellFormSection";
import RecommendedNumbersSection from "@/entities/Redemption/RecommendedNumbersSection";
import CartModal from "@/entities/Redemption/CartModal";

import { NumberItem } from "@/store/cartStore";

import styles from "./Redemption.module.scss";

const RedemptionPageClient: React.FC = memo(() => {
  const router = useRouter();
  const [addedItem, setAddedItem] = useState<NumberItem | null>(null);

  const handleAddToCart = useCallback((item: NumberItem) => {
    setAddedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setAddedItem(null);
  }, []);

  const handleGoToCart = useCallback(() => {
    handleCloseModal();
    router.push("/cart");
  }, [router, handleCloseModal]);

  return (
    <div className={styles.container}>
      <Image
        src="/assets/credit/bg3.webp"
        alt="Фон"
        className={styles.bg3}
        priority
        fill
        style={{ objectFit: "cover" }}
      />

      <Breadcrumbs />

      <BannerSection />

      <FeaturesSection />

      <NumberCriteriaSection />

      <SellFormSection />

      <RecommendedNumbersSection onAddToCart={handleAddToCart} />

      <CartModal
        isOpen={!!addedItem}
        onClose={handleCloseModal}
        onGoToCart={handleGoToCart}
      />
    </div>
  );
});

RedemptionPageClient.displayName = "RedemptionPageClient";

export default RedemptionPageClient;
