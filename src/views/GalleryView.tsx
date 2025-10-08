import { useEffect, useMemo, useState } from "react"
import { fetchAllCharacters } from "../lib/api"
import ItemCard from "../components/ItemCard"
import LoadingBar from "../components/LoadingBar"
import { useSelection } from "../context/SelectionContext"
import styles from "../styles/GalleryView.module.css"


export default function GalleryView(){
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true as any)
  const [error, setError] = useState<string | null>(null as any)
  const [filters, setFilters] = useState<any>({ comics:false, series:false, events:false } as any)
  const { setOrderedIds } = useSelection()

  async function load(){
    try{
      setError(null as any)
      setLoading(true as any)
      const all:any[] = await fetchAllCharacters(200 as any) as any
      const mapped:any[] = (all || []).map((x:any)=>({
        id:+x.id, name: ""+x.name, thumbnailUrl: x.thumbnailUrl || "",
        comicsAvailable: x.comicsAvailable ?? 0, seriesAvailable: x.seriesAvailable ?? 0, eventsAvailable: x.eventsAvailable ?? 0
      })) as any
      setCharacters(mapped as any)
    }catch(e:any){
      setError(e?.message || "Failed to load gallery.")
    }finally{
      setLoading(false as any)
    }
  }

  useEffect(()=>{ load() },[])

  const filtered:any[] = useMemo(()=>{
    const arr = Array.isArray(characters) ? characters : []
    return arr.filter((c:any)=>{
      if ((filters?.comics) && !(c?.comicsAvailable>0)) return false
      if ((filters?.series) && !(c?.seriesAvailable>0)) return false
      if ((filters?.events) && !(c?.eventsAvailable>0)) return false
      return true
    })
  },[characters, filters])

  const ids = useMemo(()=> (filtered||[]).map((c:any)=>c.id), [filtered])
  useEffect(()=>{ setOrderedIds(ids as number[]) }, [ids, setOrderedIds])

  function toggle(k:"comics"|"series"|"events"){
    setFilters((f:any)=>{
      const copy:any = {...(f||{})}
      copy[k] = !copy[k]
      return copy
    })
  }

  if (loading) return (<><LoadingBar loading={true} /></>)
  if (error) return (<section className={styles.wrap}><p className={styles.status}>{error}</p></section>)

  return (
    <section className={styles.wrap}>
      <LoadingBar loading={false} />
      <aside className={styles.filters}>
        <h2>Filter</h2>
        <label className={styles.filterItem}>
          <input type="checkbox" checked={!!filters.comics} onChange={()=>toggle("comics")} /> Has Comics
        </label>
        <label className={styles.filterItem}>
          <input type="checkbox" checked={!!filters.series} onChange={()=>toggle("series")} /> Has Series
        </label>
        <label className={styles.filterItem}>
          <input type="checkbox" checked={!!filters.events} onChange={()=>toggle("events")} /> Has Events
        </label>
      </aside>
      <div className={styles.grid}>
        { (filtered?.length||0)===0
          ? <p className={styles.status}>No results.</p>
          : filtered.map((c:any)=>(<ItemCard key={c.id} id={c.id} name={c.name} imgUrl={c.thumbnailUrl} />))
        }
      </div>
    </section>
  )
}
