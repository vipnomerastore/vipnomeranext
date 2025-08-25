"use client";

import React from "react";
import { Controller } from "react-hook-form";
import Link from "next/link";

import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  name: string;
  disabled?: boolean;
  control: any;
}

const Checkbox = ({ name, control, disabled }: CheckboxProps) => {
  return (
    <div className={styles.wrapper}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: {
            value: true,
            message:
              "Вы должны согласиться с политикой конфиденциальности и пользовательским соглашением",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={disabled}
                className={styles.checkboxInput}
              />

              <span className={styles.checkboxCustom}></span>

              <span className={styles.checkboxText}>
                Согласен с{" "}
                <Link href="/privacy-policy" className={styles.link}>
                  Политикой конфиденциальности
                </Link>{" "}
                и{" "}
                <Link href="/terms-of-use" className={styles.link}>
                  Пользовательским соглашением
                </Link>
              </span>
            </label>

            {error && (
              <span className={styles.errorMessage}>{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default Checkbox;
