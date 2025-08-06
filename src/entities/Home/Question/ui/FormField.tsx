import MaskedInput from "react-text-mask";

import styles from "../Question.module.scss";

interface FormFieldProps {
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  errorId?: string;
  mask?: (string | RegExp)[];
}

const FormField = (props: FormFieldProps) => {
  const { type, placeholder, value, onChange, error, errorId, mask } = props;

  const commonProps = {
    placeholder,
    value,
    onChange,
    "aria-invalid": !!error,
    "aria-describedby": error ? errorId : undefined,
    className: styles.inputField,
  };

  return (
    <div className={styles.inputList}>
      {type === "textarea" ? (
        <textarea {...commonProps} className={styles.textareaField} rows={8} />
      ) : type === "tel" && mask ? (
        <MaskedInput {...commonProps} mask={mask} type="tel" />
      ) : (
        <input {...commonProps} type={type} />
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
