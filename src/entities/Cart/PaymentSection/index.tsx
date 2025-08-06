import { memo } from "react";
import clsx from "clsx";

import styles from "./PaymentSection.module.scss";

interface PaymentSectionProps {
  activePaymentTab: string;
  activeInstallmentPeriod: string;
  maxInstallment: number;
  onPaymentTabChange: (tab: string) => void;
  hasPartPriceNine: boolean;
  onInstallmentPeriodChange: (period: string) => void;
}

interface PeriodTabProps {
  period: string;
  isActive: boolean;
  onClick: (period: string) => void;
}

interface PaymentTabProps {
  tab: string;
  isActive: boolean;
  onClick: (tab: string) => void;
}

const PAYMENT_TABS = [
  "Онлайн картой",
  "В рассрочку Тинькоф",
  "Долями - оплата покупок частями",
  "Рассрочка без банка",
] as const;

const getPeriodDatas = (maxInstallment: number) => {
  const monthArray: string[] = [];

  for (let i = 2; i <= maxInstallment; i += 2) {
    monthArray.push(String(i));
  }

  return monthArray;
};

const PaymentTab = memo((props: PaymentTabProps) => {
  const { tab, isActive, onClick } = props;

  return (
    <button
      type="button"
      className={clsx(styles.paymentTab, isActive && styles.active)}
      onClick={() => onClick(tab)}
      aria-pressed={isActive}
    >
      {tab}
    </button>
  );
});

PaymentTab.displayName = "PaymentTab";

const PeriodTab = memo((props: PeriodTabProps) => {
  const { period, isActive, onClick } = props;

  return (
    <button
      type="button"
      className={clsx(styles.installmentPeriodTab, isActive && styles.active)}
      onClick={() => onClick(period)}
      aria-pressed={isActive}
    >
      {period} мес
    </button>
  );
});

PeriodTab.displayName = "PeriodTab";

const PaymentSection = memo((props: PaymentSectionProps) => {
  const {
    activePaymentTab,
    activeInstallmentPeriod,
    maxInstallment,
    onPaymentTabChange,
    onInstallmentPeriodChange,
    hasPartPriceNine,
  } = props;

  const periodDatas = getPeriodDatas(maxInstallment);

  const filteredPaymentTabs = hasPartPriceNine
    ? PAYMENT_TABS
    : PAYMENT_TABS.filter((tab) => tab !== "Рассрочка без банка");

  return (
    <section className={styles.paymentSection}>
      <h3 className={styles.paymentTitle}>Оплата</h3>

      <div className={styles.paymentTabs}>
        {filteredPaymentTabs.map((tab) => (
          <PaymentTab
            key={tab}
            tab={tab}
            isActive={activePaymentTab === tab}
            onClick={onPaymentTabChange}
          />
        ))}
      </div>

      {activePaymentTab === "Рассрочка без банка" && hasPartPriceNine && (
        <div className={styles.installmentPeriods}>
          <h4 className={styles.installmentPeriodTitle}>Период рассрочки</h4>

          <div className={styles.installmentPeriodTabs}>
            {periodDatas.map((period) => (
              <PeriodTab
                key={period}
                period={period}
                isActive={activeInstallmentPeriod === period}
                onClick={onInstallmentPeriodChange}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default PaymentSection;
