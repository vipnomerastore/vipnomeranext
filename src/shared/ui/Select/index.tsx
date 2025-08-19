"use client";

import React from "react";

import styles from "./Select.module.scss";

interface SelectProps {
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Select = (props: SelectProps) => {
  const { value, onChange, options, required, error, disabled, fullWidth } =
    props;

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        style={{ width: fullWidth ? "100%" : "150px" }}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options?.map((value) => (
          <option key={value} value={value} disabled={disabled}>
            {value}
          </option>
        ))}
      </select>

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Select;
