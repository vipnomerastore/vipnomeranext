import React from "react";
import { Tooltip } from "@mui/material";
import { NumberItem } from "@/store/cartStore";
import {
  getTierConfig,
  getNumberTier,
} from "@/entities/Home/Combination/ui/NumberList/const";

import styles from "./PhoneDescriptionalClient.module.scss";

interface Props {
  number: NumberItem;
  isPartner: boolean;
  onClose?: () => void;
  isModal?: boolean; // Новый пропс для определения режима отображения
}

const PhoneDescriptionalContent: React.FC<Props> = ({
  number,
  isPartner,
  onClose,
  isModal = false,
}) => {
  const tierKey = getNumberTier(number.price || 0);
  const tierConfig = getTierConfig(number.price || 0);

  const content = (
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
          Цена: <span>{isPartner ? number.partner_price : number.price} ₽</span>
        </p>
        {number.part_price && (
          <p className={styles.credit}>
            Рассрочка без банка:{" "}
            <span>
              {number.part_price} ₽ x {number.credit_month_count} мес
            </span>
          </p>
        )}
      </div>
    </div>
  );

  // Если это модальное окно, оборачиваем в overlay
  if (isModal && onClose) {
    return (
      <div
        className={styles.modalOverlay}
        onClick={onClose}
        role="dialog"
        aria-labelledby="description-modal-text"
      >
        {content}
      </div>
    );
  }

  // Если это обычная страница, возвращаем просто контент
  return <div className={styles.pageContainer}>{content}</div>;
};

export default PhoneDescriptionalContent;
