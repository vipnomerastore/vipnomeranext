"use client";

import { forwardRef, memo, useState, useCallback, FormEvent } from "react";
import { Checkbox } from "@mui/material";
import Link from "next/link";
import Image from "next/image"; // <-- импортируем Image
import { useRouter } from "next/navigation";
import MaskedInput from "react-text-mask";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

// Пути к изображениям в public
const formBg = "/assets/credit/form-bg.svg";
const nextIcon = "/assets/home/question/next.svg";

import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";

import styles from "./FormSection.module.scss";

type FormData = {
  fullName: string;
  city: string;
  phoneNumber: string;
  agreedToTerms: boolean;
};

type Errors = {
  fullName?: string;
  city?: string;
  phoneNumber?: string;
  agreedToTerms?: string;
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

const FormSection = forwardRef<HTMLElement>((_, ref) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    city: "",
    phoneNumber: "",
    agreedToTerms: true,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = useCallback(() => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Введите ФИО";
    if (!formData.city.trim()) newErrors.city = "Введите город";
    if (!formData.phoneNumber.replace(/\D/g, "").match(/^7\d{10}$/)) {
      newErrors.phoneNumber = "Введите 10 цифр после +7";
    }
    if (!formData.agreedToTerms)
      newErrors.agreedToTerms = "Вы должны согласиться с политикой";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validate()) {
        toast.error("Пожалуйста, исправьте ошибки в форме.");
        return;
      }

      setIsSubmitting(true);

      try {
        await axios.post(`${SERVER_URL}/forma-stat-partnyoroms`, {
          data: {
            fio: formData.fullName,
            city: formData.city,
            phone: formData.phoneNumber,
          },
        });

        toast.success("Ваша заявка успешно отправлена!");
        setFormData({
          fullName: "",
          city: "",
          phoneNumber: "",
          agreedToTerms: false,
        });
        setErrors({});
        router.push("/thank-you");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.error?.message || "Ошибка при отправке формы."
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Неизвестная ошибка");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, router]
  );

  return (
    <section id="form" ref={ref} className={styles.section}>
      <Toaster toastOptions={TOASTER_STYLE} />

      <div className={styles.sectionContent}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Станьте нашим представителем и начните доходный бизнес без вложений
          </h2>

          <p className={styles.subtitle}>
            Заполните форму заявки, и мы свяжемся с вами для уточнения деталей
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputField}>
            <input
              type="text"
              name="fullName"
              placeholder="Ваше ФИО"
              value={formData.fullName}
              onChange={handleChange}
              aria-label="Full name"
              aria-invalid={!!errors.fullName}
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName}</span>
            )}
          </div>
          <div className={styles.inputField}>
            <input
              type="text"
              name="city"
              placeholder="Город"
              value={formData.city}
              onChange={handleChange}
              aria-label="City"
              aria-invalid={!!errors.city}
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.city && <span className={styles.error}>{errors.city}</span>}
          </div>
          <div className={styles.inputField}>
            <MaskedInput
              mask={phoneMask}
              type="tel"
              name="phoneNumber"
              placeholder="Номер телефона"
              value={formData.phoneNumber}
              onChange={handleChange}
              aria-label="Phone number"
              aria-invalid={!!errors.phoneNumber}
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.phoneNumber && (
              <span className={styles.error}>{errors.phoneNumber}</span>
            )}
          </div>
          <div className={styles.formFooter}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                sx={{
                  color: "#fdfca4",
                  "&.Mui-checked": { color: "#fdfca4" },
                  width: 24,
                  height: 24,
                }}
                aria-label="Agree to privacy policy"
                disabled={isSubmitting}
              />
              <p className={styles.checkboxText}>
                Отправляя форму, я соглашаюсь с{" "}
                <Link href="/policy-privacy" className={styles.link}>
                  Политикой конфиденциальности
                </Link>{" "}
                и{" "}
                <Link href="/terms-of-use" className={styles.link}>
                  Пользовательским соглашением
                </Link>
              </p>
            </div>
            {errors.agreedToTerms && (
              <span className={styles.error}>{errors.agreedToTerms}</span>
            )}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              <span>Отправить</span>
              {/* Используем Image для иконки кнопки */}
              <Image
                src={nextIcon}
                alt="Submit icon"
                width={20}
                height={20}
                loading="lazy"
              />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
});

FormSection.displayName = "FormSection";

export default memo(FormSection);
