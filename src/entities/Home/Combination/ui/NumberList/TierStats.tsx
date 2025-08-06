import React, { useMemo } from "react";

import { NumberItem } from "@/store/cartStore";
import { NumberTier, getNumberTier, TIER_CONFIGS } from "./const";
import styles from "./TierStats.module.scss";

interface TierStatsProps {
  numbers: NumberItem[];
  selectedTier: string;
  onTierSelect: (tier: string) => void;
}

interface TierCount {
  tier: NumberTier;
  count: number;
  percentage: number;
}

const TierStats: React.FC<TierStatsProps> = ({
  numbers,
  selectedTier,
  onTierSelect,
}) => {
  const tierStats = useMemo(() => {
    const tierCounts: Record<NumberTier, number> = {
      [NumberTier.BRONZE]: 0,
      [NumberTier.SILVER]: 0,
      [NumberTier.GOLD]: 0,
      [NumberTier.PLATINUM]: 0,
      [NumberTier.VIP]: 0,
    };

    numbers.forEach((number) => {
      const tier = getNumberTier(number.price || 0);

      tierCounts[tier]++;
    });

    const total = numbers.length;

    const stats: TierCount[] = Object.entries(tierCounts).map(
      ([tier, count]) => ({
        tier: tier as NumberTier,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })
    );

    return stats.filter((stat) => stat.count > 0);
  }, [numbers]);

  if (tierStats.length === 0) return null;

  return (
    <div className={styles.tierStats}>
      <div className={styles.statsGrid}>
        <div
          className={`${styles.statItem} ${styles.all} ${
            selectedTier === "all" ? styles.active : ""
          }`}
          onClick={() => onTierSelect("all")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onTierSelect("all");
            }
          }}
        >
          <div className={styles.tierName}>Все категории</div>
        </div>

        {tierStats.map(({ tier }) => {
          const config = TIER_CONFIGS[tier];
          const isActive = selectedTier === tier;

          return (
            <div
              key={tier}
              className={`${styles.statItem} ${styles[tier.toLowerCase()]} ${
                isActive ? styles.active : ""
              }`}
              onClick={() => onTierSelect(tier)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTierSelect(tier);
                }
              }}
            >
              <div className={styles.tierName}>
                <p>{config.name}</p>
                <p className={styles.tierSubName}>{config.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TierStats;
