import { memo } from "react";
import clsx from "clsx";

import styles from "./DeliverySection.module.scss";

const deliveryTabs = [
  "СДЭК",
  "E-SIM",
  "Забрать в салоне связи своего города",
] as const;

type DeliveryTab = (typeof deliveryTabs)[number];

interface DeliverySectionProps {
  activeTab: string;
  onTabChange: (tab: DeliveryTab) => void;
}

interface TabProps {
  tab: DeliveryTab;
  isActive: boolean;
  onClick: (tab: DeliveryTab) => void;
}

const Tab = memo(({ tab, isActive, onClick }: TabProps) => (
  <button
    type="button"
    className={clsx(styles.deliveryTab, isActive && styles.active)}
    onClick={() => onClick(tab)}
    aria-pressed={isActive}
  >
    {tab}
  </button>
));

Tab.displayName = "Tab";

const DeliverySection: React.FC<DeliverySectionProps> = memo(
  ({ activeTab, onTabChange }) => (
    <section className={styles.deliverySection}>
      <h3 className={styles.deliveryTitle}>Доставка</h3>

      <div className={styles.deliveryTabs}>
        {deliveryTabs.map((tab) => (
          <Tab
            key={tab}
            tab={tab}
            isActive={activeTab === tab}
            onClick={onTabChange}
          />
        ))}
      </div>
    </section>
  )
);

DeliverySection.displayName = "DeliverySection";

export default DeliverySection;
