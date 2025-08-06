import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

// Server Component - рендерится на сервере
const Breadcrumbs: React.FC = () => (
  <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
    <Link href="/" className={styles.breadcrumbLink}>
      Главная
    </Link>

    <span className={styles.breadcrumbSeparator}>/</span>

    <span className={styles.breadcrumbCurrent}>Партнёрам</span>
  </nav>
);

export default Breadcrumbs;
