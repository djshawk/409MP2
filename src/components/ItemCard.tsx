import styles from "./ItemCard.module.css";
import { Link } from "react-router-dom";

type Props = { id: number; name: string; imgUrl?: string };
export default function ItemCard({ id, name, imgUrl }: Props) {
  return (
    <Link to={`/character/${id}`} className={styles.card}>
      {imgUrl ? <img src={imgUrl} alt={name} loading="lazy" /> : <div className={styles.placeholder} />}
      <div className={styles.meta}>
        <span className={styles.id}>#{id}</span>
        <h3 className={styles.name}>{name}</h3>
      </div>
    </Link>
  );
}
