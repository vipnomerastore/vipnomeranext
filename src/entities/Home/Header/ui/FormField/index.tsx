import React from "react";
import MaskedInput from "react-text-mask";

import styles from "../../Header.module.scss";

interface FormFieldProps {
  type: "text" | "tel" | "select";
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
  errorId?: string;
  mask?: (string | RegExp)[];
  options?: { value: string; label: string; disabled?: boolean }[];
  id?: string;
}

const FormField = (props: FormFieldProps) => {
  const {
    type,
    placeholder = "",
    value,
    onChange,
    error,
    errorId,
    mask,
    options,
    id,
  } = props;

  const ariaInvalid = !!error || undefined;
  const ariaDescribedBy = error ? errorId : undefined;

  return (
    <div className={styles.inputField}>
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          required
        >
          {options?.map(({ value: optValue, label, disabled }) => (
            <option key={optValue} value={optValue} disabled={disabled}>
              {label}
            </option>
          ))}
        </select>
      ) : type === "tel" && mask ? (
        <MaskedInput
          id={id}
          mask={mask}
          value={value}
          onChange={onChange}
          className={styles.inputField}
          type="tel"
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          required
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          required
        />
      )}
      {error && (
        <p id={errorId} className={styles.errorMessage}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
