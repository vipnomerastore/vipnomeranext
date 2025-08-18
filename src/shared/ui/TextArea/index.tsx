"use client";

import { Controller } from "react-hook-form";
import styles from "./TextArea.module.scss";
import React from "react";

interface TextAreaControlProps {
  name: string;
  control: any;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  fullWidth?: boolean;
  rows?: number;
}

const TextArea: React.FC<TextAreaControlProps> = ({
  name,

  control,

  placeholder,

  disabled = false,

  required = false,

  autoComplete,

  minLength,

  maxLength,

  fullWidth,

  rows = 4,
}) => {
  return (
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
        <div className={styles.wrapper}>
          <textarea
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            minLength={minLength}
            maxLength={maxLength}
            rows={rows}
            style={{ minWidth: fullWidth ? "100%" : "150px" }}
            className={`${styles.input} ${error ? styles.error : ""}`}
          />

          {error && (
            <span className={styles.errorMessage}>{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default TextArea;
