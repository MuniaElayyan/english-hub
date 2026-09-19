// ─────────────────────────────────────────────────────────────
//  Work out what a teacher just added — from a File or from a URL —
//  and turn it into one of the site's item types.
// ─────────────────────────────────────────────────────────────

/** Everything the file picker accepts. */
export const ACCEPT = 'image/*,application/pdf,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,video/mp4,video/webm,.mp4,.webm,.mov,audio/*,.mp3'

const ext = (name = '') => (name.split('?')[0].split('#')[0].match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase()

const byExt = {
  pdf: 'pdf',
  docx: 'docx',
  doc: 'file', ppt: 'file', pptx: 'file', xls: 'file', xlsx: 'file',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image', avif: 'image',
  mp4: 'video', webm: 'video', mov: 'video', m4v: 'video',
  mp3: 'audio', wav: 'audio', m4a: 'audio', ogg: 'audio',
}

/** File → item type ('image' | 'pdf' | 'docx' | 'video' | 'audio' | 'file'). */
export function typeOfFile(file) {
  const m = file.type || ''
  if (m.startsWith('image/')) return 'image'
  if (m === 'application/pdf') return 'pdf'
  if (m.startsWith('video/')) return 'video'
  if (m.startsWith('audio/')) return 'audio'
  if (m.includes('wordprocessingml')) return 'docx'
  return byExt[ext(file.name)] || 'file'
}

export const youtubeId = (url) =>
  url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/)?.[1] || null

export const driveId = (url) =>
  url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]{20,})/)?.[1] || null

/** Make whatever the teacher pasted into a real URL (adds https:// when missing). Returns null if it isn't one. */
export function normalizeUrl(raw) {
  let s = (raw || '').trim()
  if (!s) return null
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`
  try {
    const u = new URL(s)
    return u.hostname.includes('.') ? u.toString() : null
  } catch { return null }
}

/**
 * URL → the item fields the site needs.
 * Known platforms get their own type so they can play inside the site.
 */
export function describeUrl(url) {
  const yt = youtubeId(url)
  if (yt) return { type: 'youtube', youtubeId: yt, url }

  if (/wordwall\.net/i.test(url)) return { type: 'wordwall', url }
  if (/(facebook\.com|fb\.watch|fb\.com)/i.test(url)) return { type: 'facebook', url }

  const gd = driveId(url)
  if (gd) return { type: 'link', url, embed: `https://drive.google.com/file/d/${gd}/preview`, remoteThumb: `https://drive.google.com/thumbnail?id=${gd}&sz=w640` }

  // a direct link to a file: treat it exactly like an uploaded one
  const t = byExt[ext(new URL(url).pathname)]
  if (t && t !== 'file' && t !== 'docx') return { type: t, file: url, url }

  return { type: 'link', url }
}

/** A readable default name: "unit-3_my poster.pdf" → "Unit 3 my poster" */
export function nameFromFile(file) {
  const base = file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  return base.charAt(0).toUpperCase() + base.slice(1)
}

/** Safe storage key for an uploaded file. */
export const safeFileName = (name) => {
  const e = ext(name)
  const base = name.replace(/\.[a-z0-9]+$/i, '').normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'file'
  return e ? `${base}.${e}` : base
}
