"use client";

import { useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

import { NumberItem, useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { SERVER_URL } from "@/shared/api";

import Breadcrumbs from "@/entities/Cart/Breadcrumbs";
import CartHeader from "@/entities/Cart/CartHeader";
import CartItems from "@/entities/Cart/CartItems";
import DeliverySection from "@/entities/Cart/DeliverySection";
import PaymentSection from "@/entities/Cart/PaymentSection";
import OrderSummary from "@/entities/Cart/OrderSummary";
import RecommendedNumbersSection from "@/entities/Cart/RecommendedNumbersSection";
import CheckoutForm from "@/entities/Cart/CheckoutForm";

import styles from "./CartPage.module.scss";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  podyezd: string;
  floor: string;
  apartment: string;
  comment: string;
  agreedToTerms: boolean;
}

const initialFormState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  street: "",
  podyezd: "",
  floor: "",
  apartment: "",
  comment: "",
  agreedToTerms: true,
};

const TOASTER_STYLE = {
  style: {
    background: "#242423",
    color: "#fff",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "12px 16px",
  },
  success: { style: { borderLeft: "4px solid #d9ad49" } },
  error: { style: { borderLeft: "4px solid #ff6b6b" } },
};

const CartPage = () => {
  const { items, addItem, removeItem } = useCartStore();

  const [activeDeliveryTab, setActiveDeliveryTab] = useState("СДЭК");
  const [activePaymentTab, setActivePaymentTab] = useState("Онлайн картой");
  const [activeInstallmentPeriod, setActiveInstallmentPeriod] = useState("2");
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const router = useRouter();

  const isPartner = user?.role?.name === "Партнёр";

  const calculateTotal = useCallback(() => {
    const total = items.reduce((sum, item) => {
      const price =
        isPartner && item.partner_price ? item.partner_price : item.price || 0;

      const qty = item.quantity || 1;

      return sum + price * qty;
    }, 0);

    return total;
  }, [items, isPartner]);

  const formatPhoneNumber = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");

    if (!cleaned) return "";

    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (!match) return value;

    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }, []);

  const handleFormChange = useCallback(
    (field: keyof FormState, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    if (!form.fullName.trim() || !form.phone.trim() || !form.agreedToTerms) {
      toast.error(
        "Пожалуйста, заполните все обязательные поля и согласитесь с условиями."
      );

      setIsSubmitting(false);

      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");

    if (!/^7\d{10}$/.test(cleanPhone)) {
      toast.error("Введите корректный номер телефона.");
      setIsSubmitting(false);
      return;
    }

    const totalPrice = calculateTotal();

    const payload = {
      data: {
        name: form.fullName.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        city: form.city.trim(),
        street: form.street.trim(),
        podyezd: form.podyezd.trim(),
        floor: form.floor.trim(),
        apartment: form.apartment.trim(),
        comment: form.comment.trim(),
        price: totalPrice,
        payment: activePaymentTab,
        delivery: activeDeliveryTab,
        numbers: {
          connect: items.map((item) => ({ documentId: item.id })),
        },
      },
    };

    try {
      const response = await axios.post(`${SERVER_URL}/zayavkas`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Ошибка при отправке формы");
      }

      toast.success("Заказ успешно создан!");

      router.push("/success-order");

      // setForm(initialFormState);

      // const orderId = crypto.randomUUID();

      // router.push(
      //   `/payment?orderId=${orderId}&amount=${totalPrice}&items=${encodeURIComponent(
      //     JSON.stringify(items)
      //   )}&delivery=${activeDeliveryTab}&payment=${activePaymentTab}&installment=${activeInstallmentPeriod}`
      // );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error?.message || "Ошибка при отправке формы",
          { duration: 4000, position: "top-right" }
        );
      } else if (error instanceof Error) {
        toast.error(error.message, { duration: 4000, position: "top-right" });
      } else {
        toast.error("Неизвестная ошибка", {
          duration: 4000,
          position: "top-right",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form,
    calculateTotal,
    activeDeliveryTab,
    activePaymentTab,
    activeInstallmentPeriod,
    items,
    router,
  ]);

  const handleAddToCart = useCallback(
    (item: NumberItem) => {
      const exists = items.some((i) => i.phone === item.phone);

      if (exists) {
        toast.error(`Номер ${item.phone} уже в корзине!`);
        return;
      }

      addItem({ ...item, quantity: 1 });

      toast.success(`Номер ${item.phone} добавлен в корзину!`);
    },
    [addItem, items]
  );

  const maxInstallment = items.reduce(
    (max, item) =>
      item.credit_month_count && item.credit_month_count > max
        ? item.credit_month_count
        : max,
    0
  );

  const hasPartPriceNine = items.some((item) => item.part_price! > 0);

  return (
    <>
      <Toaster toastOptions={TOASTER_STYLE} />

      <div className={styles.cartWrapper}>
        <Breadcrumbs />

        <div className={styles.cartContent}>
          <div className={styles.mainCartContent}>
            <CartHeader itemCount={items.length} />

            <CartItems
              items={items}
              onRemove={removeItem}
              isPartner={isPartner}
            />

            {/* <DeliverySection
              activeTab={activeDeliveryTab}
              onTabChange={setActiveDeliveryTab}
            />

            <PaymentSection
              activePaymentTab={activePaymentTab}
              activeInstallmentPeriod={activeInstallmentPeriod}
              onPaymentTabChange={setActivePaymentTab}
              onInstallmentPeriodChange={setActiveInstallmentPeriod}
              maxInstallment={maxInstallment}
              hasPartPriceNine={hasPartPriceNine}
            /> */}
          </div>

          <OrderSummary
            items={items}
            activeDeliveryTab={activeDeliveryTab}
            activePaymentTab={activePaymentTab}
            activeInstallmentPeriod={activeInstallmentPeriod}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <CheckoutForm
          items={items}
          activeDeliveryTab={activeDeliveryTab}
          activePaymentTab={activePaymentTab}
          fullName={form.fullName}
          phone={form.phone}
          email={form.email}
          city={form.city}
          street={form.street}
          podyezd={form.podyezd}
          floor={form.floor}
          apartment={form.apartment}
          comment={form.comment}
          onFullNameChange={(val) => handleFormChange("fullName", val)}
          onPhoneChange={(e) =>
            handleFormChange("phone", formatPhoneNumber(e.target.value))
          }
          onEmailChange={(val) => handleFormChange("email", val)}
          onCityChange={(val) => handleFormChange("city", val)}
          onStreetChange={(val) => handleFormChange("street", val)}
          onPodyezdChange={(val) => handleFormChange("podyezd", val)}
          onFloorChange={(val) => handleFormChange("floor", val)}
          onApartmentChange={(val) => handleFormChange("apartment", val)}
          onCommentChange={(val) => handleFormChange("comment", val)}
          checked={form.agreedToTerms}
          setChecked={(val) => handleFormChange("agreedToTerms", val)}
        />

        <RecommendedNumbersSection onAddToCart={handleAddToCart} />
      </div>
    </>
  );
};

export default CartPage;
