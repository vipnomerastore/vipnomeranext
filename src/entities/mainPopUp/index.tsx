"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import MaskedInput from "@/shared/ui/MaskedInput";

import styles from "./mainpopUp.module.scss";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const showCount = useRef(0);

  const router = useRouter();

  const { control, reset, handleSubmit } = useForm({
    defaultValues: { name: "", phone: "+7 " },
  });

  const closePopup = () => {
    setIsOpen(false);
    reset();

    showCount.current = 1;
  };

  const onSubmitHandler = async (data: { name: string; phone: string }) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = {
        data: {
          name: data.name,
          phone: data.phone.replace(/[^\d+]/g, ""),
        },
      };

      await axios.post(`${SERVER_URL}/forma-modalkas`, payload);

      closePopup();
      router.push("/thank-you");
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
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

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className={styles.inputGroup}>
              <Input control={control} name="name" placeholder="Ваше имя" />

              <MaskedInput name="phone" control={control} />
            </div>

            <p className={styles.smallText}>*Скидка действует 24 часа</p>

            <Button type="submit" disabled={isSubmitting} variant="outline">
              Отправить
            </Button>
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
