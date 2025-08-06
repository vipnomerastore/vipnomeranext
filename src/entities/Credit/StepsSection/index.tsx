import { memo } from "react";
import Link from "next/link";

import styles from "./StepsSection.module.scss";

interface Step {
  title: string;
  description: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "1",
    description: (
      <>
        Заключаем договор рассрочки, <br /> подписываемый электронной подписью{" "}
        <br /> через сервис{" "}
        <Link className={styles.link} href="#">
          Подислон
        </Link>
      </>
    ),
  },
  { title: "2", description: "Вносите первый платеж" },
  {
    title: "3",
    description: (
      <>
        Получаете номер любым способом: <br /> eSIM, курьерской доставкой <br />{" "}
        или в салоне связи
      </>
    ),
  },
];

const StepsSection = memo(function StepsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Всего три простых шага для покупки красивого номера в рассрочку
          </h2>
        </div>

        <ol className={styles.stepsContainer}>
          {steps.map((step) => (
            <li key={step.title} className={`${styles.step} ${styles.visible}`}>
              <span className={styles.stepNumber}>{step.title}</span>
              <p className={styles.stepDescription}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
});

export default StepsSection;
