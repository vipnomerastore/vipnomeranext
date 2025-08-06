import { ChangeEvent } from "react";

import styles from "./TextArea.module.scss";

interface TextAreaProps {
  placeholder?: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const TextArea = (props: TextAreaProps) => {
  const { placeholder, name, value, onChange, error } = props;

  return (
    <div className={styles.wrapper}>
      <textarea
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.textarea} ${error ? styles.error : ""}`}
      />

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default TextArea;
