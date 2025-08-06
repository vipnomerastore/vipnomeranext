import { useEffect, useState, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import HeaderBanner from "./HeaderBanner";
import SecondHeaderBanner from "./SecondHeaderBanner";

import styles from "../Header.module.scss";

const RotatingHeaderBanner = ({
  onBannerVisibilityChange,
}: {
  onBannerVisibilityChange?: (visible: boolean) => void;
}) => {
  const [showFirst, setShowFirst] = useState(true);
  const [hidden, setHidden] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hidden) return;
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 20000);

    return () => clearInterval(interval);
  }, [hidden]);

  useEffect(() => {
    if (onBannerVisibilityChange) {
      onBannerVisibilityChange(!hidden);
    }
  }, [hidden, onBannerVisibilityChange]);

  const handleClose = () => setHidden(true);

  if (hidden) return null;

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={showFirst ? "header" : "second"}
        timeout={500}
        classNames={{
          enter: styles.bannerTransitionEnter,
          enterActive: styles.bannerTransitionEnterActive,
          exit: styles.bannerTransitionExit,
          exitActive: styles.bannerTransitionExitActive,
        }}
        nodeRef={showFirst ? headerRef : secondRef}
        unmountOnExit
      >
        <div ref={showFirst ? headerRef : secondRef}>
          {showFirst ? (
            <HeaderBanner onClose={handleClose} visible={!hidden} />
          ) : (
            <SecondHeaderBanner onClose={handleClose} visible={!hidden} />
          )}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default RotatingHeaderBanner;
