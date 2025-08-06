import styles from "./BestNumberFilter.module.scss";

interface BestNumberSelectProps {
  bestNumber: string[];
  setBestNumber: (value: string[]) => void;
}

const BestNumberSelect = (props: BestNumberSelectProps) => {
  const { bestNumber, setBestNumber } = props;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9, ]/g, "");
    const splitValue = value.trim() === "" ? [] : value.split(/[, ]+/);
    const filteredValue = splitValue.filter((v) => v !== "");
    const mappedValue = filteredValue.map((v) => v.trim());

    setBestNumber(mappedValue);
  };

  return (
    <input
      type="text"
      value={bestNumber.join(", ")}
      className={styles.bestNumberInput}
      onChange={handleInputChange}
      placeholder="Введите любимые числа"
    />
  );
};

export default BestNumberSelect;
