import FormField from "../ui/FormField";
import FormSubmit from "../ui/FormSubmit";

import { phoneMask } from "@/shared/const";

import styles from "../Question.module.scss";

export interface FormData {
  name: string;
  email: string;
  phone: string;
  question: string;
  agreedToTerms: boolean;
}

interface QuestionFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const QuestionForm = (props: QuestionFormProps) => {
  const { formData, setFormData, errors, onSubmit } = props;

  return (
    <div className={styles.questionForm}>
      <h2 className={styles.questionFormTitle}>Желаете задать свой вопрос?</h2>

      <form className={styles.formList} onSubmit={onSubmit}>
        <div className={styles.inputList}>
          <FormField
            type="text"
            placeholder="Введите ваше имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            errorId="name-error"
          />

          <FormField
            type="email"
            placeholder="Введите вашу почту"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            errorId="email-error"
          />

          <FormField
            type="tel"
            placeholder="Номер телефона"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={errors.phone}
            errorId="phone-error"
            mask={phoneMask}
          />
        </div>
        <div className={styles.rightInputs}>
          <FormField
            type="textarea"
            placeholder="Введите ваш вопрос"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            error={errors.question}
            errorId="question-error"
          />

          <FormSubmit
            agreed={formData.agreedToTerms}
            setAgreed={(value) =>
              setFormData({ ...formData, agreedToTerms: value })
            }
            error={errors.agreedToTerms}
            errorId="terms-error"
          />
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
