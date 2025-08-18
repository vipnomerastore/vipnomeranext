"use client";

import React, { useState, useEffect } from "react";
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
  [phone: string]: {
    [duration: string]: number;
  };
}

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

interface FormData {
  name: string;
  phone: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  name: "",
  phone: "",
  agreement: true,
};

const HomeCreditBanner: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [priceData, setPriceData] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [bannerTitle, setBannerTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);

  const { control, handleSubmit, reset } = useForm({ defaultValues });

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmitHandler = async (data: { name: string; phone: string }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        data: {
          name: data.name,
          phone: data.phone.replace(/[^\d+]/g, ""),
        },
      };

      await axios.post(`${SERVER_URL}/forma-s-banneras`, payload);

      closeModal();
      router.push("/thank-you");
    } catch (error: unknown) {
      console.error("Ошибка:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBannerData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${SERVER_URL}/banner-v-rassrochku?populate=numbers`,
          {
            next: { revalidate: CACHE_TIMES.LONG },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!isMounted) return;

        const { title, numbers } = responseData.data;

        setBannerTitle(title);

        const numbersList: PhoneNumber[] = numbers.map((item: any) => ({
          phone: item.phone,
          id: item.documentId,
        }));

        const priceDataMap: PriceData = numbers.reduce(
          (acc: PriceData, item: any) => {
            const { phone, price, credit_month_count } = item;

            const durations: string[] = [];

            for (let i = 2; i <= credit_month_count; i += 2) {
              durations.push(`${i} мес`);
            }

            acc[phone] = durations.reduce(
              (durAcc: Record<string, number>, duration) => {
                durAcc[duration] = price;
                return durAcc;
              },
              {}
            );

            return acc;
          },
          {}
        );

        setPhoneNumbers(numbersList);
        setPriceData(priceDataMap);
      } catch (err) {
        if (!isMounted) return;

        setError("Не удалось загрузить данные. Попробуйте позже.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBannerData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      const el = document.getElementById("credit-banner");

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("scrollToCreditBanner", handler);

    return () => window.removeEventListener("scrollToCreditBanner", handler);
  }, []);

  const modalContent = (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.title}>Заполните форму</h2>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            name="fio"
            control={control}
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput name="phone" control={control} fullWidth />

          <Checkbox name="agreement" control={control} />

          <Button
            type="submit"
            disabled={isSubmitting}
            fullWidth
            variant="outline"
          >
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  );

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  return (
    <div id="credit-banner" className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.sixthAction}>
          <div className={styles.sixthActionContent}>
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

              <div className={styles.sixthActionHeader}>
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

              <p className={styles.sixthActionTitle}>
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

      {isModalOpen && modalRoot ? createPortal(modalContent, modalRoot) : null}
    </div>
  );
};

export default HomeCreditBanner;
