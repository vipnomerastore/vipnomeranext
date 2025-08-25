import { useState, useEffect, useRef } from "react";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  styles: Record<string, string>;
  CalendarIcon: React.ReactNode;
  DropdownArrowIcon: React.ReactNode;
}

const CustomSelect = (props: CustomSelectProps) => {
  const { options, value, onChange, styles, CalendarIcon, DropdownArrowIcon } =
    props;

  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsOpen((open) => !open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen(e);
    }
  };

  const handleOptionClick = (option: string) => {
    onChange({ target: { value: option } });
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={`${styles.calendarSelectWrapper} ${isOpen ? styles.open : ""}`}
      style={{ position: "relative" }}
    >
      {CalendarIcon}
      <div
        className={styles.customSelect}
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Выберите период"
      >
        <span className={styles.selectText}>{value || "Выберите период"}</span>

        {DropdownArrowIcon}
      </div>

      {isOpen && (
        <ul className={styles.optionsList} role="listbox" tabIndex={-1}>
          {options.length ? (
            options.map((option) => (
              <li
                key={option}
                className={styles.option}
                role="option"
                aria-selected={value === option}
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(option);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOptionClick(option);
                  }
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li className={styles.option} aria-disabled="true" tabIndex={-1}>
              Нет доступных опций
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
