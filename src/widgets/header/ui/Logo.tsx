import Link from "next/link";
import Image from "next/image";

import styles from "../Header.module.scss";

const Logo = () => (
  <Link href="/">
    <Image
      className={styles.logo}
      src="/assets/header/logo.svg"
      alt="Логотип"
      width={120}
      height={80}
      style={{ height: "auto" }}
    />
  </Link>
);

export default Logo;
