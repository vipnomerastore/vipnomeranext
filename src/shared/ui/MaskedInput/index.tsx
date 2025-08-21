"use client";

import { Controller } from "react-hook-form";
import ReactMaskedInput from "react-text-mask";
import styles from "./MakedInput.module.scss";

const phoneMask = [
  "+",
  "7",
  " ",
  "(",
  /\d/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

interface MaskedInputProps {
  name: string;
  disabled?: boolean;
  fullWidth?: boolean;
  control: any;
}

const MaskedInput = (props: MaskedInputProps) => {
  const {
    name,

    disabled = false,

    fullWidth,

    control,
  } = props;

  return (
    <div className={styles.wrapper}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: {
            value: true,
            message: "Это поле обязательно для заполнения",
          },
          validate: (value: string) => {
            const digits = value.replace(/\D/g, "");

            if (digits.length !== 11) {
              return "Введите корректный номер телефона";
            }

            return true;
          },
        }}
        render={({ field, fieldState: { error } }) => {
          const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
            const input = e.target as HTMLInputElement;
            // Устанавливаем курсор в начало после маски "+7 ("
            setTimeout(() => {
              input.setSelectionRange(4, 4);
            }, 0);
          };

          return (
            <>
              <ReactMaskedInput
                {...field}
                mask={phoneMask}
                type="tel"
                name={name}
                placeholder="Номер телефона"
                className={`${styles.input} ${error ? styles.error : ""}`}
                disabled={disabled}
                aria-label="Номер телефона"
                style={{ minWidth: fullWidth ? "100%" : "150px" }}
                onClick={handleClick}
              />

              {error && (
                <span className={styles.errorMessage}>{error.message}</span>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default MaskedInput;
