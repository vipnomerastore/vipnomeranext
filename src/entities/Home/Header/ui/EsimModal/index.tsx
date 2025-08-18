"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { SERVER_URL } from "@/shared/api";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Button from "@/shared/ui/Button";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "../../Header.module.scss";

interface EsimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fio: string;
  phone: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  fio: "",
  phone: "+7 ",
  agreement: true,
};

const EsimModal = ({ isOpen, onClose }: EsimModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { control, reset, handleSubmit } = useForm({ defaultValues });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onSubmitHandler = async (data: FormData) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = {
        data: {
          name: data.fio,
          phone: data.phone,
        },
      };

      await axios.post(`${SERVER_URL}/forma-esim`, payload);

      onClose();
      reset();
      router.push("/thank-you");
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.title}>ПОЛУЧИТЬ ESIM НОМЕР</h2>

        <p className={styles.subtitle}>Оставь заявку на ESIM</p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            control={control}
            name="fio"
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput control={control} name="phone" fullWidth />

          <Checkbox control={control} name="agreement" />

          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting}
            fullWidth
          >
            Отправить
          </Button>
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
