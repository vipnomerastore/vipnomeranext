import { memo, useCallback, useMemo } from "react";

import NumberMaskInput from "../NumberMaskInput";
import BestNumberSelect from "../BestNumberFilter";
import { tabsData } from "./const";

import styles from "./NumberMask.module.scss";

interface MaskProps {
  activeMaskTab: 0 | 1;
  setActiveMaskTab: (value: 0 | 1) => void;
  number: string[];
  setNumber: (value: string[]) => void;
  onApplyFilter: () => void;
  bestNumber: string[];
  setBestNumber: (value: string[]) => void;
}

const Mask = memo((props: MaskProps) => {
  const {
    activeMaskTab,
    setActiveMaskTab,
    number,
    setNumber,
    onApplyFilter,
    bestNumber,
    setBestNumber,
  } = props;

  const { maskText, maskSubText } = useMemo(() => {
    return activeMaskTab === 1
      ? {
          maskText:
            "Фильтр по маске позволяет подобрать номер по комбинации цифр, например, AABBAA найдет номера, оканчивающиеся на 778877, 113311 и т.д.",
          maskSubText: "*используйте символы (A, B и т.д.)",
        }
      : {
          maskText: "Укажите интересующую комбинацию цифр для поиска номера.",
          maskSubText: "*используйте цифры",
        };
  }, [activeMaskTab]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter") onApplyFilter();
    },
    [onApplyFilter]
  );

  const onTabClick = (value: 0 | 1) => {
    setActiveMaskTab(value);
    setNumber(Array(10).fill(""));
  };

  return (
    <div className={styles.mask}>
      <div className={styles.textBlock}>
        <h2 className={styles.maskTitle}>
          Выберите свою уникальную комбинацию
        </h2>
      </div>

      <div className={styles.maskContent}>
        <div className={styles.maskLeft}>
          <div className={styles.maskLeftTabs} role="tablist">
            {tabsData.map(({ id, label, value }) => (
              <div
                key={id}
                role="tab"
                id={`tab-${id}`}
                aria-controls={`panel-${id}`}
                aria-selected={activeMaskTab === value}
                className={`${styles.maskLeftTab} ${
                  activeMaskTab === value ? styles.active : ""
                }`}
                onClick={() => onTabClick(value)}
              >
                {label}
              </div>
            ))}

            <div className={styles.operatorsFilter}>
              <BestNumberSelect
                bestNumber={bestNumber}
                setBestNumber={setBestNumber}
              />
            </div>
          </div>

          <div className={styles.numberMaskWrapper}>
            <p className={styles.numberMaskTitle}>
              {activeMaskTab === 0 ? "Искать по номеру:" : "Искать по маске:"}
            </p>

            <div className={styles.numberMask}>
              <NumberMaskInput
                activeMaskTab={activeMaskTab}
                number={number}
                setNumber={setNumber}
                onApplyFilter={onApplyFilter}
              />

              <button
                className={styles.chooseButton}
                aria-label="Подобрать номер"
                onClick={onApplyFilter}
                onKeyDown={handleKeyDown}
              >
                Подобрать номер
              </button>
            </div>
          </div>
        </div>

        <div className={styles.maskRight}>
          <p className={styles.maskRightTitle}>{maskText}</p>
          <p className={styles.maskRightSubText}>{maskSubText}</p>
        </div>
      </div>
    </div>
  );
});

export default Mask;
