"use client";

import { forwardRef, memo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

import { SERVER_URL } from "@/shared/api";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./FormSection.module.scss";

type FormData = {
  fullName: string;
  city: string;
  phoneNumber: string;
  agreement: boolean;
};

const defaultValues: FormData = {
  fullName: "",
  city: "",
  phoneNumber: "+7 ",
  agreement: true,
};

const FormSection = forwardRef<HTMLElement>((_, ref) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { control, reset, handleSubmit } = useForm<FormData>({
    defaultValues,
  });

  const onSubmitHandler = useCallback(
    async (data: FormData) => {
      try {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const payload = {
          data: {
            fio: data.fullName,
            city: data.city,
            phone: data.phoneNumber,
          },
        };

        await axios.post(`${SERVER_URL}/forma-stat-partnyoroms`, payload);

        reset();
        router.push("/thank-you");
      } catch (error: unknown) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <section id="form" ref={ref} className={styles.section}>
      <div className={styles.sectionContent}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Станьте нашим представителем и начните доходный бизнес без вложений
          </h2>

          <p className={styles.subtitle}>
            Заполните форму заявки, и мы свяжемся с вами для уточнения деталей
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
          <Input
            control={control}
            name="fullName"
            placeholder="Ваше ФИО"
            fullWidth
          />

          <Input control={control} name="city" placeholder="Город" fullWidth />

          <MaskedInput control={control} name="phoneNumber" fullWidth />

          <Checkbox control={control} name="agreement" />

          <Button type="submit" arrow variant="outline" disabled={isSubmitting}>
            Отправить
          </Button>
        </form>
      </div>
    </section>
  );
});

FormSection.displayName = "FormSection";

export default memo(FormSection);
