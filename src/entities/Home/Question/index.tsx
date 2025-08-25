import { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import QuestionAccordion from "./ui/QuestionAccordion";
import { SERVER_URL } from "@/shared/api";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import TextArea from "@/shared/ui/TextArea";
import Checkbox from "@/shared/ui/Checkbox";
import Button from "@/shared/ui/Button";
import styles from "./Question.module.scss";

interface FormData {
  name: string;
  email: string;
  phone: string;
  question: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  name: "",
  email: "",
  phone: "",
  question: "",
  agreement: true,
};

const HomeQuestion = () => {
  const router = useRouter();

  const { control, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues,
  });

  const onSubmitHandler = useCallback(
    async (data: FormData) => {
      try {
        const payload = {
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            question: data.question,
          },
        };

        await axios.post(`${SERVER_URL}/forma-zadat-voproses`, payload);

        reset();
        router.push("/thank-you");
      } catch (error: unknown) {
        console.log(error);
      }
    },
    [router]
  );

  return (
    <div id="contacts" className={styles.questionWrapper}>
      <div className={styles.question}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>Вопрос / Ответ</h2>
        </div>

        <div className={styles.questionContent}>
          <QuestionAccordion />

          <div className={styles.questionForm}>
            <h2 className={styles.questionFormTitle}>
              Желаете задать свой вопрос?
            </h2>

            <form
              className={styles.formList}
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className={styles.inputList}>
                <Input
                  control={control}
                  name="fio"
                  required
                  placeholder="Введите ваше имя"
                  fullWidth
                />

                <Input
                  control={control}
                  name="email"
                  type="email"
                  placeholder="Введите вашу почту"
                  fullWidth
                />

                <MaskedInput control={control} name="phone" fullWidth />
              </div>

              <div className={styles.rightInputs}>
                <TextArea
                  name="question"
                  control={control}
                  fullWidth
                  placeholder="Введите ваш вопрос"
                />

                <div className={styles.formFooter}>
                  <Checkbox name="agreement" control={control} />

                  <Button
                    type="submit"
                    variant="outline"
                    arrow
                    disabled={formState.isSubmitting}
                  >
                    {formState.isSubmitting ? "Отправка..." : "Отправить"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeQuestion;
