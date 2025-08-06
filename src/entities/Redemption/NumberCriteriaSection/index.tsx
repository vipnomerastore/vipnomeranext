import { memo } from "react";

import styles from "./NumberCriteriaSection.module.scss";

const criteria = [
  "Зеркальные комбинации",
  "Повторяющиеся цифры",
  "Много нулей",
  "Парные числа",
  "Последовательные цифры",
  "Запоминающиеся сочетания",
];

const NumberCriteriaSection: React.FC = memo(() => (
  <section className={styles.listWrapper}>
    <h2 className={styles.listTitle}>Какой номер считается красивым?</h2>

    <div className={styles.list}>
      <div className={styles.listLeft}>
        {criteria.map((item, index) => (
          <div key={index} className={styles.listItem}>
            {item}
          </div>
        ))}
      </div>
    </div>
  </section>
));

export default NumberCriteriaSection;
