import { useState } from 'react'
import { FolderPlus, Loader2 } from 'lucide-react'
import Modal from './Modal'
import Icon from './Icon'
import { useLang } from '../i18n'
import { useLibrary } from '../library'

// Ready-made sections: picking one fills both names in, the teacher can still edit them.
export const FOLDER_PRESETS = [
  { key: 'unit', icon: 'Folder', en: 'Unit', ar: 'الوحدة' },
  { key: 'assessment', icon: 'ClipboardCheck', en: 'Student Assessment', ar: 'أساس تقييم الطالب' },
  { key: 'plans', icon: 'ClipboardList', en: 'Lesson Plans', ar: 'الخطط' },
  { key: 'posters', icon: 'Image', en: 'Posters', ar: 'بوسترات' },
  { key: 'worksheets', icon: 'PenLine', en: 'Worksheets', ar: 'أوراق عمل' },
  { key: 'videos', icon: 'Clapperboard', en: 'Videos', ar: 'فيديوهات' },
  { key: 'games', icon: 'Gamepad2', en: 'Interactive Games', ar: 'ألعاب تفاعلية' },
  { key: 'audio', icon: 'Headphones', en: 'Audio', ar: 'صوتيات' },
  { key: 'other', icon: 'FolderOpen', en: '', ar: '' },
]

export default function AddFolderModal({ open, onClose, parentKey, siblings }) {
  const { t, lang } = useLang()
  const { addFolder } = useLibrary()
  const [preset, setPreset] = useState(null)
  const [en, setEn] = useState('')
  const [ar, setAr] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = (p) => { setPreset(p); setEn(p.en); setAr(p.ar) }
  const reset = () => { setPreset(null); setEn(''); setAr(''); setErr('') }

  const submit = async (e) => {
    e.preventDefault()
    const a = en.trim(), b = ar.trim()
    if (!a && !b) { setErr(t('nameRequired')); return }
    setBusy(true); setErr('')
    try {
      await addFolder(parentKey, { name: { en: a || b, ar: b || a }, icon: preset?.icon || 'FolderOpen' }, siblings)
      reset(); onClose()
    } catch (e2) { setErr(`${t('saveFailed')} ${e2.message || ''}`) } finally { setBusy(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('addFolder')} subtitle={t('addFolderSub')} narrow>
      <form className="contact-form" onSubmit={submit}>
        <div className="form-field">
          <span>{t('folderKind')}</span>
          <div className="preset-grid">
            {FOLDER_PRESETS.map((p) => (
              <button type="button" key={p.key} className={`preset ${preset?.key === p.key ? 'on' : ''}`} onClick={() => pick(p)}>
                <Icon name={p.icon} /> {p[lang] || t('otherFolder')}
              </button>
            ))}
          </div>
        </div>
        <label className="form-field">
          <span>{t('nameEn')}</span>
          <input type="text" dir="ltr" value={en} onChange={(e) => setEn(e.target.value)} placeholder="Unit 3 — My Day" />
        </label>
        <label className="form-field">
          <span>{t('nameAr')}</span>
          <input type="text" dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} placeholder="الوحدة الثالثة — يومي" />
        </label>
        {err && <p className="form-warn">{err}</p>}
        <div className="modal-foot" style={{ padding: 0 }}>
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="btn" disabled={busy}>{busy ? <Loader2 className="spin" /> : <FolderPlus />} {t('addFolder')}</button>
        </div>
      </form>
    </Modal>
  )
}
