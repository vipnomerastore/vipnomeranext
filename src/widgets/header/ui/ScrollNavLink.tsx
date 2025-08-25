"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent } from "react";

import styles from "../Header.module.scss";

interface ScrollNavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  setMenuOpen?: (open: boolean) => void;
  className?: string;
}

const ScrollNavLink = ({
  href,
  children,
  setMenuOpen,
  className = "",
  ...props
}: ScrollNavLinkProps) => {
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const [targetPath, hash] = href.split("#");
    const normalizedTargetPath = targetPath || "/";

    // Если ссылка на тот же путь и есть хэш
    if (normalizedTargetPath === pathname && hash) {
      e.preventDefault();

      if (typeof document !== "undefined") {
        const element = document.getElementById(hash);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setMenuOpen?.(false);
        }
      }
    } else {
      setMenuOpen?.(false);
    }
  };

  const isActive = pathname === (href.split("#")[0] || "/");

  return (
    <Link
      href={href}
      className={`${styles.navItem} ${
        isActive ? styles.active : ""
      } ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ScrollNavLink;
