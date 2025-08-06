import Loader from "@/shared/ui/Loader";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Loader />
      </div>
    </div>
  );
}
