import Image from "next/image";

import styles from "../../Header.module.scss";

const ScrollIndicator = () => {
  const handleScroll = () => {
    if (typeof document !== "undefined") {
      const contactsSection = document.getElementById("combination");

      if (contactsSection) {
        contactsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={styles.scrollIndicator} onClick={handleScroll}>
      <Image
        src="/assets/home/numbers/scroll.svg"
        alt="scroll"
        width={24}
        height={24}
      />
      <span className={styles.scrollText}>Выбрать номер</span>
    </div>
  );
};

export default ScrollIndicator;
