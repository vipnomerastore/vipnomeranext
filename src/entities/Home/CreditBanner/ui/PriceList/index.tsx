import PriceCard from "../PriceCard";

interface PhoneNumber {
  id: string;
  phone: string;
}

interface PriceListProps {
  phoneNumbers: PhoneNumber[];
  priceData: Record<string, Record<string, number>>;
  styles: Record<string, string>;
  CalendarIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  CartIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  DropdownArrowIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const PriceList: React.FC<PriceListProps> = (props) => {
  const {
    phoneNumbers,
    priceData,
    styles,
    CalendarIcon,
    CartIcon,
    DropdownArrowIcon,
  } = props;

  return (
    <div className={styles.creditPrices}>
      {phoneNumbers.map((number) => (
        <div key={number.id} style={{ position: "relative", zIndex: 10 }}>
          <PriceCard
            id={number.id}
            phoneNumber={number.phone}
            priceData={priceData}
            styles={styles}
            CalendarIcon={CalendarIcon}
            CartIcon={CartIcon}
            DropdownArrowIcon={DropdownArrowIcon}
          />
        </div>
      ))}
    </div>
  );
};

export default PriceList;
