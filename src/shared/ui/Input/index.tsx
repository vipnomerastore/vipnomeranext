import { ChangeEvent } from "react";

import styles from "./Input.module.scss";

interface InputProps {
  type?: string;
  placeholder?: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input = (props: InputProps) => {
  const { type, placeholder, name, value, onChange, error } = props;

  return (
    <div className={styles.wrapper}>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ""}`}
      />

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
