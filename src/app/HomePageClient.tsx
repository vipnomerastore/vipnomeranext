"use client";

import dynamic from "next/dynamic";

import Loader from "@/shared/ui/Loader";
import HomeHeader from "@/entities/Home/Header";
import HomePromotion from "@/entities/Home/Promotion";
import HomeFeature from "@/entities/Home/Feature";
import HomeCombination from "@/entities/Home/Combination";
import PhoneModalManager from "@/entities/Home/PhoneModal";

const HomeQuestion = dynamic(() => import("@/entities/Home/Question"), {
  loading: () => <Loader />,
});
const HomeReview = dynamic(() => import("@/entities/Home/Review"), {
  loading: () => <Loader />,
});
const HomeMap = dynamic(() => import("@/entities/Home/Map"), {
  loading: () => <Loader />,
});
const HomeNeWBanner = dynamic(() => import("@/entities/Home/NewBanner"), {
  loading: () => <Loader />,
});
const HomeGetNumber = dynamic(() => import("@/entities/Home/GetNumber"), {
  loading: () => <Loader />,
});
const HomeCreditBanner = dynamic(() => import("@/entities/Home/CreditBanner"), {
  loading: () => <Loader />,
});

import styles from "./Home.module.scss";

const HomePageClient = () => {
  return (
    <div className={styles.homeWrapper}>
      <HomeHeader />

      <HomeCombination />

      <HomeGetNumber />

      <HomeReview />

      <HomePromotion />

      <HomeNeWBanner />

      <HomeCreditBanner />

      <HomeFeature />

      <HomeQuestion />

      <HomeMap />

      <PhoneModalManager />
    </div>
  );
};

export default HomePageClient;
