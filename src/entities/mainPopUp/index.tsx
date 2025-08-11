import { useEffect, useState, useRef } from "react";
import MaskedInput from "react-text-mask";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";

import styles from "./mainpopUp.module.scss";

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

const CLOSE_SVG = (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="white"
      d="M23.361 21.15l-9.302-9.29 9.303-9.184.317-.317c.317-.422.422-.95.211-1.372-.211-.422-.529-.845-1.057-.95-.529-.106-1.057 0-1.586.528l-9.302 9.29-6.66-6.651L2.643.564C2.22.038 1.69-.068 1.163.038.634.142.21.565 0 1.092v.74c.106.422.423.738.74 1.055l9.09 9.079-9.09 9.078c-.317.317-.634.634-.74 1.056v.633c.211.634.529 1.056 1.163 1.267h.634c.423-.106.74-.422 1.057-.633l9.091-9.079 9.09 9.079c.318.316.53.527.952.633h.635l.21-.106c.53-.21.952-.738.952-1.372.106-.633-.105-.95-.422-1.372z"
    />
  </svg>
);

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "+7 " });
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const popupRef = useRef<HTMLDivElement>(null);
  const showCount = useRef(0);
  const router = useRouter();

  const closePopup = () => {
    setIsOpen(false);
    setFormData({ name: "", phone: "" });
    setErrors({ name: "", phone: "" });

    showCount.current = 1;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { name: "", phone: "" };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
      isValid = false;
    }

    const cleanedPhone = formData.phone.replace(/\D/g, "");

    if (!cleanedPhone) {
      newErrors.phone = "Телефон обязателен";
      isValid = false;
    } else if (!/^7\d{10}$/.test(cleanedPhone)) {
      newErrors.phone = "Введите 10 цифр после +7";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме", {
        duration: 4000,
        position: "top-right",
      });

      return;
    }

    try {
      await axios.post(`${SERVER_URL}/forma-modalkas`, {
        data: {
          name: formData.name,
          phone: formData.phone.replace(/[^\d+]/g, ""),
        },
      });

      setFormData({ name: "", phone: "" });

      toast.success("Ваш запрос успешно отправлен!", {
        duration: 3000,
        position: "top-right",
      });

      closePopup();

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

  useEffect(() => {
    if (showCount.current >= 1) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 60000);

    const handleOutsideClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.popup} role="dialog" aria-modal="true">
      <Toaster toastOptions={TOASTER_STYLE} />

      <div className={styles.popupWrapper}>
        <div className={styles.popupContent} ref={popupRef}>
          <button
            className={styles.closeButton}
            onClick={closePopup}
            aria-label="Закрыть"
            type="button"
          >
            {CLOSE_SVG}
          </button>
          <div className={styles.discountLabel}>
            <Image
              src="/assets/popup/gift.svg"
              width={24}
              height={24}
              alt="gift"
            />

            <p className={styles.discountText}>Скидка</p>
          </div>

          <h2 className={styles.title}>
            ОСТАВЬ ЗАЯВКУ ПРЯМО СЕЙЧАС И ПОЛУЧИ
            <br />
            <span className={styles.spantitle}>СКИДКУ 15% НА ЛЮБОЙ НОМЕР</span>
          </h2>

          <p className={styles.text}>Отправим предложение в WhatsApp</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.inputField}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ваше имя"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />

                {errors.name && (
                  <p className={styles.errorMessage} id="name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.inputField}>
                <MaskedInput
                  mask={phoneMask}
                  className={styles.input}
                  placeholder="Введите ваш номер"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  required
                />

                {errors.phone && (
                  <p className={styles.errorMessage} id="phone-error">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <p className={styles.smallText}>*Скидка действует 24 часа</p>

            <button type="submit" className={styles.submitButton}>
              Отправить
            </button>
          </form>

          <div className={styles.popupimg}>
            <Image
              src="/assets/popup/popup-img.webp"
              width={400}
              height={300}
              alt="WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
