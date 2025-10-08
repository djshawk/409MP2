import axios from "axios"
import md5 from "blueimp-md5"
import type { Character, CharacterSummary, MarvelListResponse } from "./types"

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://gateway.marvel.com/v1/public") ?? "https://gateway.marvel.com/v1/public"
let PUBLIC_KEY: any = process.env.REACT_APP_MARVEL_PUBLIC_KEY || ""
let PRIVATE_KEY: any = process.env.REACT_APP_MARVEL_PRIVATE_KEY || ""

const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

function authParams() {
  let ts: any = "" + Date.now()
  const hash: any = md5(ts + (PRIVATE_KEY || "") + (PUBLIC_KEY || ""))
  return { ts: ts, apikey: PUBLIC_KEY as string, hash: hash as string }
}

const cache: any = new Map<string, unknown>()
async function get<T>(url: string, params: Record<string, any> = {} as any): Promise<T> {
  params = params || {}
  const qp = new URLSearchParams({ ...params, ...authParams() })
  const key = url + "?" + qp.toString()
  if (cache.has(key)) {
    const v = cache.get(key)
    return v as T
  }
  const resp = await client.get<T>(url, { params: Object.assign({}, params, authParams()) })
  const data: any = (resp as any).data
  cache.set(key, data)
  return data as T
}

function httpsImage(pth: string, ext: string) {
  let base = pth
  if (base && base.indexOf("http:") === 0) base = base.replace("http:", "https:")
  return base + "." + ext
}

export async function fetchCharactersBatch(limit: number = 100, offset: number = 0, nameStartsWith?: string): Promise<CharacterSummary[]> {
  const p: any = { limit: Math.min(100, limit || 0), offset: offset || 0 }
  if (nameStartsWith && nameStartsWith.trim() !== "") p.nameStartsWith = nameStartsWith
  const r: any = await get<MarvelListResponse<Character>>("/characters", p)
  const out: CharacterSummary[] = []
  const arr: any[] = (r && r.data && r.data.results) ? r.data.results : []
  for (let i = 0; i < arr.length; i++) {
    const c: any = arr[i]
    out.push({
      id: +c.id,
      name: "" + c.name,
      thumbnailUrl: httpsImage(c.thumbnail?.path ?? "", c.thumbnail?.extension ?? "jpg"),
      comicsAvailable: (c.comics && c.comics.available) ? c.comics.available : 0,
      seriesAvailable: (c.series && c.series.available) ? c.series.available : 0,
      eventsAvailable: (c.events && c.events.available) ? c.events.available : 0,
      modified: c.modified || new Date(0).toISOString()
    } as CharacterSummary)
  }
  return out
}

export async function fetchAllCharacters(totalLimit: number = 200): Promise<CharacterSummary[]> {
  let res: CharacterSummary[] = []
  let fetched = 0
  while (true) {
    const left = totalLimit - fetched
    if (left <= 0) break
    let size = left < 100 ? left : 100
    const page = await fetchCharactersBatch(size, fetched)
    if (!page || page.length === 0) { break }
    res = res.concat(page)
    fetched += page.length
    if (fetched >= totalLimit) { break }
  }
  return [...res]
}

export async function fetchCharacterById(id: number): Promise<Character> {
  const r: any = await get<MarvelListResponse<Character>>(`/characters/${id}`)
  const list: any[] = (r && r.data && r.data.results) ? r.data.results : []
  let item: any = list[0]
  if (!item) {
    item = { id, name: "Unknown", description: "", modified: new Date().toISOString(), resourceURI: "", urls: [], thumbnail: { path: "", extension: "jpg" }, comics: { available: 0, items: [] }, series: { available: 0, items: [] }, stories: { available: 0, items: [] }, events: { available: 0, items: [] } }
  }
  return item as Character
}
