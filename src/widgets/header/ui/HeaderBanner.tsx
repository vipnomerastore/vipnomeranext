import { useRouter } from "next/navigation";

import styles from "../Header.module.scss";

interface HeaderBannerProps {
  onClose: () => void;
  visible: boolean;
}

const HeaderBanner = ({ onClose, visible }: HeaderBannerProps) => {
  const router = useRouter();

  if (!visible) return null;

  const handleBannerClick = () => {
    router.push("/credit");
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onClose();
  };

  return (
    <div
      className={styles.bannerTop}
      onClick={handleBannerClick}
      role="banner"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleBannerClick();
        }
      }}
      style={{ cursor: "pointer" }}
      aria-label="Выгодная рассрочка до 12 месяцев без банка и без переплат. Нажмите для подробностей."
    >
      <button
        className={styles.bannerClose}
        onClick={handleCloseClick}
        aria-label="Закрыть баннер"
        type="button"
      >
        ×
      </button>

      <span className={styles.whiteText}>Выгодная рассрочка до </span>

      <span className={styles.gradientText}>12</span>

      <span className={styles.whiteText}> месяцев </span>

      <span className={styles.gradientText}>без банка</span>

      <span className={styles.whiteText}> и </span>

      <span className={styles.gradientText}>без переплат</span>
    </div>
  );
};

export default HeaderBanner;
