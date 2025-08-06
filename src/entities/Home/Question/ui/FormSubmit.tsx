import { Checkbox } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

import styles from "../Question.module.scss";

interface FormSubmitProps {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  error?: string;
  errorId?: string;
}

const checkboxStyle = {
  color: "#fdfca4",

  "&.Mui-checked": { color: "#fdfca4" },
  width: 24,
  height: 24,
};

const FormSubmit = ({ agreed, setAgreed, error, errorId }: FormSubmitProps) => {
  return (
    <div className={styles.inputSubmit}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          sx={checkboxStyle}
        />

        <span className={styles.checkboxTitle}>
          Я согласен с{" "}
          <Link href="/privacy-policy" className={styles.checkboxTitleLink}>
            Политикой <br /> конфиденциальности
          </Link>{" "}
          и{" "}
          <Link href="/terms-of-use" className={styles.checkboxTitleLink}>
            <br /> Пользовательским соглашением
          </Link>
        </span>
      </div>

      {error && (
        <p
          style={{ marginTop: 15 }}
          id={errorId}
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </p>
      )}

      <button type="submit" className={styles.button}>
        <span>Отправить</span>
        <Image
          loading="lazy"
          src="/assets/home/question/next.svg"
          alt="следующий шаг"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default FormSubmit;
