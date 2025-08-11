import React, { useEffect, useState } from "react";
import { TierConfig } from "./const";

import styles from "./NumberList.module.scss";

interface SparkleEffectProps {
  tierConfig: TierConfig;
  isVisible: boolean;
  tierKey?: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const SparkleEffect: React.FC<SparkleEffectProps> = ({
  tierConfig,
  isVisible,
  tierKey,
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Инициализация клиентской части
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isVisible) {
      setSparkles([]);

      return;
    }

    let sparkleCount = Math.floor(tierConfig.glowIntensity * 3);

    if (tierKey === "bronze" || tierKey === "silver") {
      sparkleCount = 3;
    } else if (tierKey === "gold") {
      sparkleCount = 7;
    } else if (tierKey === "platinum") {
      sparkleCount = 9;
    } else if (tierKey === "vip") {
      sparkleCount = 11;
    }

    const newSparkles: Sparkle[] = [];

    for (let i = 0; i < sparkleCount; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size:
          tierConfig.name === "Золото"
            ? Math.random() * 6 + 4
            : Math.random() * 4 + 2,
        delay: Math.random() * 2,
        duration: Math.random() * 1 + 0.5,
      });
    }

    setSparkles(newSparkles);
  }, [tierConfig, isVisible, isClient]);

  // Не рендерим на сервере
  if (!isClient || !isVisible) return null;

  return (
    <div
      className={styles["sparkle-container"]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 2,
      }}
    >
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={styles.sparkle}
          style={{
            position: "absolute",
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: tierConfig.sparkleColor,
            borderRadius: "50%",
            opacity: 0,
            animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
            boxShadow: `0 0 ${sparkle.size * 3}px ${tierConfig.sparkleColor}`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
