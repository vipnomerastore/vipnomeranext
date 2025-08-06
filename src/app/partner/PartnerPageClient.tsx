"use client";

import { memo, useCallback, useRef } from "react";
import Breadcrumbs from "@/entities/Partner/Breadcrumbs";
import HeroSection from "@/entities/Partner/HeroSection";
import AdvantagesSection from "@/entities/Partner/AdvantagesSection";
import FormSection from "@/entities/Partner/FormSection";

import styles from "./Partner.module.scss";

const PartnerPageClient = memo(() => {
  const formSectionRef = useRef<HTMLElement>(null);

  const scrollToForm = useCallback(() => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={styles.container}>
      <Breadcrumbs />

      <HeroSection onScrollToForm={scrollToForm} />

      <AdvantagesSection />

      <FormSection ref={formSectionRef} />
    </div>
  );
});

PartnerPageClient.displayName = "PartnerPageClient";

export default PartnerPageClient;
