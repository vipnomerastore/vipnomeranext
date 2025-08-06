import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import MaskedInput from "react-text-mask";
import Checkbox from "@mui/material/Checkbox";
import Image from "next/image";

import { CalendarIcon, CartIcon, SubmitArrowIcon } from "./const";
import PriceList from "./ui/PriceList";
import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";

import styles from "./CreditBanner.module.scss";
import { phoneMask } from "@/shared/const";

interface PhoneNumber {
  phone: string;
  id: string;
}

interface PriceData {
  [phone: string]: {
    [duration: string]: number;
  };
}

const checkboxStyle = {
  color: "#a0a0a0",
  padding: "4px",
  "&.Mui-checked": {
    color: "#fdfca4",
  },
  "& .MuiTouchRipple-root": {
    color: "#fdfca4",
  },
};

const TOASTER_STYLE = {
  style: {
    background: "#242423",
    color: "#fff",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "12px 16px",
  },
  success: { style: { borderLeft: "4px solid #d9ad49" } },
  error: { style: { borderLeft: "4px solid #ff6b6b" } },
};

const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");

  return /^\+?7\d{10}$/.test(cleaned);
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    agreed?: string;
  }>({});
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [priceData, setPriceData] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState("");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPhone("");
    setAgreed(true);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Имя обязательно для заполнения";

    if (!phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Введите 10 цифр после +7";
    }

    if (!agreed) {
      newErrors.agreed =
        "Необходимо согласиться с политикой конфиденциальности и пользовательским соглашением";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме", {
        duration: 4000,
        position: "top-right",
      });

      return;
    }

    try {
      const formData = {
        data: {
          name,
          phone: phone.replace(/[^\d+]/g, ""),
        },
      };

      await axios.post(`${SERVER_URL}/forma-s-banneras`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Заявка отправлена!", {
        duration: 3000,
        position: "top-right",
      });

      closeModal();
    } catch (err: any) {
      console.error("Ошибка при отправке формы:", err);
      toast.error(
        err.response?.data?.error?.message || "Ошибка при отправке формы",
        { duration: 4000, position: "top-right" }
      );
    }
  };

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
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
        toast.error("Ошибка при загрузке данных баннера", {
          duration: 4000,
          position: "top-right",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBannerData();

    return () => {
      isMounted = false;
    };
  }, []);

  const modalContent = (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <Toaster toastOptions={TOASTER_STYLE} />

      <div className={styles.modalContent} onClick={handleContentClick}>
        <button
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.title}>Заполните форму</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputField}>
            <input
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />

            {errors.name && (
              <p id="name-error" className={styles.errorMessage}>
                {errors.name}
              </p>
            )}
          </div>

          <div className={styles.inputField}>
            <MaskedInput
              mask={phoneMask}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="Номер телефона"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />

            {errors.phone && (
              <p id="phone-error" className={styles.errorMessage}>
                {errors.phone}
              </p>
            )}
          </div>

          <div className={styles.checkboxWrapper}>
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              sx={checkboxStyle}
            />

            <p className={styles.checkboxText}>
              Отправляя форму я соглашаюсь с{" "}
              <Link href="/privacy-policy" className={styles.link}>
                Политикой конфиденциальности
              </Link>{" "}
              и{" "}
              <Link href="/terms-of-use" className={styles.link}>
                Пользовательским соглашением
              </Link>
            </p>
          </div>

          {errors.agreed && (
            <p id="agreed-error" className={styles.errorMessage}>
              {errors.agreed}
            </p>
          )}

          <button type="submit" className={styles.submitButton}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  return (
    <div className={styles.wrapper}>
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

              <button className={styles.submitButton} onClick={openModal}>
                <span>Выбрать номер в рассрочку</span>
                <SubmitArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && modalRoot ? createPortal(modalContent, modalRoot) : null}
    </div>
  );
};

export default HomeCreditBanner;
