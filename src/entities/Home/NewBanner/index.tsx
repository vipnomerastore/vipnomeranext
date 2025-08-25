"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { UseSlide } from "./hooks";

import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import MaskedInput from "@/shared/ui/MaskedInput";
import Checkbox from "@/shared/ui/Checkbox";
import styles from "./NewBanner.module.scss";

export interface NumberData {
  id: string;
  phone: string;
  region: string[];
  price?: number;
  old_price?: number | null;
  credit_month_count?: number;
  part_price?: number;
  partner_price?: number;
}

export interface SlideData {
  title: string;
  timer?: string;
  discount?: string;
  numbers: NumberData[];
}

export interface FormData {
  fio: string;
  email: string;
  phone: string;
  info: string;
  agreement: boolean;
}

const defaultValues: FormData = {
  fio: "",
  email: "",
  phone: "+7",
  info: "",
  agreement: true,
};

const HomeNewBanner = () => {
  const [slidesData, setSlidesData] = useState<(SlideData | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { renderSlide } = UseSlide({ slidesData, setIsModalOpen });

  const swiperRef = useRef<any>(null);
  const router = useRouter();

  const { control, reset, handleSubmit, formState } = useForm({
    defaultValues,
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const slideIdx = customEvent.detail ?? 0;
      const el = document.getElementById("action");

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (swiperRef.current && swiperRef.current.slideTo) {
        swiperRef.current.slideTo(slideIdx, 500);
      }
    };

    window.addEventListener("scrollToNewBanner", handler as EventListener);

    return () =>
      window.removeEventListener("scrollToNewBanner", handler as EventListener);
  }, []);

  const fetchSlideData = useCallback(
    async (index: number, endpoint: string, count: number) => {
      try {
        const response = await fetch(
          `${SERVER_URL}/${endpoint}?pagination[page]=1&pagination[pageSize]=1&populate=numbers`,
          {
            next: { revalidate: CACHE_TIMES.LONG },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const data = responseData?.data || {};
        const numbers = (data.numbers || [])
          .slice(0, count)
          .map((item: any) => ({
            id: item.documentId,
            phone: item.phone || "+799 2222 7 222",
            price: item.price || 250000,
            old_price: item.old_price || 300000,
            credit_month_count: item.credit_month_count,
            part_price: item.part_price,
            partner_price: item.partner_price,
            region: item.region || [],
          }));

        setSlidesData((prev) => {
          const newArr = [...prev];

          newArr[index] = {
            title: data.title ?? `Слайд ${index + 1}`,
            timer: data.timer,
            discount: data.discount,
            numbers,
          };

          return newArr;
        });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  useEffect(() => {
    fetchSlideData(0, "banner-s-tajmerom", 1);
    fetchSlideData(1, "banner-s-4-nomerami", 4);
    fetchSlideData(2, "nomer-dnya", 1);
    fetchSlideData(3, "chasto-pokupayut", 2);
    fetchSlideData(4, "parnye-nomera", 2);
    fetchSlideData(5, "nomera-v-rezerv", 4);
  }, [fetchSlideData]);

  const onModalClose = () => {
    reset();
    setIsModalOpen(false);
  };

  const onModalOpen = () => {
    setIsModalOpen(false);
  };

  // Отправка формы модального окна
  const onSubmitHandler = async (data: { fio: string; phone: string }) => {
    try {
      const payload = { data: { name: data.fio, phone: data.phone } };

      await axios.post(`${SERVER_URL}/forma-s-banneras`, payload);

      onModalClose();
      router.push("/thank-you");
    } catch (error: any) {
      console.log(error);
    }
  };

  const modalContent = isModalOpen ? (
    <div className={styles.modalOverlay} onClick={onModalOpen}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 className={styles.modalTitle}>Заполните форму</h2>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className={styles.modalForm}
        >
          <Input
            control={control}
            name="fio"
            required
            placeholder="Введите ваше имя"
            fullWidth
          />

          <MaskedInput fullWidth name="phone" control={control} />

          <Checkbox name="agreement" control={control} />

          <Button
            type="submit"
            disabled={formState.isSubmitting}
            fullWidth
            variant="outline"
          >
            {formState.isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        </form>
      </div>
    </div>
  ) : null;

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  return (
    <div id="action" className={styles.actionGalleryWrapper}>
      {modalRoot && createPortal(modalContent, modalRoot)}

      <div className={styles.actionWrapper}>
        <div className={styles.actionContent}>
          <Swiper
            modules={[FreeMode]}
            className={styles.mainSwiper}
            autoHeight={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
          >
            {[0, 1, 2, 3, 4].map((idx) => (
              <SwiperSlide key={idx}>{renderSlide(idx)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeNewBanner;
