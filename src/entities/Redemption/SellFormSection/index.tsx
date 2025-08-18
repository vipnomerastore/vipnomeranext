import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { SERVER_URL } from "@/shared/api";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import TextArea from "@/shared/ui/TextArea";
import Select from "@/shared/ui/Select";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./SellFormSection.module.scss";

interface SellNumberItem {
  number: string;
  price: string;
}

interface FormData {
  name: string;
  contactPhone: string;
  operator: string;
  sellNumbers: SellNumberItem[];
  email: string;
  comment: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  name: "",
  contactPhone: "+7 ",
  operator: "",
  sellNumbers: [{ number: "", price: "" }],
  email: "",
  comment: "",
  agreement: true,
};

const SellFormSection: React.FC = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operator, setOperator] = useState("");

  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sellNumbers",
  });

  const onSubmitHandler = useCallback(
    async (data: FormData) => {
      try {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const sellNumberString = data.sellNumbers
          .map((item) => `${item.number} ${item.price.replace(/\s/g, "")}₽`)
          .join(", ");

        const payload = {
          data: {
            name: data.name,
            phone: data.contactPhone,
            operator: data.operator,
            sell_number: sellNumberString,
            email: data.email,
            comment: data.comment,
          },
        };

        await axios.post(`${SERVER_URL}/forma-srochnyj-vykups`, payload);

        reset();
        router.push("/thank-you");
      } catch (error: any) {
        console.error("Ошибка при отправке формы:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <section className={styles.formContainer}>
      <h2 className={styles.formTitle}>Заполните форму для продажи номера</h2>

      <form
        className={styles.redemptionForm}
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Input
          control={control}
          type="text"
          name="fio"
          placeholder="Ваше имя"
          fullWidth
        />

        <MaskedInput fullWidth control={control} name="contactPhone" />

        <Select
          value={operator}
          fullWidth
          onChange={(e) => setOperator(e.target.value)}
          options={["МТС", "Билайн", "Мегафон", "Теле 2"]}
        />

        {fields.map((item, idx) => (
          <div
            className={styles.operatorRow}
            key={item.id}
            style={{ alignItems: "center" }}
          >
            <Controller
              name={`sellNumbers.${idx}.number`}
              control={control}
              render={({ field }) => (
                <MaskedInput {...field} control={control} fullWidth />
              )}
            />
            <div
              className={styles.inputWrapper}
              style={{ flex: 1, position: "relative" }}
            >
              <Controller
                name={`sellNumbers.${idx}.price`}
                control={control}
                render={() => (
                  <Input
                    control={control}
                    name={`sellNumbers.${idx}.price`}
                    type="text"
                    placeholder="Цена"
                    fullWidth
                  />
                )}
              />
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  pointerEvents: "none",
                }}
              >
                ₽
              </span>
            </div>

            {idx !== 0 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  color: "#ff6b6b",
                  fontSize: 32,
                  cursor: "pointer",
                }}
                aria-label="Удалить номер"
              >
                ×
              </button>
            )}

            {idx === 0 && (
              <button
                type="button"
                onClick={() => append({ number: "", price: "" })}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  color: "#d9ad49",
                  fontSize: 32,
                  cursor: "pointer",
                }}
                aria-label="Добавить номер"
              >
                +
              </button>
            )}
          </div>
        ))}

        <Input
          control={control}
          type="email"
          name="email"
          placeholder="Почта"
          fullWidth
        />

        <TextArea
          control={control}
          name="comment"
          placeholder="Комментарий"
          fullWidth
          rows={4}
        />

        <Checkbox control={control} name="agreement" />

        <Button
          arrow
          variant="outline"
          type="submit"
          disabled={isSubmitting}
          fullWidth
        >
          Получить предложение
        </Button>
      </form>
    </section>
  );
});

export default SellFormSection;
