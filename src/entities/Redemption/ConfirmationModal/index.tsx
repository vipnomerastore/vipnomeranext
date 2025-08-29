import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import Button from "@/shared/ui/Button";
import styles from "./ConfirmationModal.module.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  phoneNumber,
}: ConfirmationModalProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToListings = () => {
    router.push("/my-listings");
    onClose();
  };

  const handleGoToHome = () => {
    router.push("/");
    onClose();
  };

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

        <div className={styles.iconWrapper}>
          <div className={styles.successIcon}>✓</div>
        </div>

        <h2 className={styles.title}>Заявка отправлена</h2>

        <div className={styles.content}>
          {phoneNumber && (
            <p className={styles.phoneNumber}>
              Номер: <strong>{phoneNumber}</strong>
            </p>
          )}

          <p className={styles.description}>
            Наш менеджер скоро свяжется с вами, уточнит детали и предложит
            финальную цену.
          </p>

          <p className={styles.description}>
            После согласования мы выставим ваш номер в общий каталог.
          </p>

          <p className={styles.description}>
            Вы сможете следить за статусом на странице «Мои объявления».
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="default" onClick={handleGoToListings} fullWidth>
            Перейти в Мои объявления
          </Button>

          <Button variant="outline" onClick={handleGoToHome} fullWidth>
            На главную
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

ConfirmationModal.displayName = "ConfirmationModal";

export default memo(ConfirmationModal);
