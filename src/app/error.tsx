"use client";

import { useEffect } from "react";
import Link from "next/link";

import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <span className={styles.errorIcon}>⚠️</span>

        <h1 className={styles.errorTitle}>Что-то пошло не так!</h1>

        <p className={styles.errorMessage}>
          Произошла непредвиденная ошибка. Мы уже работаем над её устранением.
          Пожалуйста, попробуйте еще раз или вернитесь на главную страницу.
        </p>

        <div className={styles.errorActions}>
          <button
            onClick={reset}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            🔄 Попробовать снова
          </button>

          <Link
            href="/"
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            🏠 Вернуться на главную
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className={styles.errorDetails}>
            <div className={styles.errorDetailsTitle}>
              Детали ошибки (только в разработке):
            </div>

            <div className={styles.errorDetailsText}>
              {error.message}
              {error.digest && ` (ID: ${error.digest})`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
