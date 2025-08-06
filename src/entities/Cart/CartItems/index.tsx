"use client";

import Image from "next/image";

import { NumberItem } from "@/store/cartStore";

import styles from "./CartItems.module.scss";

// Иконки операторов
const operatorIcons: Record<string, string> = {
  МТС: "/assets/home/operators/mts.svg",
  Билайн: "/assets/home/operators/beeline.svg",
  Мегафон: "/assets/home/operators/megafon.svg",
  "Теле 2": "/assets/home/operators/tele2.svg",
};

interface CartItemsProps {
  items: NumberItem[];
  onRemove: (id: string) => void;
  isPartner: boolean;
}

interface TrashIconProps {
  className?: string;
}

const TrashIcon = ({ className }: TrashIconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    tabIndex={-1}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getOperatorIcon = (operator: string): string =>
  operatorIcons[operator] || "/assets/home/operators/megafon.svg";

const CartItems = ({ items, onRemove }: CartItemsProps) => (
  <div className={styles.list}>
    {items.length > 0 ? (
      items.map((item) => (
        <div key={item.id} className={styles.numberItem}>
          <div className={styles.numberItemNumber}>
            <Image
              src={getOperatorIcon(item.operator!)}
              alt={`Оператор ${item.operator}`}
              className={styles.operatorIcon}
              width={24}
              height={24}
            />

            <p className={styles.numberItemNumberTitle}>{item.phone}</p>
          </div>

          <div className={styles.numberItemPrice}>
            {item.old_price && item.old_price > item.price! && (
              <span className={styles.oldPrice}>
                {(item.old_price * item.quantity!).toLocaleString("ru-RU")} ₽
              </span>
            )}

            <p className={styles.numberItemPriceTitle}>
              {(item.price! * item.quantity!).toLocaleString("ru-RU")} ₽
            </p>
          </div>

          <div className={styles.numberItemCreditWrapper}>
            {item.part_price! > 0 && (
              <div className={styles.numberItemCredit}>
                <p className={styles.numberItemCreditTitle}>
                  В рассрочку без банка
                </p>

                <div className={styles.numberItemCreditContent}>
                  <Image
                    src="/assets/home/numberList/percent.svg"
                    alt="Иконка процента"
                    className={styles.numberItemCreditContentImg}
                    width={16}
                    height={16}
                  />

                  <p className={styles.numberItemCreditContentText}>
                    {Math.round(item.part_price!)} x {item.credit_month_count}{" "}
                    мес
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              className={styles.numberItemCart}
              onClick={() => onRemove(item.id)}
              title="Удалить товар"
              aria-label={`Удалить ${item.phone}`}
            >
              <TrashIcon className={styles.trashIcon} />
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className={styles.noResults}>Ваша корзина пуста.</p>
    )}
  </div>
);

export default CartItems;
