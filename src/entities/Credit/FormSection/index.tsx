import { forwardRef, memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";

import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./FormSection.module.scss";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (isSubmitting) return;
      setIsSubmitting(true);

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
        setIsSubmitting(false);

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

        {/* <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            type="text"
            placeholder="Ваше ФИО"
            fullWidth
            aria-label="Full name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            autoComplete="off"
            error={errors.fullName}
          />

          <Input
            type="text"
            placeholder="Город"
            aria-label="City"
            name="city"
            fullWidth
            value={formData.city}
            onChange={handleInputChange}
            autoComplete="off"
            error={errors.city}
          />

          <MaskedInput
            fullWidth
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={errors.phoneNumber}
          />

          <div className={styles.formFooter}>
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />

            <Button variant="outline" arrow disabled={isSubmitting}>
              Отправить
            </Button>
          </div>
        </form> */}
      </div>
    </section>
  );
});

export default memo(FormSection);
