"use client";

import { memo, useCallback, useRef } from "react";
import Image from "next/image";

import Breadcrumbs from "@/entities/Credit/Breadcrumbs";
import HeroSection from "@/entities/Credit/HeroSection";
import StepsSection from "@/entities/Credit/StepsSection";
import FormSection from "@/entities/Credit/FormSection";

import styles from "./Credit.module.scss";

const CreditPageClient = memo(() => {
  const formSectionRef = useRef<HTMLElement>(null);

  const scrollToForm = useCallback(() => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={styles.container}>
      <Image
        src="/assets/credit/bg3.webp"
        alt="Background decoration 3"
        className={styles.bg3}
        priority
        fill
        style={{ objectFit: "cover" }}
      />

      <Breadcrumbs />

      <HeroSection onScrollToForm={scrollToForm} />

      <StepsSection />

      <FormSection ref={formSectionRef} />
    </div>
  );
});

CreditPageClient.displayName = "CreditPageClient";

export default CreditPageClient;
