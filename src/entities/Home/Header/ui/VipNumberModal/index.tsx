"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { SERVER_URL } from "@/shared/api";
import styles from "../../Header.module.scss";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import Checkbox from "@/shared/ui/Checkbox";

interface VipNumberModalProps {
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

const VipNumberModal = ({ isOpen, onClose }: VipNumberModalProps) => {
  const [purpose, setPurpose] = useState("Личное пользование");

  const router = useRouter();

  const { control, reset, handleSubmit, formState } = useForm({
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
          goal: purpose,
        },
      };

      await axios.post(`${SERVER_URL}/forma-vip-nomers`, payload);

      reset();
      onClose();
      router.push("/thank-you");
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

        <h2 className={styles.title}>ПОЛУЧИТЬ VIP НОМЕР</h2>

        <p className={styles.subtitle}>Оставь заявку прямо сейчас</p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            control={control}
            name="fio"
            required
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput name="phone" fullWidth control={control} />

          <Select
            fullWidth
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            options={["Личное пользование", "Для бизнеса", "В подарок"]}
          />

          <Checkbox name="agreement" control={control} />

          <Button
            type="submit"
            variant="outline"
            fullWidth
            disabled={formState.isSubmitting}
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

export default VipNumberModal;
