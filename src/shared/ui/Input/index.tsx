"use client";

import { Controller } from "react-hook-form";
import styles from "./Input.module.scss";

interface InputProps {
  type?: string;
  placeholder?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  control: any;
  fullWidth?: boolean;
}

const Input = (props: InputProps) => {
  const {
    type,

    placeholder,

    name,

    required = false,

    disabled = false,

    autoComplete,

    minLength,

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
            value: required,
            message: "Это поле обязательно для заполнения",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              minLength={minLength}
              style={{ minWidth: fullWidth ? "100%" : "150px" }}
              className={`${styles.input} ${error ? styles.error : ""}`}
            />

            {error && (
              <span className={styles.errorMessage}>{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default Input;
