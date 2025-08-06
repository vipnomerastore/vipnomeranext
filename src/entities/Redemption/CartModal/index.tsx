import { memo, useEffect, useRef } from "react";

import styles from "./CartModal.module.scss";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
}

const CartModal: React.FC<CartModalProps> = memo(
  ({ isOpen, onClose, onGoToCart }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
      if (isOpen && modalRef.current) {
        modalRef.current.focus();
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
          tabIndex={-1}
        >
          <p id="modalTitle" className={styles.modalText}>
            Номер добавлен в корзину
          </p>

          <button
            className={styles.modalButton}
            onClick={onGoToCart}
            aria-label="Перейти в корзину"
          >
            В корзину
          </button>
        </div>
      </div>
    );
  }
);

export default CartModal;
