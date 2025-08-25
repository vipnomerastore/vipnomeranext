import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import styles from "./LoginModal.module.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

interface FormData {
  email: string;
  password: string;
}

const defaultValues: FormData = {
  email: "",
  password: "",
};

const LoginModal = ({ isOpen, onClose, onOpenRegister }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuthStore();
  const { control, reset, handleSubmit } = useForm<FormData>({ defaultValues });

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

      await login(data.email, data.password);

      onClose();
      reset();
      setShowPassword(false);
    } catch (err: unknown) {
      console.error("Ошибка:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordEye = showPassword
    ? "/assets/header/eyeoff.svg"
    : "/assets/header/eye.svg";

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.title}>
          Авторизация <span>партнера</span>
        </h2>

        <p className={styles.subtitle}>
          Доступ к эксклюзивным ресурсам для партнеров
        </p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            name="email"
            control={control}
            type="email"
            placeholder="Введите ваш email"
            required
            fullWidth
          />

          <div className={styles.inputField}>
            <Input
              name="password"
              control={control}
              type={showPassword ? "text" : "password"}
              placeholder="Введите ваш пароль"
              required
              fullWidth
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
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
            fullWidth
            variant="outline"
            disabled={isSubmitting}
          >
            Войти
          </Button>

          <p className={styles.registerLink}>
            Нет аккаунта?{" "}
            <span onClick={onOpenRegister} className={styles.registerLinkText}>
              Зарегистрируйся
            </span>
          </p>
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

export default LoginModal;
