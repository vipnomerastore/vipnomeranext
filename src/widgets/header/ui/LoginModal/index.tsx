import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Image from "next/image";

import { useAuthStore } from "@/store/authStore";

import styles from "./LoginModal.module.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

const LoginModal = ({ isOpen, onClose, onOpenRegister }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { login } = useAuthStore();

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
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
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
      await login(email, password);

      toast.success("Вход выполнен!", {
        duration: 3000,
        position: "top-right",
      });

      onClose();
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
        toast.error("Не верный Email или Пароль", {
          duration: 4000,
          position: "top-right",
        });
      }
      console.error("Login Error:", err);
    }
  };

  const handleContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
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

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputField}>
            <input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>

          <div className={styles.inputField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <Image
                loading="lazy"
                src={
                  showPassword
                    ? "/assets/header/eyeoff.svg"
                    : "/assets/header/eye.svg"
                }
                alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
              />
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className={styles.errorMessage}>
              {errors.password}
            </p>
          )}

          <button type="submit" className={styles.submitButton}>
            Войти
          </button>

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
