"use client";

import Link from "next/link";

import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
      <ol
        className={styles.list}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={styles.item}
            itemScope
            itemType="https://schema.org/ListItem"
            itemProp="itemListElement"
          >
            {item.href ? (
              <Link href={item.href} className={styles.link} itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className={styles.current} itemProp="name">
                {item.label}
              </span>
            )}

            <meta itemProp="position" content={String(index + 1)} />

            {index < items.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
