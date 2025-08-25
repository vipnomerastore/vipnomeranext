import React from "react";
import { Tooltip } from "@mui/material";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { NumberItem, useCartStore } from "@/store/cartStore";
import {
  getTierConfig,
  getNumberTier,
} from "@/entities/Home/Combination/ui/NumberList/const";

import styles from "./PhoneDescriptionalClient.module.scss";

interface Props {
  number: NumberItem;
  isPartner: boolean;
  onClose: () => void;
}

const PhoneDescriptionModal: React.FC<Props> = ({
  number,
  isPartner,
  onClose,
}) => {
  const modalRoot = document.getElementById("modal-root");
  const router = useRouter();
  const { addItem } = useCartStore();

  if (!modalRoot) return null;

  const handleAddToCart = () => {
    const cartItem = {
      ...number,
      price: isPartner ? number.partner_price : number.price,
      quantity: 1,
    };

    const isAlreadyInCart = useCartStore
      .getState()
      .items.some((i) => i.phone === cartItem.phone);

    if (isAlreadyInCart) {
      return;
    }

    addItem(cartItem);

    onClose();
    router.push("/cart");
  };

  const tierKey = getNumberTier(number.price || 0);
  const tierConfig = getTierConfig(number.price || 0);

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-labelledby="description-modal-text"
    >
      <div
        className={styles.modalDescriptionContent + " " + styles[tierKey]}
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: tierConfig.borderColor }}
      >
        <p id="description-modal-text" className={styles.modalText}>
          {number.phone}
        </p>
        <p className={styles.modalSubText}>
          Оператор: <span>{number.operator}</span>
        </p>
        <p className={styles.modalSubText}>
          Регион:{" "}
          <span>
            {number.region.filter((r) => r.trim() !== "").join(", ") ||
              "не указан"}
          </span>
        </p>

        <div className={styles.priceWrapper}>
          <p className={styles.price}>
            Цена:{" "}
            <span>{isPartner ? number.partner_price : number.price} ₽</span>
          </p>
          <p className={styles.credit}>
            Рассрочка без банка:{" "}
            <span>
              {number.part_price} ₽ x {number.credit_month_count} мес
            </span>
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default PhoneDescriptionModal;
