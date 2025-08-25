import { useState, useMemo } from "react";

import { useCartStore } from "@/store/cartStore";
import CustomSelect from "../CreditBannerSelect";

interface PriceCardProps {
  phoneNumber: string;
  priceData: Record<string, Record<string, number>>;
  styles: Record<string, string>;
  CalendarIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  CartIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  DropdownArrowIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  id: string;
}

const PriceCard: React.FC<PriceCardProps> = (props) => {
  const {
    phoneNumber,
    priceData,
    styles,
    CalendarIcon,
    CartIcon,
    DropdownArrowIcon,
    id,
  } = props;

  const durations = useMemo(
    () => Object.keys(priceData[phoneNumber] || {}),
    [priceData, phoneNumber]
  );

  const [selectedDuration, setSelectedDuration] = useState(
    durations.length ? durations[durations.length - 1] : ""
  );

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const handleDurationChange = (e: { target: { value: string } }) =>
    setSelectedDuration(e.target.value);

  const handleAddToCart = () => {
    if (!priceData[phoneNumber]?.[selectedDuration]) {
      return;
    }

    const totalPrice = priceData[phoneNumber][selectedDuration];
    const months = parseInt(selectedDuration.replace(" мес", ""), 10);
    const monthlyPrice = totalPrice / months;

    if (cartItems.some((item) => item.id === id)) {
      return;
    }

    addItem({
      id,
      phone: phoneNumber,
      price: totalPrice,
      quantity: 1,
      part_price: monthlyPrice,
      credit_month_count: months,
      region: [],
    });
  };

  const monthlyPrice = useMemo(() => {
    if (!priceData[phoneNumber]?.[selectedDuration]) return "N/A";

    const totalPrice = priceData[phoneNumber][selectedDuration];
    const months = parseInt(selectedDuration.replace(" мес", ""), 10);

    return (
      Math.round(totalPrice / months).toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) + " ₽"
    );
  }, [priceData, phoneNumber, selectedDuration]);

  if (!durations.length) {
    return (
      <div className={styles.sixthActionPricesWrapper}>
        <p className={styles.sixthActionPriceTitle}>{phoneNumber}</p>
        <p>Нет доступных периодов</p>
      </div>
    );
  }

  return (
    <div className={styles.sixthActionPricesWrapper}>
      <div className={styles.phoneAndSelect}>
        <p className={styles.sixthActionPriceTitle}>{phoneNumber}</p>

        <CustomSelect
          options={durations}
          value={selectedDuration}
          onChange={handleDurationChange}
          styles={styles}
          CalendarIcon={CalendarIcon ? <CalendarIcon /> : undefined}
          DropdownArrowIcon={
            DropdownArrowIcon ? <DropdownArrowIcon /> : undefined
          }
        />
      </div>

      <div
        className={styles.thirdPriceWrapper}
        onClick={handleAddToCart}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleAddToCart();
          }
        }}
        aria-label={`Добавить номер ${phoneNumber} в корзину`}
      >
        {CartIcon && <CartIcon className={styles.thirdPriceImg} />}
        <p className={styles.thirdPriceTitle}>{monthlyPrice}/месяц</p>
      </div>
    </div>
  );
};

export default PriceCard;
