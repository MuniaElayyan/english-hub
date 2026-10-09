// ─────────────────────────────────────────────────────────────
//  LOCAL BACKEND — used until a cloud project is connected.
//  Everything (files included) is kept in this browser's IndexedDB,
//  so it is visible ONLY on this device. Good for trying the feature
//  out; connect Supabase (see README) to publish to students.
// ─────────────────────────────────────────────────────────────
import { teacherAccess } from '../data/site'

const DB = 'english-hub-library'
const STORE = 'records'
const SESSION = 'eh-teacher'

const openDb = () => new Promise((res, rej) => {
  const rq = indexedDB.open(DB, 1)
  rq.onupgradeneeded = () => rq.result.createObjectStore(STORE, { keyPath: 'id' })
  rq.onsuccess = () => res(rq.result)
  rq.onerror = () => rej(rq.error)
})
const run = async (mode, fn) => {
  const db = await openDb()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, mode)
    const rq = fn(tx.objectStore(STORE))
    tx.oncomplete = () => { db.close(); res(rq?.result) }
    tx.onerror = tx.onabort = () => { db.close(); rej(tx.error) }
  })
}

const urls = new Map() // id → object URLs, so they can be released on delete
const hydrate = (r) => {
  if (!urls.has(r.id)) {
    urls.set(r.id, {
      file: r.fileBlob ? URL.createObjectURL(r.fileBlob) : null,
      thumb: r.thumbBlob ? URL.createObjectURL(r.thumbBlob) : null,
    })
  }
  const u = urls.get(r.id)
  return { id: r.id, kind: r.kind, folderKey: r.folderKey, data: r.data, createdAt: r.createdAt, fileUrl: u.file, thumbUrl: u.thumb, fileName: r.fileName }
}

export default {
  mode: 'local',

  async init() {
    let ok = false
    try { ok = localStorage.getItem(SESSION) === '1' } catch { /* private mode */ }
    return { isTeacher: ok }
  },

  async login({ passcode }) {
    if ((passcode || '').trim() !== String(teacherAccess.passcode)) throw new Error('wrong-passcode')
    try { localStorage.setItem(SESSION, '1') } catch { /* ignore */ }
  },
  async logout() { try { localStorage.removeItem(SESSION) } catch { /* ignore */ } },

  async list() {
    const all = (await run('readonly', (s) => s.getAll())) || []
    return all.sort((a, b) => a.createdAt - b.createdAt).map(hydrate)
  },

  async add({ id, kind, folderKey, data, file, thumb }) {
    const rec = { id, kind, folderKey, data, createdAt: Date.now(), fileBlob: file || null, fileName: file?.name, thumbBlob: thumb instanceof Blob ? thumb : null }
    await run('readwrite', (s) => s.put(rec))
    return hydrate(rec)
  },

  async remove(record) {
    await run('readwrite', (s) => s.delete(record.id))
    const u = urls.get(record.id)
    if (u) { u.file && URL.revokeObjectURL(u.file); u.thumb && URL.revokeObjectURL(u.thumb); urls.delete(record.id) }
  },
}
