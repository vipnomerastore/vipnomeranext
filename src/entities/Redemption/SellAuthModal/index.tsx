import { memo, useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { useAuthStore } from "@/store/authStore";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import styles from "./SellAuthModal.module.scss";

interface SellAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SellAuthModal = ({ isOpen, onClose, onSuccess }: SellAuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuthStore();

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }

    try {
      await register(data.username, data.email, data.password);

      onSuccess();
      onClose();
    } catch (error) {
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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          ×
        </button>

        <h2 className={styles.title}>
          {mode === "login" ? "Войдите в аккаунт" : "Создайте аккаунт"}
        </h2>

        <p className={styles.subtitle}>
          Чтобы отправить номер на продажу и отслеживать статус, войдите в
          аккаунт
        </p>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
            onClick={() => setMode("login")}
          >
            Вход
          </button>

          <button
            type="button"
            className={`${styles.tab} ${
              mode === "register" ? styles.active : ""
            }`}
            onClick={() => setMode("register")}
          >
            Регистрация
          </button>
        </div>

        {mode === "login" ? (
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className={styles.form}
          >
            <Input
              name="email"
              control={loginForm.control}
              type="email"
              placeholder="Email"
              required
              fullWidth
            />

            <div className={styles.passwordField}>
              <Input
                name="password"
                control={loginForm.control}
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
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
                  alt="passwordEye"
                />
              </button>
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className={styles.form}
          >
            <Input
              name="username"
              control={registerForm.control}
              type="text"
              placeholder="Имя пользователя"
              required
              fullWidth
            />

            <Input
              name="email"
              control={registerForm.control}
              type="email"
              placeholder="Email"
              required
              fullWidth
            />

            <div className={styles.passwordField}>
              <Input
                name="password"
                control={registerForm.control}
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
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
                  alt="passwordEye"
                />
              </button>
            </div>

            <Input
              name="confirmPassword"
              control={registerForm.control}
              type="password"
              placeholder="Подтвердите пароль"
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="default"
              fullWidth
              disabled={registerForm.formState.isSubmitting}
            >
              {registerForm.formState.isSubmitting
                ? "Регистрация..."
                : "Зарегистрироваться"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

SellAuthModal.displayName = "SellAuthModal";

export default memo(SellAuthModal);
