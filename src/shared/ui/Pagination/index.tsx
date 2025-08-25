"use client";

import React from "react";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, count, onChange }: PaginationProps) => {
  if (count <= 1) return null;

  const pages = [];

  const half = Math.floor(5 / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(count, start + 5 - 1);

  // корректируем start если end вышел за границу
  start = Math.max(1, end - 5 + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const handlePrev = () => onChange(Math.max(1, page - 1));
  const handleNext = () => onChange(Math.min(count, page + 1));

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageItem}
        onClick={handlePrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        {"<"}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.pageItem} ${p === page ? styles.active : ""}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={styles.pageItem}
        onClick={handleNext}
        disabled={page === count}
        aria-label="Next page"
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
