// ─────────────────────────────────────────────────────────────
//  CLOUD BACKEND — Supabase (free tier is plenty for one school).
//  Files → Storage bucket "materials" · cards → table "library".
//  Everyone can read; only the signed-in teacher can add / delete.
//  Setup steps + the SQL to paste are in  supabase-setup.sql / README.
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'
import { safeFileName } from './detect'

const URL_ = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const BUCKET = 'materials'
const TABLE = 'library'

const sb = createClient(URL_, KEY)
const publicUrl = (path) => (path ? sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : null)

const hydrate = (r) => ({
  id: r.id, kind: r.kind, folderKey: r.folder_key, data: r.data, createdAt: r.created_at,
  filePath: r.file_path, thumbPath: r.thumb_path,
  fileUrl: publicUrl(r.file_path),
  thumbUrl: publicUrl(r.thumb_path),
  downloadUrl: r.file_path ? `${publicUrl(r.file_path)}?download=${encodeURIComponent(r.data?.fileName || '')}` : null,
})

const fail = (error, fallback) => { throw new Error(error?.message || fallback) }

export default {
  mode: 'cloud',

  async init(onAuthChange) {
    const { data } = await sb.auth.getSession()
    sb.auth.onAuthStateChange((_e, session) => onAuthChange?.(!!session))
    return { isTeacher: !!data.session }
  },

  async login({ email, password }) {
    const { error } = await sb.auth.signInWithPassword({ email: (email || '').trim(), password })
    if (error) fail(error, 'login-failed')
  },
  async logout() { await sb.auth.signOut() },

  async list() {
    const { data, error } = await sb.from(TABLE).select('*').order('created_at', { ascending: true })
    if (error) fail(error, 'list-failed')
    return data.map(hydrate)
  },

  async add({ id, kind, folderKey, data, file, thumb }) {
    let file_path = null
    let thumb_path = null
    if (file) {
      file_path = `${folderKey}/${id}-${safeFileName(file.name)}`
      const { error } = await sb.storage.from(BUCKET).upload(file_path, file, { contentType: file.type || undefined, cacheControl: '31536000' })
      if (error) fail(error, 'upload-failed')
    }
    if (thumb instanceof Blob) {
      thumb_path = `${folderKey}/${id}-thumb.jpg`
      const { error } = await sb.storage.from(BUCKET).upload(thumb_path, thumb, { contentType: 'image/jpeg', cacheControl: '31536000' })
      if (error) thumb_path = null // a missing thumbnail must never block the upload
    }
    const row = { id, kind, folder_key: folderKey, data: { ...data, fileName: file?.name }, file_path, thumb_path }
    const { data: saved, error } = await sb.from(TABLE).insert(row).select().single()
    if (error) {
      await sb.storage.from(BUCKET).remove([file_path, thumb_path].filter(Boolean)) // don't leave orphans
      fail(error, 'save-failed')
    }
    return hydrate(saved)
  },

  async remove(record) {
    const { error } = await sb.from(TABLE).delete().eq('id', record.id)
    if (error) fail(error, 'delete-failed')
    const paths = [record.filePath, record.thumbPath].filter(Boolean)
    if (paths.length) await sb.storage.from(BUCKET).remove(paths)
  },
}
