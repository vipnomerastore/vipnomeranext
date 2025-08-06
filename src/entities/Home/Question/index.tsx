import { useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import QuestionAccordion from "./ui/QuestionAccordion";
import QuestionForm from "./ui/QuestionForm";
import { SERVER_URL } from "@/shared/api";

import styles from "./Question.module.scss";

export interface FormData {
  name: string;
  email: string;
  phone: string;
  question: string;
  agreedToTerms: boolean;
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

const HomeQuestion = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    question: "",
    agreedToTerms: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const router = useRouter();

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Имя обязательно";

    if (!formData.email.trim()) newErrors.email = "Email обязателен";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Неверный формат email";

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (!cleanPhone) newErrors.phone = "Телефон обязателен";
    else if (!/^7\d{10}$/.test(cleanPhone))
      newErrors.phone = "Введите 10 цифр после +7";

    if (!formData.question.trim()) newErrors.question = "Вопрос обязателен";

    if (!formData.agreedToTerms)
      newErrors.agreedToTerms = "Необходимо согласиться с условиями";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

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
        await axios.post(
          `${SERVER_URL}/forma-zadat-voproses`,
          {
            data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              question: formData.question,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          question: "",
          agreedToTerms: true,
        });

        setErrors({});

        toast.success("Ваш вопрос успешно отправлен!", {
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
    [formData, validateForm, router]
  );

  return (
    <div id="contacts" className={styles.questionWrapper}>
      <Toaster toastOptions={TOASTER_STYLE} />

      <div className={styles.question}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>Вопрос / Ответ</h2>
        </div>

        <div className={styles.questionContent}>
          <QuestionAccordion />

          <QuestionForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeQuestion;
