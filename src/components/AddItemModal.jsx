import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Link2, Loader2, Plus, ImagePlus, FileText, Film, Gamepad2, Music, X } from 'lucide-react'
import Modal from './Modal'
import { useLang } from '../i18n'
import { useLibrary } from '../library'
import { ACCEPT, typeOfFile, describeUrl, normalizeUrl, nameFromFile } from '../library/detect'
import { thumbFromFile, thumbFromLink, thumbFromImage } from '../library/thumbs'

const CLOUD_MAX_MB = 50 // Supabase free tier: per-file limit
const typeNames = { image: 'IMG', pdf: 'PDF', docx: 'DOCX', video: 'MP4', audio: 'AUDIO', file: 'FILE', youtube: 'YouTube', facebook: 'Facebook', wordwall: 'Wordwall', game: 'Game', link: 'Link' }
const isArabic = (s) => /[\u0600-\u06FF]/.test(s)

/**
 * "Add material" — the teacher drops a file or pastes a link; the site works
 * out what it is, reads it to build the card picture, and saves it in `folderKey`.
 * `kind` ('docs' | 'videos' | 'games') only tunes the wording and the default tab.
 */
export default function AddItemModal({ open, onClose, folderKey, folderName, kind = 'docs' }) {
  const { t } = useLang()
  const { addItem, mode } = useLibrary()
  const [tab, setTab] = useState(kind === 'games' ? 'link' : 'file')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [info, setInfo] = useState(null)     // { type, … } — what we detected
  const [meta, setMeta] = useState({})       // pages / duration
  const [en, setEn] = useState('')
  const [ar, setAr] = useState('')
  const [thumb, setThumb] = useState(null)   // Blob | url string | null
  const [thumbSrc, setThumbSrc] = useState(null)
  const [reading, setReading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)
  const job = useRef(0)
  const fileInput = useRef(null)
  const thumbInput = useRef(null)

  // preview URL for the generated picture
  useEffect(() => {
    if (thumb instanceof Blob) { const u = URL.createObjectURL(thumb); setThumbSrc(u); return () => URL.revokeObjectURL(u) }
    setThumbSrc(thumb || null)
  }, [thumb])

  const reset = () => { job.current++; setFile(null); setUrl(''); setInfo(null); setMeta({}); setEn(''); setAr(''); setThumb(null); setReading(false); setErr('') }
  useEffect(() => { if (open) { reset(); setTab(kind === 'games' ? 'link' : 'file') } }, [open, kind]) // eslint-disable-line react-hooks/exhaustive-deps

  const suggestName = (name) => {
    if (!name) return
    if (isArabic(name)) setAr((v) => v || name); else setEn((v) => v || name)
  }

  // ── file chosen ──
  const takeFile = async (f) => {
    if (!f) return
    const id = ++job.current
    const type = typeOfFile(f)
    setErr(''); setFile(f); setInfo({ type }); setThumb(null); setMeta({})
    suggestName(nameFromFile(f))
    if (mode === 'cloud' && f.size > CLOUD_MAX_MB * 1024 * 1024) setErr(t('fileTooBig'))
    setReading(true)
    const r = await thumbFromFile(f, type)
    if (id !== job.current) return
    setThumb(r.thumb || null); setMeta({ pages: r.pages, duration: r.duration }); setReading(false)
  }

  // ── link typed / pasted: read it after a short pause ──
  useEffect(() => {
    if (tab !== 'link') return
    const clean = normalizeUrl(url)
    if (!clean) { setInfo(null); return }
    const id = ++job.current
    const timer = setTimeout(async () => {
      let d = describeUrl(clean)
      if (kind === 'games' && d.type === 'link') d = { ...d, type: 'game' }
      setInfo(d); setThumb(null); setReading(true); setErr('')
      const r = await thumbFromLink(d)
      if (id !== job.current) return
      setThumb(r.thumb || null); setMeta({ duration: r.duration }); suggestName(r.title); setReading(false)
    }, 650)
    return () => clearTimeout(timer)
  }, [url, tab, kind]) // eslint-disable-line react-hooks/exhaustive-deps

  const switchTab = (next) => { if (next !== tab) { reset(); setTab(next) } }

  const customThumb = async (f) => {
    if (!f) return
    try { job.current++; setReading(false); setThumb(await thumbFromImage(f)) } catch { /* not an image */ }
  }

  const submit = async (e) => {
    e.preventDefault()
    const a = en.trim(), b = ar.trim()
    if (!info || (tab === 'file' && !file)) { setErr(tab === 'file' ? t('chooseFileFirst') : t('pasteLinkFirst')); return }
    if (!a && !b) { setErr(t('nameRequired')); return }
    setBusy(true); setErr('')
    try {
      const { remoteThumb: _drop, ...fields } = info
      await addItem(folderKey, {
        data: { ...fields, ...Object.fromEntries(Object.entries(meta).filter(([, v]) => v)), title: { en: a || b, ar: b || a } },
        file: tab === 'file' ? file : null,
        thumb,
      })
      reset(); onClose()
    } catch (e2) { setErr(`${t('saveFailed')} ${e2.message || ''}`) } finally { setBusy(false) }
  }

  const TypeIcon = !info ? FileText : ['video', 'youtube', 'facebook'].includes(info.type) ? Film : ['wordwall', 'game'].includes(info.type) ? Gamepad2 : info.type === 'audio' ? Music : info.type === 'link' ? Link2 : FileText
  const hint = t(kind === 'videos' ? 'hintVideos' : kind === 'games' ? 'hintGames' : 'hintDocs')

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={t('addMaterial')} subtitle={folderName} narrow>
      <form className="contact-form add-form" onSubmit={submit}>
        <div className="seg" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'file'} className={tab === 'file' ? 'on' : ''} onClick={() => switchTab('file')}><UploadCloud /> {t('uploadFile')}</button>
          <button type="button" role="tab" aria-selected={tab === 'link'} className={tab === 'link' ? 'on' : ''} onClick={() => switchTab('link')}><Link2 /> {t('pasteLink')}</button>
        </div>

        {tab === 'file' ? (
          <div
            className={`dropzone ${drag ? 'drag' : ''} ${file ? 'has' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); takeFile(e.dataTransfer.files?.[0]) }}
            onClick={() => fileInput.current?.click()}
            role="button" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.current?.click()}
          >
            <input ref={fileInput} type="file" accept={ACCEPT} hidden onChange={(e) => { takeFile(e.target.files?.[0]); e.target.value = '' }} />
            <UploadCloud />
            {file ? (
              <><strong dir="auto">{file.name}</strong><span>{(file.size / 1048576).toFixed(1)} MB · {t('changeFile')}</span></>
            ) : (
              <><strong>{t('dropHere')}</strong><span>{hint}</span></>
            )}
          </div>
        ) : (
          <label className="form-field">
            <span>{t('linkLabel')}</span>
            <input type="text" inputMode="url" dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" autoFocus />
            <small className="field-hint">{hint}</small>
          </label>
        )}

        {info && (
          <div className="thumb-preview">
            <div className="tp-img">
              {reading ? <span className="tp-state"><Loader2 className="spin" /> {t('readingSource')}</span>
                : thumbSrc ? <img src={thumbSrc} alt="" />
                : <span className="tp-state"><TypeIcon /> {t('noPreview')}</span>}
            </div>
            <div className="tp-side">
              <span className="filetype">{typeNames[info.type] || info.type}</span>
              <p>{t('cardPicture')}</p>
              <input ref={thumbInput} type="file" accept="image/*" hidden onChange={(e) => { customThumb(e.target.files?.[0]); e.target.value = '' }} />
              <div className="tp-actions">
                <button type="button" className="btn sm soft" onClick={() => thumbInput.current?.click()}><ImagePlus /> {t('choosePicture')}</button>
                {thumb && !reading && <button type="button" className="btn sm ghost" onClick={() => setThumb(null)} aria-label={t('removePicture')}><X /></button>}
              </div>
            </div>
          </div>
        )}

        <div className="two-col">
          <label className="form-field">
            <span>{t('nameEn')}</span>
            <input type="text" dir="ltr" value={en} onChange={(e) => setEn(e.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('nameAr')}</span>
            <input type="text" dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} />
          </label>
        </div>

        {mode === 'local' && <p className="add-note">{t('localNote')}</p>}
        {err && <p className="form-warn">{err}</p>}

        <div className="modal-foot" style={{ padding: 0 }}>
          <button type="button" className="btn ghost" onClick={onClose} disabled={busy}>{t('cancel')}</button>
          <button type="submit" className="btn" disabled={busy || reading}>{busy ? <><Loader2 className="spin" /> {t('saving')}</> : <><Plus /> {t('addToFolder')}</>}</button>
        </div>
      </form>
    </Modal>
  )
}
