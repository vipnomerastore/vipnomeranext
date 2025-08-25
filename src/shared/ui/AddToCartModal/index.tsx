"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

import { SERVER_URL } from "@/shared/api";
import { NumberItem } from "@/store/cartStore";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import Button from "@/shared/ui/Button";
import styles from "./AddToCartModal.module.scss";

interface GetNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NumberItem | null;
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

const AddToCartModal = ({ isOpen, onClose, item }: GetNumberModalProps) => {
  const router = useRouter();

  const { control, handleSubmit, reset, formState } = useForm({
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
      const payload = {
        data: {
          name: data.fio,
          phone: data.phone,
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

      await axios.post(`${SERVER_URL}/zayavkas`, payload);

      onClose();
      reset();
      router.push("/success-order");
    } catch (error: unknown) {
      console.error("Ошибка:", error);
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

        <h2 className={styles.title}>Оставьте заявку на покупку номера</h2>

        <p className={styles.titlePhone}>{item?.phone}</p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            control={control}
            required
            name="fio"
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput name="phone" control={control} fullWidth />

          <Checkbox name="agreement" control={control} />

          <Button
            type="submit"
            disabled={formState.isSubmitting}
            variant="outline"
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

export default AddToCartModal;
