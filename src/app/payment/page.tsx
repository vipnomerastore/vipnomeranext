"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { SERVER_URL } from "@/shared/api";

import styles from "./PaymentPage.module.scss";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = searchParams.get("amount");
  let numbers = [];

  try {
    const itemsParam = searchParams.get("items") || "[]";
    numbers = JSON.parse(decodeURIComponent(itemsParam));
  } catch {
    numbers = [];
  }

  const deliveryMethod = searchParams.get("delivery") || "";
  const paymentMethod = searchParams.get("payment") || "";
  const installmentPeriod = searchParams.get("installment") || "";
  const orderId = searchParams.get("orderId") || "";

  const getInstallmentAmount = useCallback(() => {
    if (paymentMethod === "Рассрочка без банка" && installmentPeriod) {
      const total = numbers.reduce(
        (sum: number, item: { price: number; quantity?: number }) =>
          sum + item.price * (item.quantity || 1),
        0
      );

      const months = parseInt(installmentPeriod, 10);

      if (months > 0) return Math.ceil(total / months);
    }

    return Number(amount) || null;
  }, [paymentMethod, installmentPeriod, numbers, amount]);

  const handlePayment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formatNumbersText = (
        numbers: Array<{
          phone: string;
          price: number;
          operator: string;
          part_price: number;
          credit_month_count: number;
        }>
      ) => {
        return numbers
          .map(
            (num: {
              phone: string;
              price: number;
              operator: string;
              part_price: number;
              credit_month_count: number;
            }) =>
              `Номер: ${num.phone}, Цена: ${num.price} ₽, Оператор: ${num.operator}, Рассрочка: ${num.part_price} ₽ x ${num.credit_month_count} мес`
          )
          .join("\n");
      };

      const response = await fetch(`${SERVER_URL}/order/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          numbers,
          numbersInfo: formatNumbersText(numbers),
          deliveryMethod,
          paymentMethod,
          installmentPeriod,
          amount: getInstallmentAmount(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.confirmationUrl) {
        throw new Error(data.error?.message || "Ошибка при создании платежа");
      }

      if (typeof window !== "undefined") {
        window.location.href = data.confirmationUrl;
      }
    } catch (err) {
      console.error("Ошибка при оплате:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось перейти к оплате. Попробуйте позже."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    orderId,
    numbers,
    deliveryMethod,
    paymentMethod,
    installmentPeriod,
    getInstallmentAmount,
  ]);

  useEffect(() => {
    if (!orderId) {
      setError("Не найден идентификатор заказа.");

      return;
    }

    handlePayment();
  }, [handlePayment, orderId]);

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>
          Главная
        </Link>

        <span className={styles.breadcrumbSeparator}>/</span>

        <span className={styles.breadcrumbCurrent}>Оплата</span>
      </nav>

      <p className={styles.title1}>
        Ваш заказ <span>№{orderId || "неизвестен"}</span> успешно создан.
      </p>

      <p className={styles.title2}>
        В ближайшее время с вами свяжется наш менеджер.
      </p>

      <p>
        Услугу предоставляет сервис онлайн-платежей <span>«ЮKassa»</span>.
      </p>

      <p>
        Сумма к оплате по счету:{" "}
        {getInstallmentAmount() !== null
          ? `${getInstallmentAmount()} ₽`
          : "неизвестна"}
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.button}
        onClick={handlePayment}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-live="polite"
      >
        {isLoading ? "Перенаправление..." : "Оплатить"}
      </button>

      <p>Вы будете перенаправлены на страницу оплаты.</p>

      <p className={styles.note}>
        <strong>Обратите внимание:</strong> если вы откажетесь от покупки, для
        возврата денег вам придется обратиться в магазин.
      </p>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
