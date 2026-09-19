// ─────────────────────────────────────────────────────────────
//  THUMBNAILS — read the thing the teacher added and make a
//  preview picture for its card. Everything runs in the browser.
//
//    image  → scaled-down copy
//    pdf    → first page (pdf.js)
//    docx   → embedded cover / first picture, else a drawn "page"
//             showing the document's own first lines
//    video  → a frame from the start of the clip
//    link   → YouTube / Google Drive / Wordwall picture, else the
//             page's own share image (og:image) or a screenshot
//
//  Each function resolves to a JPEG Blob, a remote URL string, or null.
//  They never throw: no thumbnail simply means the card shows an icon.
// ─────────────────────────────────────────────────────────────

const MAX_W = 720
const QUALITY = 0.82

const toBlob = (canvas) => new Promise((res) => canvas.toBlob((b) => res(b), 'image/jpeg', QUALITY))

function drawScaled(source, w, h) {
  const scale = Math.min(1, MAX_W / w)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(w * scale))
  canvas.height = Math.max(1, Math.round(h * scale))
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff' // transparent PNGs → white, not black
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

/** True when a picture is (nearly) one flat colour — e.g. Word's empty built-in preview. */
function isBlank(canvas) {
  const { width: w, height: h } = canvas
  const d = canvas.getContext('2d').getImageData(0, 0, w, h).data
  let min = 255, max = 0
  for (let i = 0; i < d.length; i += 4 * 7) { // every 7th pixel is plenty
    const v = (d[i] + d[i + 1] + d[i + 2]) / 3
    if (v < min) min = v
    if (v > max) max = v
    if (max - min > 40) return false
  }
  return true
}

/** Cut the empty white margin off a rendered page so the content fills the card. */
function trimWhite(canvas) {
  const { width: w, height: h } = canvas
  const d = canvas.getContext('2d').getImageData(0, 0, w, h).data
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4
      if (d[i] < 242 || d[i + 1] < 242 || d[i + 2] < 242) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  if (x1 < 0) return canvas // completely white
  const pad = Math.round(w * 0.03)
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w, x1 + pad); y1 = Math.min(h, y1 + pad)
  const cw = x1 - x0, ch = y1 - y0
  if (cw * ch > w * h * 0.8 || cw < 40 || ch < 40) return canvas // nothing worth trimming
  const out = document.createElement('canvas')
  out.width = cw; out.height = ch
  out.getContext('2d').drawImage(canvas, x0, y0, cw, ch, 0, 0, cw, ch)
  return out
}

const loadImage = (src, cors = false) => new Promise((res, rej) => {
  const img = new Image()
  if (cors) img.crossOrigin = 'anonymous'
  img.onload = () => res(img)
  img.onerror = () => rej(new Error('image failed to load'))
  img.src = src
})

// ── image ─────────────────────────────────────────────────────
export async function thumbFromImage(blob, { rejectBlank = false } = {}) {
  const url = URL.createObjectURL(blob)
  try {
    const img = await loadImage(url)
    const canvas = drawScaled(img, img.naturalWidth, img.naturalHeight)
    if (rejectBlank && isBlank(canvas)) return null
    return await toBlob(canvas)
  } finally { URL.revokeObjectURL(url) }
}

// ── pdf ───────────────────────────────────────────────────────
let pdfjsPromise
const loadPdfjs = () => (pdfjsPromise ||= Promise.all([
  import('pdfjs-dist/build/pdf'),
  import('pdfjs-dist/build/pdf.worker.min.js?url'),
]).then(([lib, worker]) => {
  const pdfjs = lib.default?.getDocument ? lib.default : lib
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return pdfjs
}))

export async function thumbFromPdf(blob) {
  const pdfjs = await loadPdfjs()
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise
  try {
    const page = await doc.getPage(1)
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: Math.min(2, MAX_W / base.width) })
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(viewport.width)
    canvas.height = Math.round(viewport.height)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport }).promise
    return { thumb: await toBlob(trimWhite(canvas)), pages: doc.numPages }
  } finally { doc.destroy() }
}

// ── docx ──────────────────────────────────────────────────────
const decodeXml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')

/** Paragraph texts of a .docx, in order. */
function docxParagraphs(xml) {
  const out = []
  for (const p of xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || []) {
    const text = (p.match(/<w:t(?: [^>]*)?>[\s\S]*?<\/w:t>/g) || []).map((t) => decodeXml(t.replace(/<[^>]+>/g, ''))).join('').trim()
    if (text) out.push({ text, heading: /<w:pStyle w:val="(Title|Heading|heading)/.test(p) || /<w:b\/>/.test(p.slice(0, 400)) })
    if (out.length >= 28) break
  }
  return out
}

/** Draw an A4-looking page with the document's first lines on it. */
function drawDocPage(paras) {
  const W = 600, H = 848, M = 56
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#2b579a'; ctx.fillRect(0, 0, W, 10) // Word-blue top edge
  let y = M + 14
  const rtlRe = /[\u0600-\u06FF]/
  for (const [i, p] of paras.entries()) {
    const big = i === 0 || p.heading
    const size = i === 0 ? 27 : big ? 20 : 16
    const lh = Math.round(size * 1.5)
    const rtl = rtlRe.test(p.text)
    ctx.font = `${big ? '700' : '400'} ${size}px "Noto Naskh Arabic", "Segoe UI", Tahoma, Arial, sans-serif`
    ctx.fillStyle = big ? '#1d2a44' : '#3c4454'
    ctx.direction = rtl ? 'rtl' : 'ltr'
    ctx.textAlign = rtl ? 'right' : 'left'
    const x = rtl ? W - M : M
    // word-wrap
    let line = ''
    const lines = []
    for (const word of p.text.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > W - 2 * M && line) { lines.push(line); line = word } else line = test
    }
    if (line) lines.push(line)
    for (const l of lines.slice(0, big ? 3 : 4)) {
      if (y > H - M) break
      ctx.fillText(l, x, y)
      y += lh
    }
    y += big ? 10 : 6
    if (y > H - M) break
  }
  // soft fade at the bottom, like a page that continues
  const g = ctx.createLinearGradient(0, H - 140, 0, H)
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,1)')
  ctx.fillStyle = g; ctx.fillRect(0, H - 140, W, 140)
  return canvas
}

export async function thumbFromDocx(blob) {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(await blob.arrayBuffer())
  // 1) Word sometimes saves its own preview picture
  const cover = Object.keys(zip.files).find((n) => /^docProps\/thumbnail\.(jpe?g|png)$/i.test(n))
  if (cover) {
    try {
      const t = await thumbFromImage(await zip.file(cover).async('blob'), { rejectBlank: true }) // it is often an empty white page
      if (t) return t
    } catch { /* emf/wmf etc. — keep going */ }
  }
  // 2) draw the first lines of the document
  const xml = await zip.file('word/document.xml')?.async('string')
  const paras = xml ? docxParagraphs(xml) : []
  if (paras.length >= 2) return await toBlob(drawDocPage(paras))
  // 3) a picture-only document → use its first picture
  const pic = Object.keys(zip.files).find((n) => /^word\/media\/.+\.(jpe?g|png|gif|webp)$/i.test(n))
  if (pic) {
    try { return await thumbFromImage(await zip.file(pic).async('blob')) } catch { /* ignore */ }
  }
  return paras.length ? await toBlob(drawDocPage(paras)) : null
}

// ── video ─────────────────────────────────────────────────────
/** Grab a frame a moment into the clip. `src` = object URL or (CORS-enabled) remote URL. */
export function frameFromVideo(src, remote = false) {
  return new Promise((resolve) => {
    const v = document.createElement('video')
    let done = false
    const finish = (val) => { if (done) return; done = true; clearTimeout(timer); v.removeAttribute('src'); v.load(); resolve(val) }
    const timer = setTimeout(() => finish(null), 15000)
    if (remote) v.crossOrigin = 'anonymous'
    v.muted = true; v.playsInline = true; v.preload = 'auto'
    v.onloadedmetadata = () => {
      const d = Number.isFinite(v.duration) ? v.duration : 0
      v.currentTime = d ? Math.min(2, d / 4) : 0.1
    }
    v.onseeked = async () => {
      try {
        const thumb = await toBlob(drawScaled(v, v.videoWidth, v.videoHeight))
        const d = Number.isFinite(v.duration) ? Math.round(v.duration) : 0
        finish({ thumb, duration: d ? `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}` : undefined })
      } catch { finish(null) } // tainted canvas (remote video without CORS)
    }
    v.onerror = () => finish(null)
    v.src = src
  })
}

export async function thumbFromVideo(blob) {
  const url = URL.createObjectURL(blob)
  try { return await frameFromVideo(url) } finally { URL.revokeObjectURL(url) }
}

// ── links ─────────────────────────────────────────────────────
const getJson = async (url, ms = 12000) => {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctl.signal })
    return r.ok ? await r.json() : null
  } catch { return null } finally { clearTimeout(timer) }
}

/** Copy a remote picture into our own storage when the host allows it, otherwise keep the URL. */
async function keep(url) {
  if (!url) return null
  try {
    const r = await fetch(url, { mode: 'cors' })
    if (r.ok) {
      const b = await r.blob()
      if (b.type.startsWith('image/')) return await thumbFromImage(b)
    }
  } catch { /* not CORS-friendly — hot-link it instead */ }
  try { await loadImage(url); return url } catch { return null }
}

/**
 * Picture (and page title) for a pasted link.
 * `info` comes from describeUrl(). Resolves to { thumb, title? }.
 */
export async function thumbFromLink(info) {
  if (info.type === 'youtube') {
    const meta = await getJson(`https://noembed.com/embed?url=${encodeURIComponent(info.url)}`, 6000)
    return { thumb: `https://img.youtube.com/vi/${info.youtubeId}/hqdefault.jpg`, title: meta?.title }
  }
  if (info.remoteThumb) { // Google Drive
    const t = await keep(info.remoteThumb)
    if (t) return { thumb: t }
  }
  if (info.type === 'image') return { thumb: info.file }
  if (info.type === 'video') {
    const f = await frameFromVideo(info.file, true)
    if (f) return f
  }
  if (info.type === 'wordwall') {
    const o = await getJson(`https://wordwall.net/api/oembed?url=${encodeURIComponent(info.url)}&format=json`, 8000)
    if (o?.thumbnail_url) return { thumb: (await keep(o.thumbnail_url)) || o.thumbnail_url, title: o.title }
  }
  // Any other page: its share image, and failing that a screenshot (microlink.io — free, no key)
  const api = `https://api.microlink.io/?url=${encodeURIComponent(info.url)}`
  const meta = await getJson(api)
  const title = meta?.data?.title
  const og = meta?.data?.image?.url
  if (og) { const t = await keep(og); if (t) return { thumb: t, title } }
  const shot = await getJson(`${api}&screenshot=true&meta=false`, 20000)
  const s = shot?.data?.screenshot?.url
  if (s) { const t = await keep(s); if (t) return { thumb: t, title } }
  return { thumb: null, title }
}

/** One entry point for uploaded files. Resolves to { thumb, pages?, duration? }. */
export async function thumbFromFile(file, type) {
  try {
    if (type === 'image') return { thumb: await thumbFromImage(file) }
    if (type === 'pdf') return await thumbFromPdf(file)
    if (type === 'docx') return { thumb: await thumbFromDocx(file) }
    if (type === 'video') return (await thumbFromVideo(file)) || { thumb: null }
  } catch (e) { console.warn('[library] thumbnail failed', e) }
  return { thumb: null }
}
