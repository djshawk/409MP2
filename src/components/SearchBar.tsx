import styles from "./SearchBar.module.css";
type Props = { query: string; onChange: (v: string) => void; placeholder?: string };
export default function SearchBar({ query, onChange, placeholder }: Props) {
  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        value={query}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
    </div>
  );
}
