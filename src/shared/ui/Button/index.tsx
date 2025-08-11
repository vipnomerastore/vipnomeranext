import React from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  arrow?: boolean;
  fullWidth?: boolean;
}

const arrowIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.4707 5.47032C13.3302 5.61094 13.2513 5.80157 13.2513 6.00032C13.2513 6.19907 13.3302 6.38969 13.4707 6.53032L18.1907 11.2503H4.00066C3.80175 11.2503 3.61098 11.3293 3.47033 11.47C3.32968 11.6106 3.25066 11.8014 3.25066 12.0003C3.25066 12.1992 3.32968 12.39 3.47033 12.5306C3.61098 12.6713 3.80175 12.7503 4.00066 12.7503H18.1907L13.4707 17.4703C13.397 17.539 13.3379 17.6218 13.2969 17.7138C13.2559 17.8058 13.2338 17.9051 13.2321 18.0058C13.2303 18.1065 13.2488 18.2065 13.2865 18.2999C13.3243 18.3933 13.3804 18.4781 13.4516 18.5494C13.5228 18.6206 13.6077 18.6767 13.7011 18.7144C13.7945 18.7522 13.8945 18.7707 13.9952 18.7689C14.0959 18.7671 14.1952 18.7451 14.2872 18.7041C14.3792 18.6631 14.462 18.604 14.5307 18.5303L20.5307 12.5303C20.6711 12.3897 20.75 12.1991 20.75 12.0003C20.75 11.8016 20.6711 11.6109 20.5307 11.4703L14.5307 5.47032C14.39 5.32987 14.1994 5.25098 14.0007 5.25098C13.8019 5.25098 13.6113 5.32987 13.4707 5.47032Z"
      fill="#00150B"
    />
  </svg>
);

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  arrow = false,
  children,
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.button, {
        [styles.outline]: variant === "outline",
        [styles.arrow]: arrow,
        [styles.fullWidth]: fullWidth,
      })}
      {...props}
    >
      {children}

      {arrow && <span className={styles.arrowIcon}>{arrowIcon}</span>}
    </button>
  );
};

export default Button;
