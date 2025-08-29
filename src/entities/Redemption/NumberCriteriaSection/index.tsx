import { memo } from "react";

import styles from "./NumberCriteriaSection.module.scss";

const criteria = [
  "Зеркальные комбинации (12321, 54345)",
  "Повторяющиеся цифры (777, 888, 999)",
  "Много нулей (9000, 8000, 7000)",
  "Парные числа (11, 22, 33, 44)",
  "Последовательные цифры (123, 567, 890)",
  "Запоминающиеся сочетания (007, 911)",
];

const NumberCriteriaSection = memo(() => (
  <section className={styles.listWrapper}>
    <h2 className={styles.listTitle}>
      Какой номер считается красивым и дорогим?
    </h2>

    <div className={styles.list}>
      {criteria.map((item, index) => (
        <div key={index} className={styles.listItem}>
          {item}
        </div>
      ))}
    </div>
  </section>
));

export default NumberCriteriaSection;
