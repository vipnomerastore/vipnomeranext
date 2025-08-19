"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

import { SERVER_URL } from "@/shared/api";

import styles from "./GetNumberModal.module.scss";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";

interface GetNumberModalProps {
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

const GetNumberModal = ({ isOpen, onClose }: GetNumberModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { control, handleSubmit, reset } = useForm({ defaultValues });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmitHandler = async (data: { fio: string; phone: string }) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = {
        data: {
          fio: data.fio,
          phone: data.phone,
        },
      };

      await axios.post(`${SERVER_URL}/forma-s-banneras`, payload);

      reset();
      onClose();
      router.push("/thank-you");
    } catch (error: any) {
      console.error("Ошибка при отправке формы:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-number-modal-title"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.title}>Заполните форму</h2>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            name="fio"
            control={control}
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput fullWidth name="phone" control={control} />

          <Checkbox name="agreement" control={control} />

          <Button
            type="submit"
            variant="outline"
            fullWidth
            disabled={isSubmitting}
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

  if (!modalRoot) {
    console.error("Modal root element not found");

    return null;
  }

  return createPortal(modalContent, modalRoot);
};

export default GetNumberModal;
