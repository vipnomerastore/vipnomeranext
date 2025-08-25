"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { CalendarIcon, CartIcon } from "./const";
import PriceList from "./ui/PriceList";
import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./CreditBanner.module.scss";

interface PhoneNumber {
  phone: string;
  id: string;
}

interface PriceData {
  [phone: string]: { [duration: string]: number };
}

interface FormData {
  name: string;
  phone: string;
  agreement: boolean;
}

const defaultValues: FormData = { name: "", phone: "+7 ", agreement: true };

const DropdownArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    className={styles.arrow}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="#fdfca4"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2 4 6 8 10 4" />
  </svg>
);

const HomeCreditBanner: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [priceData, setPriceData] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [bannerTitle, setBannerTitle] = useState("");

  const router = useRouter();
  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues,
  });

  const openModal = () => setIsModalOpen(true);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    reset();
  }, [reset]);

  const onSubmitHandler = async (data: FormData) => {
    try {
      await axios.post(`${SERVER_URL}/forma-s-banneras`, {
        data: { fio: data.name, phone: data.phone.replace(/[^\d+]/g, "") },
      });

      closeModal();
      router.push("/thank-you");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBannerData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${SERVER_URL}/banner-v-rassrochku?populate=numbers`,
        {
          next: { revalidate: CACHE_TIMES.LONG },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const { title, numbers } = data.data;

      setBannerTitle(title);

      setPhoneNumbers(
        numbers.map((n: any) => ({ phone: n.phone, id: n.documentId }))
      );

      setPriceData(
        numbers.reduce((acc: PriceData, n: any) => {
          const durations: string[] = Array.from(
            { length: Math.floor(n.credit_month_count / 2) },
            (_, i) => `${(i + 1) * 2} мес`
          );

          acc[n.phone] = Object.fromEntries(durations.map((d) => [d, n.price]));

          return acc;
        }, {})
      );
    } catch {
      setError("Не удалось загрузить данные. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBannerData();
  }, [fetchBannerData]);

  useEffect(() => {
    const handler = () =>
      document
        .getElementById("credit-banner")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.addEventListener("scrollToCreditBanner", handler);

    return () => window.removeEventListener("scrollToCreditBanner", handler);
  }, []);

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  const modalContent = useMemo(
    () => (
      <div className={styles.modalOverlay} onClick={closeModal}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Закрыть"
          >
            ×
          </button>

          <h2 className={styles.title}>Заполните форму</h2>

          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className={styles.form}
          >
            <Input
              name="name"
              control={control}
              required
              placeholder="Введите ваше имя"
              fullWidth
            />
            <MaskedInput name="phone" control={control} fullWidth />

            <Checkbox name="agreement" control={control} />

            <Button
              type="submit"
              disabled={formState.isSubmitting}
              fullWidth
              variant="outline"
            >
              {formState.isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          </form>
        </div>
      </div>
    ),
    [closeModal, control, handleSubmit, formState]
  );

  return (
    <div id="credit-banner" className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.credit}>
          <div className={styles.creditContent}>
            <div className={styles.innerContent}>
              <Image
                src="/assets/home/newBanner/icon-2.webp"
                alt="icon2"
                width={300}
                height={300}
                className={styles.backIcon}
                aria-hidden="true"
                style={{ height: "auto" }}
              />

              <div className={styles.creditHeader}>
                <div className={styles.timer}>
                  <Image
                    src="/assets/home/promotion/hot.svg"
                    alt="hot"
                    width={16}
                    height={16}
                    aria-hidden="true"
                  />
                  <p className={styles.timerText}>Скоро в продаже</p>
                </div>
              </div>

              <p className={styles.creditTitle}>
                {bannerTitle ||
                  "РЕЗЕРВИРУЙТЕ ЭКСКЛЮЗИВНЫЙ НОМЕР ДО СТАРТА ПРОДАЖ"}
              </p>

              {isLoading ? (
                <p>Загрузка...</p>
              ) : error ? (
                <p className={styles.errorMessage}>{error}</p>
              ) : (
                <PriceList
                  phoneNumbers={phoneNumbers}
                  priceData={priceData}
                  styles={styles}
                  CalendarIcon={CalendarIcon}
                  CartIcon={CartIcon}
                  DropdownArrowIcon={DropdownArrowIcon}
                />
              )}

              <Button onClick={openModal}>Выбрать номер в рассрочку</Button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && modalRoot && createPortal(modalContent, modalRoot)}
    </div>
  );
};

export default HomeCreditBanner;
