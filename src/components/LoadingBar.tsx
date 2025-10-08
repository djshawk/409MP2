import styles from "./LoadingBar.module.css";

type Props = { loading: boolean };

export default function LoadingBar({ loading }: Props) {
  if (!loading) return null;
  return (
    <div className={styles.wrap} role="status" aria-label="Loading">
      <div className={styles.bar} />
    </div>
  );
}