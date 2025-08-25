import React from "react";
import Image from "next/image";

import { NumberItem } from "@/store/cartStore";
import { getNumberTier } from "../NumberList/const";
import {
  getOperatorIcon,
  calculateDiscountPercentage,
  formatPrice,
} from "../NumberList/utils";
import styles from "../NumberList/NumberList.module.scss";

interface NumberItemProps {
  numberItem: NumberItem;
  isPartner: boolean;
  onNumberClick: (numberItem: NumberItem) => void;
  onAddToCart: (numberItem: NumberItem) => void;
}

export const NumberItemComponent: React.FC<NumberItemProps> = ({
  numberItem,
  isPartner,
  onNumberClick,
  onAddToCart,
}) => {
  const tierKey = getNumberTier(numberItem.price || 0);
  const hasDiscount = !!numberItem.old_price;

  const priceTitleStyle = hasDiscount
    ? styles.numberItemPriceTitleGreen
    : styles.numberItemPriceTitle;

  const rowStyle = hasDiscount
    ? styles.numberAndPriceRowDiscount
    : styles.numberAndPriceRow;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(numberItem);
  };

  // Рендер цены с учетом скидки
  const renderPrice = () => {
    if (isPartner) {
      return (
        <p className={styles.numberItemPriceTitlePartner}>
          {numberItem.price} ₽
        </p>
      );
    }

    return (
      <div className={styles.priceRowWithDiscount}>
        <p className={priceTitleStyle}>
          {formatPrice(numberItem.price || 0)} ₽
        </p>

        {hasDiscount && (
          <>
            <span className={styles.numberItemOldPrice}>
              {formatPrice(numberItem.old_price!)} ₽
            </span>
            <span className={styles.numberItemDiscountPercent}>
              -
              {calculateDiscountPercentage(
                numberItem.price!,
                numberItem.old_price!
              )}
              %
            </span>
          </>
        )}
      </div>
    );
  };

  // Рендер рассрочки или партнёрской цены
  const renderCreditOrPartner = () => {
    if (isPartner) {
      return (
        <div className={styles.numberItemCreditPartner}>
          <p className={styles.numberItemCreditTitle}>Цена для партнера</p>
          <div className={styles.numberItemCreditContent}>
            <Image
              src="/assets/home/numberList/percent.svg"
              alt="Иконка процента"
              className={styles.numberItemCreditContentImg}
              width={16}
              height={16}
            />
            <p className={styles.numberItemCreditContentTextPartner}>
              {numberItem.partner_price} ₽
            </p>
          </div>
        </div>
      );
    }

    if (numberItem.part_price) {
      return (
        <div className={styles.numberItemCredit}>
          <p className={styles.numberItemCreditTitle}>В рассрочку без банка</p>
          <div className={styles.numberItemCreditContent}>
            <Image
              src="/assets/home/numberList/percent.svg"
              alt="Иконка процента"
              className={styles.numberItemCreditContentImg}
              width={16}
              height={16}
            />
            <p className={styles.numberItemCreditContentText}>
              {numberItem.part_price} x {numberItem.credit_month_count} мес
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.numberWrapper}>
      <div
        className={`${styles.numberItem} ${styles[tierKey]}`}
        onClick={() => onNumberClick(numberItem)}
        style={{ cursor: "pointer" }}
      >
        {/* Номер и цена */}
        <div className={rowStyle}>
          <div className={styles.numberItemNumber}>
            <Image
              src={getOperatorIcon(numberItem.operator!)}
              alt={`Логотип оператора ${numberItem.operator}`}
              className={styles.numberItemNumberImg}
              width={24}
              height={24}
              priority
            />
            <p className={styles.numberItemNumberTitle}>{numberItem.phone}</p>
          </div>

          {renderPrice()}
        </div>

        {/* Рассрочка / партнёрская цена и кнопка корзины */}
        <div className={styles.installmentAndCartRow}>
          {renderCreditOrPartner()}

          <button
            type="button"
            className={styles.numberItemCart}
            onClick={handleAddToCartClick}
            aria-label={`Добавить номер ${numberItem.phone} в корзину`}
          >
            <Image
              src="/assets/home/numberList/cart.svg"
              alt="Иконка корзины"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
