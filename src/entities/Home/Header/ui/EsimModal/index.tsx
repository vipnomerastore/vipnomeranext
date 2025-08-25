"use client";

import { useEffect } from "react";
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
  const router = useRouter();
  const { control, reset, handleSubmit, formState } = useForm<FormData>({
    defaultValues,
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onSubmitHandler = async (data: FormData) => {
    try {
      await axios.post(`${SERVER_URL}/esims`, {
        data: { name: data.fio, phone: data.phone },
      });

      reset();
      onClose();
      router.push("/thank-you");
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.title}>Получить ESIM номер</h2>
        <p className={styles.subtitle}>Оставь заявку на ESIM</p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            control={control}
            name="fio"
            placeholder="Введите ваше имя"
            required
            fullWidth
          />

          <MaskedInput control={control} name="phone" fullWidth />

          <Checkbox control={control} name="agreement" />

          <Button
            type="submit"
            variant="outline"
            disabled={formState.isSubmitting}
            fullWidth
          >
            {formState.isSubmitting ? "Отправка..." : "Отправить"}
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
