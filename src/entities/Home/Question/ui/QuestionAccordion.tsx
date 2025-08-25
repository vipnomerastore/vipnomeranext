import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import styles from "./QuestionAccordion.module.scss";

interface QuestionItem {
  id: number;
  title: string;
  content: string;
}

const items: QuestionItem[] = [
  {
    id: 1,
    title: "Ваши номера корпоративные?",
    content:
      "Нет, наши номера полностью переоформляются в собственность. Договор о переоформлении вы получаете в салоне связи вашего города или в личном кабинете мобильного оператора.",
  },
  {
    id: 2,
    title: "Как выглядит рассрочка без банка?",
    content:
      "Мы заключаем официальный договор с условиями рассрочки платежа. Максимальный срок оплаты 10 месяцев. После внесения последнего платежа, номер переоформляется на вас.",
  },
  {
    id: 3,
    title: "Как я получу номер?",
    content: "Есть 3 варианта получения номера: ESIM, Доставка, В салоне связи",
  },
  {
    id: 4,
    title: "Какие вы даете гарантии?",
    content:
      "Сделка полностью легальна и безопасна. Оплата вносится официально, а также обговариваются индивидуальные условия. Например, вы можете выбрать личную встречу с нашим представителем и оплатить услугу уже после переоформления номера. Также возможно заключение официального договора купли-продажи с юридическим лицом.",
  },
  {
    id: 5,
    title: "Какие есть виды оплаты?",
    content:
      "Вы можете оплатить заказ через онлайн-кассу или безналичным переводом от юридического лица по договору. Есть возможность оплаты наличными при личной встрече в нашем городе. Также мы принимаем криптовалюту (USDT).",
  },
];

const QuestionAccordion = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const contentRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    Object.entries(contentRefs.current).forEach(([key, ref]) => {
      if (ref) {
        ref.style.maxHeight = openId === +key ? `${ref.scrollHeight}px` : "0px";
      }
    });
  }, [openId]);

  return (
    <div className={styles.questionList}>
      {items.map(({ id, title, content }) => {
        const isOpen = id === openId;
        return (
          <div key={id} className={styles.accordionItem}>
            <button
              type="button"
              className={`${styles.accordionSummary} ${
                isOpen ? styles.active : ""
              }`}
              onClick={() => toggle(id)}
              aria-expanded={isOpen}
              aria-controls={`panel-${id}`}
              id={`header-${id}`}
            >
              <h3>{title}</h3>
              <div className={styles.endIcon}>
                <Image
                  src="/assets/home/question/arrow.svg"
                  alt="arrow"
                  width={16}
                  height={16}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              </div>
            </button>

            <div
              id={`panel-${id}`}
              role="region"
              aria-labelledby={`header-${id}`}
              className={styles.accordionDetails}
              ref={(el) => {
                contentRefs.current[id] = el;
              }}
            >
              <div className={styles.content}>{content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionAccordion;
