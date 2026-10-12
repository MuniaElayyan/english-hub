import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import Modal from './Modal'
import { useLang } from '../i18n'
import { useLibrary } from '../library'

/** Adds a whole new grade (class) to the site. */
export default function AddGradeModal({ open, onClose }) {
  const { t } = useLang()
  const { addGrade, grades } = useLibrary()
  const [number, setNumber] = useState('')
  const [en, setEn] = useState('')
  const [ar, setAr] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const n = parseInt(number, 10)
    if (!(n >= 1 && n <= 12)) { setErr(t('gradeNumberInvalid')); return }
    if (grades.some((g) => g.number === n)) { setErr(t('gradeExists')); return }
    setBusy(true); setErr('')
    try {
      const a = en.trim(), b = ar.trim()
      await addGrade({ number: n, tagline: { en: a || b || `English for Palestine ${n}`, ar: b || a || `English for Palestine ${n}` }, description: { en: '', ar: '' } })
      setNumber(''); setEn(''); setAr(''); onClose()
    } catch (e2) { setErr(`${t('saveFailed')} ${e2.message || ''}`) } finally { setBusy(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('addGrade')} subtitle={t('addGradeSub')} narrow>
      <form className="contact-form" onSubmit={submit}>
        <label className="form-field">
          <span>{t('gradeNumber')}</span>
          <input type="number" min="1" max="12" dir="ltr" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="5" required autoFocus />
        </label>
        <label className="form-field">
          <span>{t('gradeTaglineEn')}</span>
          <input type="text" dir="ltr" value={en} onChange={(e) => setEn(e.target.value)} placeholder="Growing confident readers." />
        </label>
        <label className="form-field">
          <span>{t('gradeTaglineAr')}</span>
          <input type="text" dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} placeholder="قرّاء واثقون بأنفسهم." />
        </label>
        {err && <p className="form-warn">{err}</p>}
        <div className="modal-foot" style={{ padding: 0 }}>
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="btn" disabled={busy}>{busy ? <Loader2 className="spin" /> : <Plus />} {t('addGrade')}</button>
        </div>
      </form>
    </Modal>
  )
}
