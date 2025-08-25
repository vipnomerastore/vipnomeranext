"use client";

import React from "react";
import styles from "./PaginationClient.module.scss";

interface PaginationClientProps {
  page: number;
  count: number;
}

const PaginationClient = ({ page, count }: PaginationClientProps) => {
  if (count <= 1) return null;

  const handleClick = (value: number) => {
    if (value === 1) {
      window.location.href = "/blog";
    } else {
      window.location.href = `/blog?page=${value}`;
    }
  };

  const pages = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.pageItem} ${p === page ? styles.active : ""}`}
          onClick={() => handleClick(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default PaginationClient;
