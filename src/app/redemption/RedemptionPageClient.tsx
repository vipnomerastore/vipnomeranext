"use client";

import { memo } from "react";
import Image from "next/image";

import Breadcrumbs from "@/entities/Redemption/Breadcrumbs";
import BannerSection from "@/entities/Redemption/BannerSection";
import NumberCriteriaSection from "@/entities/Redemption/NumberCriteriaSection";
import SellFormSection from "@/entities/Redemption/SellFormSection";

import styles from "./Redemption.module.scss";

const RedemptionPageClient = memo(() => {
  return (
    <div className={styles.container}>
      <Image
        src="/assets/credit/bg3.webp"
        alt="Фон"
        className={styles.bg}
        fill
      />

      <Breadcrumbs />

      <BannerSection />

      <SellFormSection />

      <NumberCriteriaSection />
    </div>
  );
});

RedemptionPageClient.displayName = "RedemptionPageClient";

export default RedemptionPageClient;
