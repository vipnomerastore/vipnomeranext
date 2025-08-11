import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Image from "next/image";

import { useAuthStore } from "@/store/authStore";

import styles from "./RegisterModal.module.scss";
import Button from "@/shared/ui/Button";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuthStore();

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "Имя пользователя обязательно";
    }

    if (!email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!password.trim()) {
      newErrors.password = "Пароль обязателен";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      console.log("Form validation failed:", errors);

      return;
    }

    try {
      setIsSubmitting(true);

      await register(username, email, password);

      toast.success("Регистрация успешна! Вы вошли в аккаунт.", {
        duration: 3000,
        position: "top-right",
      });

      onClose();
      setUsername("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setErrors({});
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        toast.error((err as any).message, {
          duration: 4000,
          position: "top-right",
        });
      } else {
        toast.error("Ошибка регистрации", {
          duration: 4000,
          position: "top-right",
        });
      }
      console.error("Registration Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
          type="button"
        >
          ×
        </button>

        <h2 id="register-modal-title" className={styles.title}>
          Регистрация <span>партнера</span>
        </h2>

        <p className={styles.subtitle}>
          Создайте аккаунт для доступа к партнерским ресурсам
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputField}>
            <input
              type="text"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              disabled={isSubmitting}
              required
            />
            {errors.username && (
              <p id="username-error" className={styles.errorMessage}>
                {errors.username}
              </p>
            )}
          </div>

          <div className={styles.inputField}>
            <input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <p id="email-error" className={styles.errorMessage}>
                {errors.email}
              </p>
            )}
          </div>

          <div className={styles.inputField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              required
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
            {errors.password && (
              <p id="password-error" className={styles.errorMessage}>
                {errors.password}
              </p>
            )}
          </div>

          <Button disabled={isSubmitting} fullWidth variant="outline">
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
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
