import { memo } from "react";

import { NumberItem } from "@/store/cartStore";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./CheckoutForm.module.scss";
import { FormProvider, useForm } from "react-hook-form";

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

const CheckoutForm = memo(function CheckoutForm(props: CheckoutFormProps) {
  const {
    checked,
    setChecked,
    fullName,
    phone,
    onFullNameChange,
    onPhoneChange,
  } = props;

  const { control, handleSubmit } = useForm();

  return (
    <section className={styles.formContainer}>
      <h2 className={styles.formTitle}>ВАШИ ДАННЫЕ</h2>

      <form
        className={styles.redemptionForm}
        aria-label="Форма оформления заказа"
      >
        <Input
          control={control}
          type="text"
          fullWidth
          name="fullName"
          placeholder="Имя"
          required
          aria-label="Ваше имя"
        />

        <MaskedInput name="phone" fullWidth control={control} />

        <Checkbox name="agreement" control={control} />
      </form>
    </section>
  );
});

export default CheckoutForm;
