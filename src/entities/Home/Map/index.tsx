"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Checkbox } from "@mui/material";
import MaskedInput from "react-text-mask";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";

import { SERVER_URL } from "@/shared/api";
import { phoneMask } from "@/shared/const";
import styles from "./Map.module.scss";

const YANDEX_MAPS_API_KEY = "11bca4c6-71bc-4e20-85ae-39d33f81d802";

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

const TOASTER_STYLE = {
  style: {
    background: "#242423",
    color: "#fff",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "12px 16px",
  },
  success: {
    style: {
      borderLeft: "4px solid #d9ad49",
    },
  },
  error: {
    style: {
      borderLeft: "4px solid #ff6b6b",
    },
  },
};

const HomeMap = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    info: "",
  });
  const [agreed, setAgreed] = useState(true);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Пожалуйста, введите ваше имя.");

      return;
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      toast.error("Пожалуйста, введите корректный email.");

      return;
    }

    const cleanedPhone = formData.phone.replace(/\D/g, "");

    if (!cleanedPhone.match(/^\+?7\d{10}$/)) {
      toast.error(
        "Пожалуйста, введите полный номер телефона (10 цифр после +7)."
      );

      return;
    }

    if (!formData.info.trim()) {
      toast.error("Пожалуйста, введите дополнительную информацию.");

      return;
    }

    if (!agreed) {
      toast.error(
        "Необходимо согласиться с Политикой конфиденциальности и Пользовательским соглашением."
      );

      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/forma-svyazatsya-s-namis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        await response.json();

        toast.success("Ваш вопрос успешно отправлен!", {
          duration: 3000,
          position: "top-right",
        });
        setFormData({ name: "", email: "", phone: "", info: "" });
        setAgreed(true);
        router.push("/thank-you");
      } else {
        const errorData = await response.json();

        console.error("Ошибка при отправке формы:", errorData);
        toast.error(
          `Ошибка при отправке: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Ошибка при отправке. Попробуйте позже.");
    }
  };

  return (
    <div id="contacts" className={styles.mapWrapper}>
      <Toaster toastOptions={TOASTER_STYLE} />

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

            <form onSubmit={handleSubmit} className={styles.formBody}>
              <input
                type="text"
                placeholder="Введите ваше имя"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.formField}
              />

              <input
                type="email"
                placeholder="Введите ваш e-mail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.formField}
              />

              <MaskedInput
                mask={phoneMask}
                className={styles.formField}
                type="tel"
                placeholder="Номер телефона"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />

              <textarea
                placeholder="Дополнительная информация"
                name="info"
                value={formData.info}
                onChange={handleInputChange}
                className={`${styles.formField} ${styles.formFieldMultiline}`}
                rows={4}
              />

              <div className={styles.formFooter}>
                <div className={styles.checkboxWrapper}>
                  <Checkbox
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    sx={checkboxStyle}
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

                <button type="submit" className={styles.button}>
                  <span>Отправить</span>
                  <Image
                    src="/assets/home/question/next.svg"
                    alt="Отправить"
                    width={16}
                    height={16}
                  />
                </button>
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
