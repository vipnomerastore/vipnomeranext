import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import MaskedInput from "react-text-mask";
import { Checkbox } from "@mui/material";

import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";
import { NumberItem } from "@/store/cartStore";

import styles from "./AddToCartModal.module.scss";

interface GetNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NumberItem | null;
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

const AddToCartModal = ({ isOpen, onClose, item }: GetNumberModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

    const payload = {
      data: {
        name,
        phone,
        email: "",
        city: "",
        street: "",
        podyezd: "",
        floor: "",
        apartment: "",
        comment: "",
        price: item?.price,
        payment: "",
        delivery: "",
        numbers: { connect: [{ documentId: item?.id }] },
      },
    };

    try {
      // await axios.post(
      //   `${SERVER_URL}/forma-s-banneras`,
      //   { data: { name, phone } },
      //   { headers: { "Content-Type": "application/json" } }
      // );

      await axios.post(`${SERVER_URL}/zayavkas`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Заявка отправлена!", {
        duration: 3000,
        position: "top-right",
      });

      setName("");
      setPhone("");
      setAgreed(true);
      setErrors({});
      onClose();

      router.push("/success-order");
      // router.push("/thank-you");
    } catch (error: any) {
      console.error("Ошибка при отправке формы:", error);

      toast.error(
        error.response?.data?.error?.message || "Ошибка при отправке формы",
        { duration: 4000, position: "top-right" }
      );
    }
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-number-modal-title"
    >
      <Toaster toastOptions={TOASTER_STYLE} />

      <div
        className={styles.modalContent}
        onClick={handleContentClick}
        tabIndex={-1}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 id="get-number-modal-title" className={styles.title}>
          Заполните форму
        </h2>

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
              className={styles.inputField}
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

  if (!modalRoot) {
    console.error("Modal root element not found");

    return null;
  }

  return createPortal(modalContent, modalRoot);
};

export default AddToCartModal;
