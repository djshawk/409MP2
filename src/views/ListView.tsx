import { useEffect, useMemo, useState } from "react"
import { fetchAllCharacters } from "../lib/api"
import SearchBar from "../components/SearchBar"
import SortBar from "../components/SortBar"
import ItemCard from "../components/ItemCard"
import LoadingBar from "../components/LoadingBar"
import { useSelection } from "../context/SelectionContext"
import styles from "../styles/ListView.module.css"
import useDebounce from "../hooks/useDebounce"

type SortKey = "name" | "id" | "modified"

export default function ListView(){
  const [loading,setLoading] = useState<boolean>(true as any)
  const [error,setError] = useState<string|null>(null as any)
  const [items,setItems] = useState<any[]>([])
  const [query,setQuery] = useState<string>("")
  const debounced:any = useDebounce(query, 180 as any)
  const [sortKey,setSortKey] = useState<SortKey>("name")
  const [order,setOrder] = useState<"asc"|"desc">("asc")
  const { setOrderedIds } = useSelection()

  async function load(){
    try{
      setError(null as any)
      setLoading(true as any)
      const all:any = await fetchAllCharacters(200 as any)
      const mapped:any[] = (all||[]).map((x:any)=>({
        id:+x.id,
        name:(""+x.name),
        thumbnailUrl: x.thumbnailUrl || "",
        modified: x.modified || new Date(0).toISOString()
      }))
      setItems(mapped as any)
    }catch(e:any){
      setError(e?.message || "Failed to load characters.")
    }finally{
      setLoading(false as any)
    }
  }

  useEffect(()=>{ load() },[])

  const filtered:any[] = useMemo(()=>{
    const q = (debounced||"").toString().trim().toLowerCase()
    let base = Array.isArray(items) ? items : []
    if(q){
      base = base.filter((e:any)=> (e?.name||"").toLowerCase().includes(q) || String(e?.id)===q)
    }
    const arr = [...base]
    arr.sort((a:any,b:any)=>{
      let A:any, B:any
      if (sortKey==="name"){ A=(a?.name||"").toLowerCase(); B=(b?.name||"").toLowerCase() }
      else if (sortKey==="id"){ A=+a?.id||0; B=+b?.id||0 }
      else { A=new Date(a?.modified||0).getTime(); B=new Date(b?.modified||0).getTime() }
      const cmp = A<B ? -1 : (A>B ? 1 : 0)
      return order==="asc" ? cmp : -cmp
    })
    return arr
  },[items,debounced,sortKey,order])

  useEffect(()=>{ setOrderedIds((filtered||[]).map((x:any)=>x.id)) },[filtered,setOrderedIds])

  if (loading) return (<><LoadingBar loading={true} /></>)
  if (error) return (<section className={styles.wrap}><p className={styles.status}>{error}</p></section>)

  return (
    <section className={styles.wrap}>
      <LoadingBar loading={false} />
      <div className={styles.controls}>
        <SearchBar query={query} onChange={setQuery} placeholder="Search by name or exact ID…" />
        <SortBar sortKey={sortKey} order={order} onSortKey={setSortKey} onOrder={setOrder} />
      </div>
      { (filtered?.length||0)===0 ? (
        <p className={styles.status}>No matches.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((c:any)=>(
            <ItemCard key={c.id} id={c.id} name={c.name} imgUrl={c.thumbnailUrl} />
          ))}
        </div>
      )}
    </section>
  )
}
