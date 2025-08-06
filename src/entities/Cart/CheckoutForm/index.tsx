import { memo } from "react";
import { Checkbox } from "@mui/material";
import Link from "next/link";
import MaskedInput from "react-text-mask";

import { phoneMask } from "@/shared/const";

import styles from "./CheckoutForm.module.scss";
import { NumberItem } from "@/store/cartStore";

interface CheckoutFormProps {
  items: NumberItem[];
  activeDeliveryTab: string;
  activePaymentTab: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  podyezd: string;
  floor: string;
  apartment: string;
  comment: string;
  checked: boolean;

  onFullNameChange: (value: string) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onPodyezdChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onApartmentChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  setChecked: (value: boolean) => void;
}

const checkboxStyle = {
  color: "#fdfca4",
  "&.Mui-checked": { color: "#fdfca4" },
};

const CheckoutForm = memo(function CheckoutForm(props: CheckoutFormProps) {
  const {
    checked,
    setChecked,
    fullName,
    phone,
    email,
    city,
    street,
    podyezd,
    floor,
    apartment,
    comment,
    onFullNameChange,
    onPhoneChange,
    onEmailChange,
    onCityChange,
    onStreetChange,
    onPodyezdChange,
    onFloorChange,
    onApartmentChange,
    onCommentChange,
  } = props;

  return (
    <section className={styles.formContainer}>
      <h2 className={styles.formTitle}>ВАШИ ДАННЫЕ</h2>

      <form
        className={styles.redemptionForm}
        aria-label="Форма оформления заказа"
      >
        <input
          type="text"
          name="fullName"
          placeholder="ФИО"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          className={styles.input}
          required
          aria-label="Ваше имя"
        />

        <MaskedInput
          mask={phoneMask}
          type="tel"
          name="phone"
          placeholder="Номер телефона"
          value={phone}
          onChange={onPhoneChange}
          className={styles.input}
          required
          aria-label="Телефон для связи"
        />

        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={styles.input}
          required
          aria-label="Электронная почта"
        />

        <div className={`${styles.addressRow} ${styles.addressRowMain}`}>
          <input
            type="text"
            name="city"
            placeholder="Город"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className={styles.addressInput}
            required
            aria-label="Город"
          />
          <input
            type="text"
            name="street"
            placeholder="Улица и номер дома"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            className={styles.addressInput}
            required
            aria-label="Улица и номер дома"
          />
        </div>

        <div className={styles.addressRow}>
          <input
            type="text"
            name="podyezd"
            placeholder="Подъезд"
            value={podyezd}
            onChange={(e) => onPodyezdChange(e.target.value)}
            className={styles.addressInput}
            aria-label="Подъезд"
          />
          <input
            type="text"
            name="floor"
            placeholder="Этаж"
            value={floor}
            onChange={(e) => onFloorChange(e.target.value)}
            className={styles.addressInput}
            aria-label="Этаж"
          />
          <input
            type="text"
            name="apartment"
            placeholder="Квартира"
            value={apartment}
            onChange={(e) => onApartmentChange(e.target.value)}
            className={styles.addressInput}
            aria-label="Квартира"
          />
        </div>

        <textarea
          name="comment"
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          className={styles.textarea}
          rows={5}
          aria-label="Комментарий"
        />

        <div className={styles.bottom}>
          <div className={styles.checkboxContainer}>
            <Checkbox
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              required
              sx={checkboxStyle}
              aria-label="Согласие с политикой конфиденциальности"
            />

            <p className={styles.checkboxText}>
              Согласен с{" "}
              <Link href="/privacy-policy" className={styles.link}>
                Политикой конфиденциальности
              </Link>{" "}
              и{" "}
              <Link href="/terms-of-use" className={styles.link}>
                Пользовательским соглашением
              </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
});

export default CheckoutForm;
