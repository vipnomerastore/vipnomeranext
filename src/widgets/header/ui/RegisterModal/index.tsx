"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import styles from "./RegisterModal.module.scss";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
}

const defaultValues: FormData = {
  username: "",
  email: "",
  password: "",
};

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser } = useAuthStore();

  const { control, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    try {
      await registerUser(data.username, data.email, data.password);

      onClose();
      reset();
      setShowPassword(false);
    } catch (error: unknown) {
      console.error("Ошибка регистрации:", error);
    }
  };

  const passwordEye = useMemo(
    () =>
      showPassword ? "/assets/header/eyeoff.svg" : "/assets/header/eye.svg",
    [showPassword]
  );

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          ×
        </button>

        <h2 id="register-title" className={styles.title}>
          Регистрация <span>партнера</span>
        </h2>

        <p className={styles.subtitle}>
          Создайте аккаунт для доступа к партнерским ресурсам
        </p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            name="username"
            control={control}
            type="text"
            placeholder="Введите имя пользователя"
            fullWidth
            required
          />

          <Input
            name="email"
            control={control}
            type="email"
            placeholder="Введите ваш email"
            fullWidth
            required
          />

          <div className={styles.inputField}>
            <Input
              type={showPassword ? "text" : "password"}
              control={control}
              name="password"
              placeholder="Введите ваш пароль"
              required
              fullWidth
              minLength={6}
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <Image
                loading="lazy"
                width={13}
                height={13}
                src={passwordEye}
                alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
              />
            </button>
          </div>

          <Button
            type="submit"
            disabled={formState.isSubmitting}
            fullWidth
            variant="outline"
          >
            {formState.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
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

export default RegisterModal;
