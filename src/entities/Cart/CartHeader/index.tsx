import styles from "./CartHeader.module.scss";

interface CartHeaderProps {
  itemCount: number;
}

// Заголовок Корзины
const formatItemCountText = (count: number): string => {
  const num = Math.abs(count) % 100;
  const num1 = num % 10;

  if (num > 10 && num < 20) return "товаров";

  if (num1 > 1 && num1 < 5) return "товара";

  if (num1 === 1) return "товар";

  return "товаров";
};

const CartHeader = ({ itemCount }: CartHeaderProps) => (
  <div className={styles.cartTitleContainer}>
    <h2 className={styles.cartTitle}>Корзина</h2>

    {itemCount > 0 && (
      <span className={styles.cartItemCount}>
        {itemCount} {formatItemCountText(itemCount)}
      </span>
    )}
  </div>
);

export default CartHeader;
