// ─────────────────────────────────────────────────────────────
//  LIBRARY — material the teacher adds from the website itself.
//
//  The built-in tree (src/data/resources.js) is merged with the
//  teacher's own folders + items, and the rest of the site simply
//  reads the merged tree from  useLibrary().grades .
//
//  Storage:  Supabase when .env is filled (everyone sees uploads),
//            otherwise this browser's IndexedDB (this device only).
// ─────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { grades as staticGrades, allItems as flatten, countAllItems as countAll } from '../data/resources'

const cloudConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
const loadBackend = () => (cloudConfigured ? import('./backend-supabase') : import('./backend-local')).then((m) => m.default)

const uid = () => (crypto.randomUUID ? crypto.randomUUID()
  : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)))

export const AR_ORDINALS = { 1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 5: 'الخامس', 6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع', 10: 'العاشر', 11: 'الحادي عشر', 12: 'الثاني عشر' }
export const EN_NUMBERS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' }

export const folderKey = (gradeId, segments = []) => [gradeId, ...segments].join('/')

const slugify = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

/** Built-in tree + teacher's records → one tree. */
function merge(records) {
  const index = new Map()
  const clone = (node, key) => {
    const copy = { ...node, children: (node.children || []).map((c) => (c.link ? c : clone(c, `${key}/${c.id}`))), items: [...(node.items || [])] }
    index.set(key, copy)
    return copy
  }
  const tree = staticGrades.map((g) => clone(g, g.id))

  // grades the teacher created
  for (const r of records) {
    if (r.kind !== 'grade' || index.has(r.data.id)) continue
    const g = { ...r.data, children: [], items: [], added: true, record: r }
    tree.push(g)
    index.set(g.id, g)
  }
  tree.sort((a, b) => a.number - b.number)

  // folders first (oldest first, so parents exist before their children)
  for (const r of records) {
    if (r.kind !== 'folder') continue
    const parent = index.get(r.folderKey)
    if (!parent || parent.children.some((c) => c.id === r.data.slug)) continue
    const node = { id: r.data.slug, name: r.data.name, description: r.data.description, icon: r.data.icon, children: [], items: [], added: true, record: r }
    parent.children.push(node)
    index.set(`${r.folderKey}/${node.id}`, node)
  }
  for (const r of records) {
    if (r.kind !== 'item') continue
    const folder = index.get(r.folderKey)
    if (!folder) continue
    folder.items.push({
      ...r.data,
      id: r.id,
      file: r.fileUrl || r.data.file,
      downloadUrl: r.downloadUrl || undefined,
      thumbnail: r.thumbUrl || r.data.thumbUrl || undefined,
      added: true,
      record: r,
    })
  }
  return tree
}

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const backend = useRef(null)
  const [records, setRecords] = useState([])
  const [isTeacher, setIsTeacher] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const b = await loadBackend()
        backend.current = b
        const { isTeacher: t } = await b.init((signedIn) => alive && setIsTeacher(signedIn))
        if (!alive) return
        setIsTeacher(t)
        setRecords(await b.list())
      } catch (e) {
        console.error('[library]', e)
        if (alive) setError(e.message || String(e))
      } finally { if (alive) setReady(true) }
    })()
    return () => { alive = false }
  }, [])

  const grades = useMemo(() => merge(records), [records])

  const login = useCallback(async (cred) => { await backend.current.login(cred); setIsTeacher(true) }, [])
  const logout = useCallback(async () => { await backend.current.logout(); setIsTeacher(false) }, [])

  /** draft = { data, file?, thumb? (Blob | url string | null) } */
  const addItem = useCallback(async (key, { data, file, thumb }) => {
    const payload = { ...data }
    if (typeof thumb === 'string') payload.thumbUrl = thumb
    const rec = await backend.current.add({ id: uid(), kind: 'item', folderKey: key, data: payload, file, thumb })
    setRecords((r) => [...r, rec])
    return rec
  }, [])

  const addFolder = useCallback(async (key, { name, description, icon }, siblings = []) => {
    const taken = new Set(siblings.map((s) => s.id))
    let slug = slugify(name.en) || `folder-${uid().slice(0, 6)}`
    for (let i = 2; taken.has(slug); i++) slug = `${slugify(name.en) || 'folder'}-${i}`
    const rec = await backend.current.add({ id: uid(), kind: 'folder', folderKey: key, data: { slug, name, description, icon } })
    setRecords((r) => [...r, rec])
    return slug
  }, [])

  const addGrade = useCallback(async ({ number, tagline, description }) => {
    const id = `grade-${number}`
    const accents = ['wine', 'green', 'blue']
    const data = {
      id, number,
      name: { en: `Grade ${number}`, ar: `الصف ${AR_ORDINALS[number] || number}` },
      tagline, description,
      accent: accents[number % 3],
    }
    const rec = await backend.current.add({ id: uid(), kind: 'grade', folderKey: 'root', data })
    setRecords((r) => [...r, rec])
    return id
  }, [])

  const remove = useCallback(async (record) => {
    await backend.current.remove(record)
    setRecords((r) => r.filter((x) => x.id !== record.id))
  }, [])

  const value = useMemo(() => ({
    grades,
    getGrade: (id) => grades.find((g) => g.id === id),
    allItems: () => flatten(grades),
    countAllItems: () => countAll(grades),
    mode: cloudConfigured ? 'cloud' : 'local',
    ready, error, isTeacher, login, logout, addItem, addFolder, addGrade, remove,
  }), [grades, ready, error, isTeacher, login, logout, addItem, addFolder, addGrade, remove])

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export const useLibrary = () => useContext(LibraryContext)
