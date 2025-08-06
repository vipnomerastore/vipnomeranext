import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();

      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

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

      {isOpen &&
        createPortal(
          <ul
            className={styles.optionsList}
            ref={dropdownRef}
            role="listbox"
            tabIndex={-1}
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 1000,
            }}
          >
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
          </ul>,
          document.body
        )}
    </div>
  );
};

export default CustomSelect;
