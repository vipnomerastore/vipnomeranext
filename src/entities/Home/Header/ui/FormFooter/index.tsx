import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Image from "next/image";

import styles from "../../Header.module.scss";
import Button from "@/shared/ui/Button";

interface FormFooterProps {
  agreed: boolean;
  setAgreed: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
  errorId?: string;
}

const checkboxStyle = {
  color: "#a0a0a0",
  padding: "4px",

  "&.Mui-checked": {
    color: "#fdfca4",
  },

  "& .MuiTouchRipple-root": {
    color: "#fdfca4",
  },
};

const FormFooter = ({ agreed, setAgreed, error, errorId }: FormFooterProps) => {
  return (
    <div className={styles.formFooter}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          sx={checkboxStyle}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-live="polite"
        />
        <p className={styles.checkboxText}>
          Отправляя форму я соглашаюсь с{" "}
          <Link href="/privacy-policy" className={styles.link}>
            Политикой конфиденциальности
          </Link>{" "}
          и{" "}
          <Link href="/terms-of-use" className={styles.link}>
            Пользовательским соглашением
          </Link>
        </p>
      </div>

      <Button type="submit" variant="outline" arrow>
        Отправить
      </Button>
    </div>
  );
};

export default FormFooter;
