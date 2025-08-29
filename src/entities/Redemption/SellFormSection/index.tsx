"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import { useAuthStore } from "@/store/authStore";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import TextArea from "@/shared/ui/TextArea";
import Select from "@/shared/ui/Select";
import Checkbox from "@/shared/ui/Checkbox";
import SellAuthModal from "@/entities/Redemption/SellAuthModal";
import ConfirmationModal from "@/entities/Redemption/ConfirmationModal";
import styles from "./SellFormSection.module.scss";

// Локальные типы для этого компонента
interface StrapiSellRequest {
  name: string;
  phone: string;
  operator: string;
  price: string;
  email: string;
  sell_number: string;
  comment: string;
  isPaid: "НА МОДЕРАЦИИ" | "ВЫСТАВЛЕН НА ПРОДАЖУ" | "ПРОДАН";
}

interface FormData {
  name: string;
  contactPhone: string;
  operator: string;
  sellNumber: string;
  price: string;
  email: string;
  comment: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  name: "",
  contactPhone: "+7 ",
  operator: "",
  sellNumber: "",
  price: "",
  email: "",
  comment: "",
  agreement: true,
};

const SellFormSection: React.FC = memo(() => {
  const [operator, setOperator] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState("");

  const { isAuthenticated } = useAuthStore();

  const { control, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues,
  });

  const onSubmitHandler = useCallback(
    async (data: FormData) => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }

      try {
        const sellRequestData: StrapiSellRequest = {
          name: data.name,
          phone: data.contactPhone,
          price: data.price,
          operator: operator,
          sell_number: data.sellNumber,
          email: data.email,
          comment: data.comment,
          isPaid: "НА МОДЕРАЦИИ",
        };

        const response = await axios.post(
          `${SERVER_URL}/forma-srochnyj-vykups`,
          {
            data: sellRequestData,
          }
        );

        if (response.data) {
          setSubmittedPhoneNumber(data.sellNumber);
          setShowConfirmationModal(true);
          reset();
        }
      } catch (error: any) {
        console.error("Ошибка при отправке формы:", error);
      }
    },
    [isAuthenticated, operator, reset]
  );

  const handleAuthSuccess = useCallback(() => {
    handleSubmit(onSubmitHandler)();
  }, [handleSubmit, onSubmitHandler]);

  return (
    <section className={styles.formContainer} id="sell-form">
      <h2 className={styles.formTitle}>
        Узнайте стоимость вашего номера за 5 минут
      </h2>

      <div className={styles.formWrapper}>
        <form
          className={styles.redemptionForm}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ваши контактные данные</label>
            <div className={styles.inputGroup}>
              <Input
                control={control}
                name="name"
                placeholder="Ваше имя"
                fullWidth
                required
              />

              <MaskedInput fullWidth control={control} name="contactPhone" />

              <Input
                control={control}
                required
                type="email"
                name="email"
                placeholder="Ваш email"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Информация о номере</label>
            <div className={styles.inputGroup}>
              <Select
                required
                value={operator}
                fullWidth
                onChange={(e) => setOperator(e.target.value)}
                options={[
                  "Выберите оператора",
                  "МТС",
                  "Билайн",
                  "Мегафон",
                  "Теле 2",
                ]}
              />

              <div className={styles.numberPriceRow}>
                <MaskedInput name="sellNumber" control={control} fullWidth />

                <div className={styles.priceInput}>
                  <Input
                    control={control}
                    name="price"
                    type="text"
                    placeholder="Желаемая цена"
                    fullWidth
                    required
                  />
                  <span className={styles.currencySymbol}>₽</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Дополнительная информация
            </label>

            <TextArea
              control={control}
              name="comment"
              placeholder="Расскажите о особенностях номера (необязательно)"
              fullWidth
              rows={4}
            />
          </div>

          <div className={styles.formActions}>
            <Checkbox control={control} name="agreement" />

            <Button
              arrow
              variant="default"
              type="submit"
              disabled={formState.isSubmitting}
              fullWidth
            >
              {formState.isSubmitting
                ? "Обрабатываем заявку..."
                : "Получить оценку номера"}
            </Button>
          </div>
        </form>
      </div>

      {/* Модалка авторизации */}
      <SellAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Модалка подтверждения */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        phoneNumber={submittedPhoneNumber}
      />
    </section>
  );
});

SellFormSection.displayName = "SellFormSection";
export default SellFormSection;
