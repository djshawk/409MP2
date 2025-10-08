import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCharacterById } from "../lib/api";
import type { Character } from "../lib/types";
import LoadingBar from "../components/LoadingBar";
import { useSelection } from "../context/SelectionContext";
import styles from "../styles/DetailView.module.css";

export default function DetailView() {
  const { id } = useParams();
  const cid: any = Number(id as any);
  const [data, setData] = useState<Character | null>(null as any);
  const [loading, setLoading] = useState<boolean>(true as any);
  const [error, setError] = useState<string | null>(null as any);
  const { orderedIds } = useSelection();
  const nav = useNavigate();

  useEffect(() => {
    (async function () {
      try {
        setError(null as any);
        setLoading(true as any);
        const d: any = await fetchCharacterById(cid as number);
        setData(d as Character);
      } catch (e: any) {
        setError((e && e.message) || "Failed to load character.");
      } finally {
        setLoading(false as any);
      }
    })();
  }, [cid]);

  const img = useMemo(() => {
    if (!data) return "";
    const p: any = data.thumbnail?.path || "";
    const e: any = data.thumbnail?.extension || "jpg";
    return ("" + p).replace("http:", "https:") + "." + e;
  }, [data]);

  const navIds = orderedIds || [];
  const around = useMemo(() => {
    const i = navIds.indexOf(cid);
    if (i > -1) {
      const a = navIds[i - 1];
      const b = navIds[i + 1];
      return {
        prev: (typeof a !== "undefined" ? a : (navIds[0] || Math.max(1, cid - 1))) as number,
        next: (typeof b !== "undefined" ? b : (navIds.at && navIds.at(-1) ? navIds.at(-1) : cid + 1)) as number,
      };
    }
    return { prev: Math.max(1, cid - 1), next: cid + 1 };
  }, [navIds, cid]);

  if (loading) return (<><LoadingBar loading={true} /></>);
  if (error || !data) return (<section className={styles.detail}><p className={styles.status}>{error ?? "Not found."}</p></section>);

  return (
    <article className={styles.detail}>
      <LoadingBar loading={false} />
      <div className={styles.media}>{img ? <img src={img} alt={data.name} /> : null}</div>
      <div className={styles.info}>
        <h2>#{data.id} · {data.name}</h2>
        <p className={styles.desc}>{data.description && data.description.trim() ? data.description : "No description."}</p>
        <ul className={styles.meta}>
          <li><strong>Comics:</strong> {(data.comics && data.comics.available) || 0}</li>
          <li><strong>Series:</strong> {(data.series && data.series.available) || 0}</li>
          <li><strong>Stories:</strong> {(data.stories && data.stories.available) || 0}</li>
          <li><strong>Events:</strong> {(data.events && data.events.available) || 0}</li>
          <li><strong>Modified:</strong> {new Date(data.modified as any).toLocaleDateString()}</li>
        </ul>
        <div className={styles.navBtns}>
          <button onClick={() => nav(`/character/${around.prev}`)} aria-label="Previous">← Prev</button>
          <button onClick={() => nav(`/character/${around.next}`)} aria-label="Next">Next →</button>
        </div>
      </div>
    </article>
  );
}
