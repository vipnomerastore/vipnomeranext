"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import Image from "next/image";
import { useForm } from "react-hook-form";
import axios from "axios";

import { SERVER_URL } from "@/shared/api";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import TextArea from "@/shared/ui/TextArea";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./Map.module.scss";

const YANDEX_MAPS_API_KEY = "11bca4c6-71bc-4e20-85ae-39d33f81d802";

interface FormData {
  fio: string;
  email: string;
  phone: string;
  info: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  fio: "",
  email: "",
  phone: "",
  info: "",
  agreement: true,
};

const HomeMap = () => {
  const router = useRouter();
  const { control, reset, handleSubmit, formState } = useForm<FormData>({
    defaultValues,
  });

  const onSubmitHandler = async (data: FormData) => {
    try {
      await axios.post(`${SERVER_URL}/forma-svyazatsya-s-namis`, {
        data: {
          name: data.fio,
          email: data.email,
          phone: data.phone,
          question: data.info,
        },
      });

      reset();
      router.push("/thank-you");
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
    }
  };

  return (
    <section id="contacts" className={styles.mapWrapper}>
      <div className={styles.content}>
        <h2 className={styles.title}>Контакты</h2>

        <div className={styles.map}>
          <YMaps query={{ apikey: YANDEX_MAPS_API_KEY, lang: "ru_RU" }}>
            <Map
              defaultState={{ center: [51.781406, 55.11], zoom: 16 }}
              options={{
                copyrightUaVisible: false,
                copyrightLogoVisible: false,
                copyrightProvidersVisible: false,
              }}
              className={styles.ymap}
            >
              <Placemark
                geometry={[51.781406, 55.114176]}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: "/assets/home/features/marker.svg",
                  iconImageSize: [30, 42],
                  iconImageOffset: [-15, -42],
                }}
              />
            </Map>
          </YMaps>

          <div className={styles.formContainer}>
            <h3 className={styles.formTitle}>Связаться с нами</h3>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className={styles.formBody}
            >
              <Input
                control={control}
                type="text"
                placeholder="Введите ваше имя"
                name="fio"
                required
                fullWidth
              />

              <Input
                control={control}
                type="email"
                placeholder="Введите ваш e-mail"
                name="email"
                fullWidth
              />

              <MaskedInput control={control} name="phone" fullWidth />

              <TextArea
                control={control}
                name="info"
                placeholder="Дополнительная информация"
                fullWidth
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
            </form>
          </div>

          <div className={styles.chips}>
            {[
              { label: "+7 933 333 33 11" },
              { label: "Пн-Пт 10:00–19:00" },
              { label: "Оренбург, пр. Победы, 73/1" },
            ].map((item, idx) => (
              <div key={idx} className={styles.chipWrapper}>
                <span className={styles.chip}>{item.label}</span>
              </div>
            ))}

            <Link
              href="https://t.me/+WNyOLaEoQ_dlMmEy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkChip}
            >
              <Image
                src="/assets/header/tg.svg"
                alt="Telegram"
                width={18}
                height={18}
                className={styles.chipIcon}
              />
            </Link>

            <Link
              href="https://api.whatsapp.com/send/?phone=%2B79333333311&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkChip}
            >
              <Image
                src="/assets/header/whatsapp.svg"
                alt="WhatsApp"
                width={28}
                height={28}
                className={styles.chipIcon}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMap;
