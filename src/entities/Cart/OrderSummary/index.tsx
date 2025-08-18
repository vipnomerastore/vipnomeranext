import { NumberItem } from "@/store/cartStore";

import styles from "./OrderSummary.module.scss";
import Button from "@/shared/ui/Button";

interface OrderSummaryProps {
  items: NumberItem[];
  activeDeliveryTab: string;
  activePaymentTab: string;
  activeInstallmentPeriod: string;
  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
}

const formatMonths = (months: string): string => {
  const num = parseInt(months, 10);

  if (num === 1) return "месяц";

  if (num >= 2 && num <= 4) return "месяца";

  return "месяцев";
};

const calculateTotalDiscount = (items: NumberItem[]) =>
  items.reduce((sum, item) => {
    if (item.old_price && item.old_price > item.price!) {
      return sum + (item.old_price! - item.price!) * (item.quantity || 1);
    }

    return sum;
  }, 0);

const getTotalAmount = (
  items: NumberItem[],
  includeInstallmentOnly: boolean = false
) =>
  items.reduce((sum, item) => {
    if (includeInstallmentOnly && item.part_price === 0) {
      return sum;
    }

    return sum + item.price! * (item.quantity || 1);
  }, 0);

const formatPrice = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const DELIVERY_LABELS: Record<string, string> = {
  sdek: "бесплатно",
  esim: "бесплатно",
  "Забрать в салоне связи своего города": "бесплатно",
};

const OrderSummary = (props: OrderSummaryProps) => {
  const {
    items,
    activeDeliveryTab,
    activePaymentTab,
    activeInstallmentPeriod,
    onSubmit,
    isSubmitting,
  } = props;

  const totalDiscount = calculateTotalDiscount(items);
  const deliveryText = DELIVERY_LABELS[activeDeliveryTab] ?? "бесплатно";
  const isInstallment =
    activePaymentTab === "Рассрочка без банка" && activeInstallmentPeriod;

  const totalAmount = getTotalAmount(items, Boolean(isInstallment));
  const months = parseInt(activeInstallmentPeriod, 10);

  const monthlyPaymentWithNoCredit = items.reduce((sum, item) => {
    if (item.part_price! > 0) {
      return sum;
    }

    return sum + item.price!;
  }, 0);

  const monthlyPayment = isInstallment
    ? Math.ceil(totalAmount / months + monthlyPaymentWithNoCredit)
    : totalAmount;

  return (
    <div className={styles.stickySummary}>
      <div className={styles.orderSummary}>
        <h4 className={styles.summaryTitle}>ИТОГО</h4>

        {totalDiscount > 0 && (
          <div className={styles.summaryRow}>
            <p className={styles.title}>Ваша скидка:</p>

            <p className={styles.itemValue}>{formatPrice(totalDiscount)} ₽</p>
          </div>
        )}

        <div className={styles.summaryRow}>
          <p className={styles.title}>Товаров на:</p>

          <p className={styles.itemValue}>{formatPrice(totalAmount)} ₽</p>
        </div>

        <div className={styles.summaryRow}>
          <p className={styles.title}>Доставка:</p>

          <p className={styles.deliveryValue}>{deliveryText}</p>
        </div>

        {isInstallment && (
          <div className={styles.summaryRow}>
            <p className={styles.title}>В рассрочку:</p>

            <p className={styles.itemValue}>
              {activeInstallmentPeriod} {formatMonths(activeInstallmentPeriod)}
            </p>
          </div>
        )}

        <div className={styles.installmentSummary}>
          <p className={styles.title}>Итого:</p>

          <p className={styles.itemValue}>
            {isInstallment ? (
              <>{formatPrice(monthlyPayment)} ₽ в месяц</>
            ) : (
              <>{formatPrice(totalAmount)} ₽</>
            )}
          </p>
        </div>
      </div>

      <Button
        fullWidth
        disabled={items.length === 0 || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "Отправка..." : "Оформить заказ"}
      </Button>
    </div>
  );
};

export default OrderSummary;
