import React from "react";
import clsx from "clsx";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  arrow?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = "default", arrow = false, children, className, ...props }) => {
  return (
    <button
      className={clsx(styles.button, className, {
        [styles.outline]: variant === "outline",
        [styles.arrow]: arrow,
      })}
      {...props}
    >
      {children}
      {arrow && <span className={styles.arrowIcon}>→</span>}
    </button>
  );
};

export default Button;
