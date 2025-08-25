import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useForm } from "react-hook-form";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuthStore();
  const { control, handleSubmit, reset } = useForm({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmitHandler = async (data: FormData) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      await register(data.username, data.email, data.password);

      onClose();
      reset();
      setShowPassword(false);
    } catch (err: unknown) {
      console.error("Ошибка:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <h2 className={styles.title}>
          Регистрация <span>партнера</span>
        </h2>

        <p className={styles.subtitle}>
          Создайте аккаунт для доступа к партнерским ресурсам
        </p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            name="email"
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
              tabIndex={-1}
              disabled={isSubmitting}
            >
              <Image
                loading="lazy"
                width={13}
                height={13}
                src={
                  showPassword
                    ? "/assets/header/eyeoff.svg"
                    : "/assets/header/eye.svg"
                }
                alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
              />
            </button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            fullWidth
            variant="outline"
          >
            Зарегистрироваться
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

export default RegisterModal;
