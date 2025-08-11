import { forwardRef, memo, useState, useCallback } from "react";
import { Checkbox } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MaskedInput from "react-text-mask";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";

import styles from "./FormSection.module.scss";
import Button from "@/shared/ui/Button";

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "12px",
  marginTop: "4px",
  marginBottom: "0",
  textAlign: "left" as const,
  width: "100%",
  minHeight: "1.2em",
};

const checkboxStyle = {
  color: "#fdfca4",
  "&.Mui-checked": { color: "#fdfca4" },
  width: 24,
  height: 24,
};

interface FormData {
  fullName: string;
  city: string;
  phoneNumber: string;
}

interface FormErrors {
  fullName?: string;
  city?: string;
  phoneNumber?: string;
  agreedToTerms?: string;
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

const FormSection = forwardRef<HTMLElement>((_, ref) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    city: "",
    phoneNumber: "+7 ",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "ФИО обязательно";

    if (!formData.city.trim()) newErrors.city = "Город обязателен";

    const cleanedPhone = formData.phoneNumber.replace(/\D/g, "");

    if (!cleanedPhone.match(/^7\d{10}$/))
      newErrors.phoneNumber = "Введите 10 цифр после +7";

    if (!agreedToTerms)
      newErrors.agreedToTerms = "Необходимо согласиться с условиями";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validateForm()) {
        toast.error("Пожалуйста, исправьте ошибки в форме", {
          duration: 4000,
          position: "top-right",
        });

        return;
      }

      try {
        const payload = {
          data: {
            fio: formData.fullName,
            city: formData.city,
            phone: formData.phoneNumber,
          },
        };

        await axios.post(`${SERVER_URL}/forma-rassrochkas`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        setFormData({ fullName: "", city: "", phoneNumber: "" });
        setAgreedToTerms(false);
        setErrors({});

        toast.success("Ваша заявка успешно отправлена!", {
          duration: 3000,
          position: "top-right",
        });

        router.push("/thank-you");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.error?.message || "Ошибка при отправке формы",
            { duration: 4000, position: "top-right" }
          );
        } else if (error instanceof Error) {
          toast.error(error.message, { duration: 4000, position: "top-right" });
        } else {
          toast.error("Неизвестная ошибка", {
            duration: 4000,
            position: "top-right",
          });
        }
      }
    },
    [formData, agreedToTerms, router]
  );

  return (
    <section id="form" ref={ref} className={styles.section}>
      <Toaster toastOptions={TOASTER_STYLE} />

      <Image
        src="/assets/credit/form-bg.svg"
        alt="Background for form section"
        width={800}
        height={600}
        className={styles.formbg}
        aria-hidden="true"
      />

      <div className={styles.sectionContent}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Хотите приобрести элитный номер с <br /> выгодой и без переплат?
          </h2>

          <p className={styles.subtitle}>
            Заполните форму заявки. Мы свяжемся с вами в ближайшее время для
            уточнения деталей.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.inputField}>
            <input
              type="text"
              placeholder="Ваше ФИО"
              aria-label="Full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              autoComplete="off"
            />

            {errors.fullName && (
              <p id="fullName-error" style={errorStyle}>
                {errors.fullName}
              </p>
            )}
          </div>

          <div className={styles.inputField}>
            <input
              type="text"
              placeholder="Город"
              aria-label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              autoComplete="off"
            />

            {errors.city && (
              <p id="city-error" style={errorStyle}>
                {errors.city}
              </p>
            )}
          </div>

          <div className={styles.inputField}>
            <MaskedInput
              mask={phoneMask}
              type="tel"
              placeholder="Номер телефона"
              aria-label="Phone number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={
                errors.phoneNumber ? "phoneNumber-error" : undefined
              }
            />

            {errors.phoneNumber && (
              <p id="phoneNumber-error" style={errorStyle}>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div className={styles.formFooter}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                sx={checkboxStyle}
                aria-label="Agree to privacy policy"
              />

              <p className={styles.checkboxText}>
                Отправляю форму, соглашаюсь с{" "}
                <Link href="/privacy-policy" className={styles.link}>
                  Политикой конфиденциальности
                </Link>
                и{" "}
                <Link href="/terms-of-use" className={styles.link}>
                  Пользовательским соглашением
                </Link>
              </p>
            </div>

            {errors.agreedToTerms && (
              <p id="agreedToTerms-error" style={errorStyle}>
                {errors.agreedToTerms}
              </p>
            )}

            <Button variant="outline" arrow>
              Отправить
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
});

export default memo(FormSection);
