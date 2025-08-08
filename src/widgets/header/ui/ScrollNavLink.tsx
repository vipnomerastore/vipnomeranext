import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "../Header.module.scss";

interface ScrollNavLinkProps {
  href: string;
  children: React.ReactNode;
  setMenuOpen?: (open: boolean) => void;
  className?: string;
}

const ScrollNavLink = ({
  href,
  children,
  setMenuOpen,
  className,
  ...props
}: ScrollNavLinkProps) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const targetPathname = href.split("#")[0] || "/";
    const hash = href.includes("#") ? "#" + href.split("#")[1] : "";

    if (targetPathname === pathname && hash) {
      e.preventDefault();

      if (typeof document !== "undefined") {
        const elementId = hash.startsWith("#") ? hash.slice(1) : hash;
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setMenuOpen?.(false);
        }
      }
    }
  };

  const isActive = () => {
    const [path] = href.split("#");
    return pathname === (path || "/");
  };

  return (
    <Link
      href={href}
      className={`${className || ""} ${styles.navItem} ${
        isActive() ? styles.active : ""
      }`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ScrollNavLink;
