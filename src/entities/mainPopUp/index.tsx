"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import styles from "./mainpopUp.module.scss";
import Link from "next/link";

const CLOSE_SVG = (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#d9ad49"
      d="M23.361 21.15l-9.302-9.29 9.303-9.184.317-.317c.317-.422.422-.95.211-1.372-.211-.422-.529-.845-1.057-.95-.529-.106-1.057 0-1.586.528l-9.302 9.29-6.66-6.651L2.643.564C2.22.038 1.69-.068 1.163.038.634.142.21.565 0 1.092v.74c.106.422.423.738.74 1.055l9.09 9.079-9.09 9.078c-.317.317-.634.634-.74 1.056v.633c.211.634.529 1.056 1.163 1.267h.634c.423-.106.74-.422 1.057-.633l9.091-9.079 9.09 9.079c.318.316.53.527.952.633h.635l.21-.106c.53-.21.952-.738.952-1.372.106-.633-.105-.95-.422-1.372z"
    />
  </svg>
);

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const showCount = useRef(0);

  const closePopup = () => {
    setIsOpen(false);

    showCount.current = 1;
  };

  useEffect(() => {
    if (showCount.current >= 1) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 60000);

    const handleOutsideClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.popup} role="dialog" aria-modal="true">
      <div className={styles.popupWrapper}>
        <button
          className={styles.closeButton}
          onClick={closePopup}
          aria-label="Закрыть"
          type="button"
        >
          {CLOSE_SVG}
        </button>

        <div className={styles.popupContent} ref={popupRef}>
          <div className={styles.discountLabel}>
            <Image
              src="/assets/popup/gift.svg"
              width={24}
              height={24}
              alt="gift"
            />

            <p className={styles.discountText}>Выгода</p>
          </div>

          <h2 className={styles.title}>Подпишись на наши Telegram каналы</h2>

          <p className={styles.text}>
            Чтобы быть в курсе новинок и акций первыми
          </p>

          <div className={styles.buttons}>
            <Link
              className={styles.button}
              href="https://t.me/nomer_store"
              target="_blank"
            >
              Бюджетные номера до 50.000₽
            </Link>

            <Image
              src="/assets/popup/gift.svg"
              width={52}
              height={52}
              alt="gift"
            />

            <Link
              className={styles.button}
              href="https://t.me/vip_nomerastore"
              target="_blank"
            >
              Премиум номера от 50.000₽
            </Link>
          </div>

          <div className={styles.popupimg}>
            <Image
              src="/assets/popup/popup-img.webp"
              width={400}
              height={300}
              alt="WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
