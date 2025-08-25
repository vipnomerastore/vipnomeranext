"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Menu.module.scss";

interface Option {
  id?: number;
  label: string;
  value?: string;
  sortBy?: string;
  order?: "asc" | "desc" | "none";
  icon?: string | null;
}

interface MenuProps {
  value?: string; // для обычного выбора
  sortBy?: string; // для сортировки
  order?: "asc" | "desc" | "none"; // для сортировки
  onChange: (option: Option) => void;
  options: Option[];
  placeholder?: string;
}

const Menu: React.FC<MenuProps> = ({
  value,
  sortBy,
  order,
  onChange,
  options,
  placeholder = "Выберите",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((opt) =>
    sortBy !== undefined && order !== undefined
      ? opt.sortBy === sortBy && opt.order === order
      : opt.value === value
  ) ||
    options[0] || { label: placeholder, value: "" };

  const toggleOpen = () => setOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    onChange(option);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!options || options.length === 0) return null;

  return (
    <div className={styles.selectWrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.selectButton}
        onClick={toggleOpen}
      >
        {currentOption.icon && (
          <Image
            src={currentOption.icon}
            width={20}
            height={20}
            alt={currentOption.label}
          />
        )}
        <span>{currentOption.label}</span>

        <div className={`${styles.endIcon} ${open ? styles.open : ""}`}>
          <Image
            src="/assets/home/sorting/arrow.svg"
            width={12}
            height={12}
            alt="arrow"
          />
        </div>
      </button>

      {open && (
        <ul className={styles.dropdownMenu}>
          {options.map((opt, idx) => {
            const isSelected =
              sortBy !== undefined && order !== undefined
                ? opt.sortBy === sortBy && opt.order === order
                : opt.value === value;

            return (
              <li
                key={opt.id ?? idx}
                className={`${styles.dropdownItem} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleSelect(opt)}
              >
                {opt.icon && (
                  <Image
                    src={opt.icon}
                    width={20}
                    height={20}
                    alt={opt.label}
                  />
                )}
                <span>{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Menu;
