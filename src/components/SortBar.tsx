import styles from "./SortBar.module.css";

type SortKey = "name" | "id" | "modified";
type Props = {
  sortKey: SortKey;
  order: "asc" | "desc";
  onSortKey: (k: SortKey) => void;
  onOrder: (o: "asc" | "desc") => void;
};
export default function SortBar({ sortKey, order, onSortKey, onOrder }: Props) {
  return (
    <div className={styles.row}>
      <label>
        Sort by
        <select value={sortKey} onChange={(e) => onSortKey(e.target.value as SortKey)}>
          <option value="name">Name</option>
          <option value="id">ID</option>
          <option value="modified">Modified</option>
        </select>
      </label>
      <label>
        Order
        <select value={order} onChange={(e) => onOrder(e.target.value as "asc" | "desc")}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}
