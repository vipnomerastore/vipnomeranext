import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import FormField from "../FormField";
import FormFooter from "../FormFooter";
import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";

import styles from "../../Header.module.scss";

interface EsimModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const EsimModal = ({ isOpen, onClose }: EsimModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Имя обязательно для заполнения";

    if (!phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else {
      const cleanedPhone = phone.replace(/\D/g, "");

      if (!/^7\d{10}$/.test(cleanedPhone)) {
        newErrors.phone = "Введите 10 цифр после +7";
      }
    }

    if (!agreed)
      newErrors.agreed =
        "Необходимо согласиться с политикой конфиденциальности и пользовательским соглашением";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме", {
        duration: 4000,
        position: "top-right",
      });

      return;
    }

    try {
      await axios.post(
        `${SERVER_URL}/forma-esim`,
        { data: { name, phone } },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Заявка отправлена!", {
        duration: 3000,
        position: "top-right",
      });

      setName("");
      setPhone("");
      setAgreed(true);
      setErrors({});
      onClose();
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
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="esim-modal-title"
    >
      <Toaster toastOptions={TOASTER_STYLE} />

      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 id="esim-modal-title" className={styles.title}>
          ПОЛУЧИТЬ ESIM НОМЕР
        </h2>

        <p className={styles.subtitle}>Оставь заявку на ESIM</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormField
            type="text"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            errorId="name-error"
          />

          <FormField
            type="tel"
            placeholder="Номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            errorId="phone-error"
            mask={phoneMask}
          />

          <FormFooter
            agreed={agreed}
            setAgreed={setAgreed}
            error={errors.agreed}
            errorId="agreed-error"
          />
        </form>
      </div>
    </div>
  );

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  return modalRoot ? createPortal(modalContent, modalRoot) : null;
};

export default EsimModal;
