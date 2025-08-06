import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./HomeGallery.module.scss";

type FriendNumber = { prefix: string; suffix: string };

const FRIEND_NUMBERS: FriendNumber[] = [
  { prefix: "+987", suffix: "777 - 77 - 01" },
  { prefix: "+987", suffix: "777 - 77 - 02" },
  { prefix: "+987", suffix: "777 - 77 - 03" },
  { prefix: "+987", suffix: "777 - 77 - 04" },
  { prefix: "+987", suffix: "777 - 77 - 05" },
  { prefix: "+987", suffix: "777 - 77 - 06" },
  { prefix: "+987", suffix: "777 - 77 - 07" },
  { prefix: "+987", suffix: "777 - 77 - 08" },
];

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
};

const HomeGallery = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#action") {
      const element = document.getElementById("action");

      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const friendNumberGroups = chunkArray(FRIEND_NUMBERS, 2);

  return (
    <div id="action" className={styles.actionGalleryWrapper}>
      <div className={styles.actionWrapper}>
        <div className={styles.action}>
          <div className={styles.actionContent}>
            <Swiper
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className={styles.mainSwiper}
              loop={false}
            >
              <SwiperSlide>
                <div className={styles.firstAction}>
                  <Image
                    src="/assets/home/action/back-icon.svg"
                    alt="back"
                    className={styles.backIcon}
                    aria-hidden="true"
                    width={100}
                    height={100}
                  />

                  <div className={styles.timer}>
                    <Image
                      src="/assets/home/action/friends.svg"
                      alt="timer"
                      aria-hidden="true"
                      width={24}
                      height={24}
                    />
                    <p className={styles.timerText}>Дружба</p>
                  </div>

                  <p className={styles.firstActionTitle}>
                    Приведи друга и получи <br />
                    <span className={styles.firstActionTitleSpan}>
                      до 15%
                    </span>{" "}
                    Комиссию с покупки
                  </p>

                  <div className={styles.firstActionPricesWrapper}>
                    {friendNumberGroups.map((group, i) => (
                      <div key={i} className={styles.firstActionNumbers}>
                        {group.map((num, j) => (
                          <p key={j} className={styles.firstActionNumber}>
                            <span className={styles.firstActionNumberSpan}>
                              {num.prefix}
                            </span>{" "}
                            {num.suffix}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className={styles.firstAction}>
                  <Image
                    src="/assets/home/action/back-icon2.svg"
                    alt="back"
                    className={styles.backIcon2}
                    aria-hidden="true"
                    width={100}
                    height={100}
                  />

                  <div className={styles.timer}>
                    <Image
                      src="/assets/home/promotion/hot.svg"
                      alt="hot"
                      aria-hidden="true"
                      width={24}
                      height={24}
                    />
                    <p className={styles.timerText}>Парой дешевле</p>
                  </div>

                  <p className={styles.firstActionTitle}>
                    Скидка{" "}
                    <span className={styles.firstActionTitleSpan}>до 20%</span>{" "}
                    <br />
                    на покупку второго номера
                  </p>

                  <div className={styles.firstActionPricesWrapper}>
                    <div className={styles.firstActionNumbers}>
                      {FRIEND_NUMBERS.slice(0, 2).map((num, idx) => (
                        <p key={idx} className={styles.firstActionNumber}>
                          <span className={styles.firstActionNumberSpan}>
                            {num.prefix}
                          </span>{" "}
                          {num.suffix}
                        </p>
                      ))}
                    </div>

                    <p className={styles.firstActionEqual}>=</p>

                    <p className={styles.firstActionOldPrice}>100 000 ₽</p>

                    <p className={styles.firstActionNewPrice}>80 000 ₽</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>

      <div className={styles.galleryWrapper}>
        <div className={styles.gallery}>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className={styles.thumbSwiper}
            loop={false}
          >
            {[
              "/assets/home/action/banner.png",
              "/assets/home/action/banner2.png",
            ].map((src, i) => (
              <SwiperSlide key={i} className={styles.thumbSlide}>
                <div className={styles.banner}>
                  <Image
                    src={src}
                    alt={`Banner ${i + 1}`}
                    width={400}
                    height={300}
                    className={styles.bannerImage}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeGallery;
