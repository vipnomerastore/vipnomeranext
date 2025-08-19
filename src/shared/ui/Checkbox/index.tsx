"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox as MaterialCheckbox } from "@mui/material";
import Link from "next/link";

import styles from "./Checkbox.module.scss";

const checkboxStyle = {
  color: "#fdfca4",
  "&.Mui-checked": { color: "#fdfca4" },
};

interface CheckboxProps {
  name: string;
  disabled?: boolean;
  control: any;
}

const Checkbox = (props: CheckboxProps) => {
  const { name, control } = props;

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
          <div className={styles.wrapper}>
            <div className={styles.checkboxWrapper}>
              <MaterialCheckbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                sx={checkboxStyle}
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

            {error && (
              <span className={styles.errorMessage}>{error.message}</span>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Checkbox;
