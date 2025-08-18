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
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { control, reset, handleSubmit } = useForm({ defaultValues });

  const onSubmitHandler = async (data: FormData) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = {
        data: {
          name: data.fio,
          email: data.email,
          phone: data.phone,
          question: data.info,
        },
      };

      await axios.post(`${SERVER_URL}/forma-svyazatsya-s-namis`, payload);

      reset();
      router.push("/thank-you");
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contacts" className={styles.mapWrapper}>
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
            <h2>Связаться с нами</h2>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className={styles.formBody}
            >
              <Input
                control={control}
                type="text"
                placeholder="Введите ваше имя"
                name="fio"
                fullWidth
              />

              <Input
                control={control}
                type="email"
                placeholder="Введите ваш e-mail"
                name="email"
                fullWidth
              />

              <MaskedInput fullWidth name="phone" control={control} />

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
                  disabled={isSubmitting}
                >
                  Отправить
                </Button>
              </div>
            </form>
          </div>

          <div className={styles.chips}>
            <div className={styles.chipWrapper}>
              <span className={styles.chip}>+7 933 333 33 11</span>{" "}
            </div>

            <div className={styles.chipWrapper}>
              <span className={styles.chip}>Пн-Пт 10:00–19:00</span>
            </div>

            <div className={styles.chipWrapper}>
              <span className={styles.chip}>Оренбург, пр. Победы, 73/1</span>
            </div>

            <span className={styles.linkChip}>
              <Link
                href="https://t.me/+WNyOLaEoQ_dlMmEy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/header/tg.svg"
                  alt="Telegram"
                  className={styles.chipIcon}
                  width={18}
                  height={18}
                />
              </Link>
            </span>

            <span className={styles.linkChip}>
              <Link
                href="https://api.whatsapp.com/send/?phone=%2B79333333311&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  width={28}
                  height={28}
                  src="/assets/header/whatsapp.svg"
                  alt="WhatsApp"
                  className={styles.chipIcon}
                />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMap;
