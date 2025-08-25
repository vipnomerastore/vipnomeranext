import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import styles from "./NumberMaskInput.module.scss";

interface NumberMaskInputProps {
  activeMaskTab: 0 | 1;
  number: string[];
  setNumber: (value: string[]) => void;
  onApplyFilter?: () => void;
}

const NumberMaskInput = (props: NumberMaskInputProps) => {
  const { activeMaskTab, number, setNumber, onApplyFilter } = props;

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const charLimit = useMemo(
    () => (activeMaskTab === 1 ? /^[A-Z]$/i : /^\d$/),
    [activeMaskTab]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (index === 0) return;

      const value = e.target.value.trim().slice(-1);

      if (value === "" || charLimit.test(value)) {
        const newNumber = [...number];
        newNumber[index] = activeMaskTab === 1 ? value.toUpperCase() : value;
        setNumber(newNumber);

        if (value && index < number.length - 1) {
          inputsRef.current[index + 1]?.focus();
        } else if (value === "" && index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      }
    },
    [activeMaskTab, charLimit, number, setNumber]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (index === 0 && e.key === "Backspace") {
        e.preventDefault();

        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        const newNumber = [...number];

        if (number[index]) {
          newNumber[index] = "";
          setNumber(newNumber);
        } else if (index > 0) {
          newNumber[index - 1] = "";
          setNumber(newNumber);
          inputsRef.current[index - 1]?.focus();
        }
      } else if (e.key === "Enter" && onApplyFilter) {
        e.preventDefault();

        onApplyFilter();
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();

        inputsRef.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < number.length - 1) {
        e.preventDefault();

        inputsRef.current[index + 1]?.focus();
      }
    },
    [number, setNumber, onApplyFilter]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
    },
    []
  );

  const inputGroups = useMemo(
    () => [
      { count: 3, offset: 0, className: styles.numbersMaskInputsTwo },
      { count: 3, offset: 3, className: styles.numbersMaskInputsTwo },
      { count: 2, offset: 6, className: styles.numbersMaskInputsThree },
      { count: 2, offset: 8, className: styles.numbersMaskInputsThree },
    ],
    []
  );

  const setInputRef =
    (index: number) =>
    (el: HTMLInputElement | null): void => {
      inputsRef.current[index] = el;
    };

  useEffect(() => {
    if (number[0] !== "9") {
      const newNumber = [...number];
      newNumber[0] = "9";

      setNumber(newNumber);
    }
  }, [number, setNumber]);

  return (
    <div className={styles.numbersMaskInputsWrapper}>
      <div className={styles.numbersMaskInputsOne}>
        <input
          type="text"
          value="+7"
          disabled
          aria-label="Country code"
          readOnly
        />
      </div>

      {inputGroups.map(({ count, offset, className }, groupIndex) => (
        <div key={`group-${groupIndex}`} className={className}>
          {Array.from({ length: count }).map((_, itemIndex) => {
            const refIndex = offset + itemIndex;

            return (
              <input
                key={`input-${refIndex}`}
                type="text"
                maxLength={1}
                inputMode={activeMaskTab === 1 ? "text" : "numeric"}
                pattern={activeMaskTab === 1 ? undefined : "\\d*"}
                value={number[refIndex] || ""}
                placeholder={activeMaskTab === 1 ? "A" : "X"}
                ref={setInputRef(refIndex)}
                disabled={refIndex === 0}
                readOnly={refIndex === 0}
                onChange={(e) => handleChange(e, refIndex)}
                onKeyDown={(e) => handleKeyDown(e, refIndex)}
                onPaste={handlePaste}
                aria-label={`Digit ${refIndex + 1} of phone number`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default memo(NumberMaskInput);
