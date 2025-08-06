import styles from "../Header.module.scss";
import { useRouter } from "next/navigation";

const SecondHeaderBanner = ({
  onClose,
  visible,
}: {
  onClose: () => void;
  visible: boolean;
}) => {
  const router = useRouter();
  if (!visible) return null;

  return (
    <div
      className={styles.secondBannerTop}
      onClick={() => router.push("/credit")}
      style={{ cursor: "pointer" }}
    >
      <button
        className={styles.bannerClose}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Закрыть баннер"
      >
        ×
      </button>

      <div className={styles.firstColumn}>
        <div className={styles.title}>
          <span className={styles.gradientText}>Новое</span>
          <span className={styles.whiteText}>Поступление</span>
        </div>

        <div className={styles.subtitle}>
          <span className={styles.gradientText}>Доступна</span>
          <span className={styles.whiteText}>Рассрочка!</span>
        </div>
      </div>

      <div className={styles.numbers}>
        <div className={styles.number}>
          <span className={styles.whiteText}>+799x</span>
          <span className={styles.gradientText}>1111111</span>
        </div>

        <div className={styles.number}>
          <span className={styles.whiteText}>+799x</span>
          <span className={styles.gradientText}>8888888</span>
        </div>
      </div>
    </div>
  );
};

export default SecondHeaderBanner;
