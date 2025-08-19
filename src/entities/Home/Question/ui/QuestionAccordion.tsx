import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Image from "next/image";

import styles from "../Question.module.scss";

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
  return (
    <div className={styles.questionList}>
      {items.map(({ id, title, content }) => (
        <Accordion
          key={id}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            color: "#fff",
            boxShadow: "none",

            "&:before": { display: "none" },
          }}
          disableGutters
        >
          <AccordionSummary
            expandIcon={
              <div className={styles.endIcon} aria-hidden="true">
                <Image
                  loading="lazy"
                  src="/assets/home/question/arrow.svg"
                  alt="arrow"
                  width={16}
                  height={16}
                />
              </div>
            }
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              minHeight: 48,
              fontWeight: 500,
              "&.Mui-expanded": { color: "#d9ad49" },
              "& .MuiAccordionSummary-content": { margin: "12px 0" },
            }}
            aria-controls={`panel-content-${id}`}
            id={`panel-header-${id}`}
          >
            <h3>{title}</h3>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              padding: "10px 16px 16px",
            }}
            id={`panel-content-${id}`}
            aria-labelledby={`panel-header-${id}`}
          >
            <div>{content}</div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default QuestionAccordion;
