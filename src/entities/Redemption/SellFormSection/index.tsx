import { memo, useState, useCallback } from "react";
import { Checkbox } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MaskedInput from "react-text-mask";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";

import styles from "./SellFormSection.module.scss";
import Button from "@/shared/ui/Button";

interface SellNumberItem {
  number: string;
  price: string;
}

interface FormData {
  name: string;
  contactPhone: string;
  operator: string;
  sellNumbers: SellNumberItem[];
  email: string;
  comment: string;
  agreedToTerms: boolean;
}

interface Errors {
  name?: string;
  contactPhone?: string;
  operator?: string;
  sellNumbers?: string;
  email?: string;
  agreedToTerms?: string;
  [key: string]: string | undefined;
}

function formatPrice(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

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

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "12px",
  marginTop: "4px",
  marginBottom: "0",
  textAlign: "left" as const,
  width: "100%",
  minHeight: "1.2em",
};

const SellFormSection: React.FC = memo(() => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contactPhone: "+7 ",
    operator: "",
    sellNumbers: [{ number: "", price: "" }],
    email: "",
    comment: "",
    agreedToTerms: true,
  });
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSellNumberChange = (
    index: number,
    field: "number" | "price",
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.sellNumbers];
      if (field === "price") {
        value = formatPrice(value);
      }

      updated[index] = { ...updated[index], [field]: value };

      return { ...prev, sellNumbers: updated };
    });
    setErrors((prev) => ({ ...prev, sellNumbers: undefined }));
  };

  const handleAddSellNumber = () => {
    setFormData((prev) => ({
      ...prev,
      sellNumbers: [...prev.sellNumbers, { number: "", price: "" }],
    }));
  };

  const handleRemoveSellNumber = (index: number) => {
    setFormData((prev) => {
      const updated = prev.sellNumbers.filter((_, i) => i !== index);

      return {
        ...prev,
        sellNumbers: updated.length ? updated : [{ number: "", price: "" }],
      };
    });
  };

  const validate = useCallback((): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Введите ваше имя";
    }

    const cleanedContactPhone = formData.contactPhone.replace(/\D/g, "");

    if (!cleanedContactPhone.match(/^7\d{10}$/)) {
      newErrors.contactPhone = "Введите 10 цифр после +7 для номера связи";
    }

    if (!formData.operator) {
      newErrors.operator = "Выберите оператора";
    }

    if (!formData.sellNumbers.length) {
      newErrors.sellNumbers = "Добавьте хотя бы один номер для продажи";
    } else {
      formData.sellNumbers.forEach((item, idx) => {
        const cleanedNumber = item.number.replace(/\D/g, "");

        if (!cleanedNumber.match(/^7\d{10}$/)) {
          newErrors[`sellNumbers_${idx}_number`] =
            "Введите 10 цифр после +7 для номера";
        }

        const priceDigits = item.price.replace(/\s/g, "");

        if (!priceDigits.trim() || isNaN(Number(priceDigits))) {
          newErrors[`sellNumbers_${idx}_price`] = "Введите корректную цену";
        }
      });
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms =
        "Вы должны согласиться с политикой конфиденциальности и пользовательским соглашением";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validate()) {
        toast.error("Пожалуйста, исправьте ошибки в форме.");
        return;
      }

      try {
        const sellNumberString = formData.sellNumbers
          .map((item) => `${item.number} ${item.price.replace(/\s/g, "")}₽`)
          .join(", ");

        const payload = {
          data: {
            name: formData.name,
            phone: formData.contactPhone,
            operator: formData.operator,
            sell_number: sellNumberString,
            email: formData.email,
            comment: formData.comment,
          },
        };

        await axios.post(`${SERVER_URL}/forma-srochnyj-vykups`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        setFormData({
          name: "",
          contactPhone: "",
          operator: "",
          sellNumbers: [{ number: "", price: "" }],
          email: "",
          comment: "",
          agreedToTerms: false,
        });
        setErrors({});
        router.push("/thank-you");
        toast.success("Ваша заявка успешно отправлена!");
      } catch (error: any) {
        console.error("Ошибка при отправке формы:", error);

        toast.error(
          error.response?.data?.error?.message ||
            "Ошибка при отправке формы. Попробуйте позже."
        );
      }
    },
    [formData, validate, router]
  );

  return (
    <section className={styles.formContainer}>
      <Toaster toastOptions={TOASTER_STYLE} />

      <h2 className={styles.formTitle}>Заполните форму для продажи номера</h2>

      <form
        className={styles.redemptionForm}
        onSubmit={handleSubmit}
        aria-label="Форма продажи номера"
      >
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            aria-label="Ваше имя"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span id="name-error" style={errorStyle}>
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <MaskedInput
            mask={phoneMask}
            type="tel"
            name="contactPhone"
            placeholder="Номер для связи"
            value={formData.contactPhone}
            onChange={handleChange}
            className={styles.input}
            aria-label="Телефон для связи"
            aria-invalid={!!errors.contactPhone}
            aria-describedby={
              errors.contactPhone ? "contactPhone-error" : undefined
            }
          />

          {errors.contactPhone && (
            <span id="contactPhone-error" style={errorStyle}>
              {errors.contactPhone}
            </span>
          )}
        </div>

        <div className={styles.operatorRow}>
          <div className={styles.inputWrapper}>
            <div className={styles.selectWrapper}>
              <select
                name="operator"
                className={`${styles.select} ${styles.operatorSelect}`}
                value={formData.operator}
                onChange={handleChange}
                aria-label="Выберите оператора"
                aria-invalid={!!errors.operator}
                aria-describedby={
                  errors.operator ? "operator-error" : undefined
                }
              >
                <option value="">Оператор</option>

                {["МТС", "Билайн", "Мегафон", "Теле 2"].map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            {errors.operator && (
              <span id="operator-error" style={errorStyle}>
                {errors.operator}
              </span>
            )}
          </div>
        </div>

        {/* Динамические номера для продажи */}
        {formData.sellNumbers.map((item, idx) => (
          <div
            className={styles.operatorRow}
            key={idx}
            style={{ alignItems: "center" }}
          >
            <div className={styles.inputWrapper} style={{ flex: 1 }}>
              <MaskedInput
                mask={phoneMask}
                type="tel"
                name={`sellNumber_${idx}`}
                placeholder="Номер для продажи"
                value={item.number}
                onChange={(e) =>
                  handleSellNumberChange(idx, "number", e.target.value)
                }
                className={styles.input}
                aria-label="Номер для продажи"
                aria-invalid={!!errors[`sellNumbers_${idx}_number`]}
                aria-describedby={
                  errors[`sellNumbers_${idx}_number`]
                    ? `sellNumbers_${idx}_number-error`
                    : undefined
                }
              />

              {errors[`sellNumbers_${idx}_number`] && (
                <span id={`sellNumbers_${idx}_number-error`} style={errorStyle}>
                  {errors[`sellNumbers_${idx}_number`]}
                </span>
              )}
            </div>

            <div
              className={styles.inputWrapper}
              style={{ flex: 1, position: "relative" }}
            >
              <input
                type="text"
                name={`sellPrice_${idx}`}
                placeholder="Цена"
                value={item.price}
                onChange={(e) =>
                  handleSellNumberChange(idx, "price", e.target.value)
                }
                className={styles.input}
                aria-label="Цена"
                aria-invalid={!!errors[`sellNumbers_${idx}_price`]}
                aria-describedby={
                  errors[`sellNumbers_${idx}_price`]
                    ? `sellNumbers_${idx}_price-error`
                    : undefined
                }
                style={{ paddingRight: 32 }}
              />

              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  pointerEvents: "none",
                }}
              >
                ₽
              </span>

              {errors[`sellNumbers_${idx}_price`] && (
                <span id={`sellNumbers_${idx}_price-error`} style={errorStyle}>
                  {errors[`sellNumbers_${idx}_price`]}
                </span>
              )}
            </div>

            {idx !== 0 && (
              <button
                type="button"
                onClick={() => handleRemoveSellNumber(idx)}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  color: "#ff6b6b",
                  fontSize: 32,
                  cursor: "pointer",
                }}
                aria-label="Удалить номер"
              >
                ×
              </button>
            )}

            {idx === 0 && (
              <button
                type="button"
                onClick={handleAddSellNumber}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  color: "#d9ad49",
                  fontSize: 32,
                  cursor: "pointer",
                }}
                aria-label="Добавить номер"
              >
                +
              </button>
            )}
          </div>
        ))}

        {errors.sellNumbers && (
          <span style={errorStyle}>{errors.sellNumbers}</span>
        )}

        <div className={styles.inputWrapper}>
          <input
            type="email"
            name="email"
            placeholder="Почта"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            aria-label="Электронная почта"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" style={errorStyle}>
              {errors.email}
            </span>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <textarea
            name="comment"
            placeholder="Комментарий"
            className={styles.textarea}
            rows={5}
            value={formData.comment}
            onChange={handleChange}
            aria-label="Комментарий"
          />
        </div>

        <div className={styles.bottom}>
          <div className={styles.checkboxContainer}>
            <Checkbox
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              sx={{
                color: "#fdfca4",
                "&.Mui-checked": { color: "#fdfca4" },
              }}
              aria-label="Согласие с политикой конфиденциальности"
            />
            <p className={styles.checkboxText}>
              Согласен с{" "}
              <Link href="/privacy-policy" className={styles.link}>
                Политикой конфиденциальности
              </Link>{" "}
              и{" "}
              <Link href="/terms-of-use" className={styles.link}>
                Пользовательским соглашением
              </Link>
            </p>
          </div>

          {errors.agreedToTerms && (
            <span id="agreedToTerms-error" style={errorStyle}>
              {errors.agreedToTerms}
            </span>
          )}

          <Button arrow variant="outline">
            Получить предложение
          </Button>
        </div>
      </form>
    </section>
  );
});

export default SellFormSection;
