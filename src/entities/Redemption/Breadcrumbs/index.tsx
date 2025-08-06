import Link from "next/link";

import styles from "./Breadcrumbs.module.scss";

const Breadcrumbs: React.FC = () => (
  <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
    <Link href="/" className={styles.breadcrumbLink}>
      Главная
    </Link>

    <span className={styles.breadcrumbSeparator}>/</span>

    <span className={styles.breadcrumbCurrent}>Продать номер</span>
  </nav>
);

export default Breadcrumbs;
