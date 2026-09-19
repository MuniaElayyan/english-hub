import { useState } from 'react'
import { LogIn, Loader2 } from 'lucide-react'
import Modal from './Modal'
import { useLang } from '../i18n'
import { useLibrary } from '../library'

/** Sign-in for teacher mode. Cloud → e-mail + password · local → passcode. */
export default function TeacherLogin({ open, onClose }) {
  const { t } = useLang()
  const { mode, login } = useLibrary()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr(false)
    try {
      await login(mode === 'cloud' ? { email, password } : { passcode: password })
      setPassword(''); onClose()
    } catch { setErr(true) } finally { setBusy(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('teacherLogin')} subtitle={t('teacherLoginSub')} narrow>
      <form className="contact-form" onSubmit={submit}>
        {mode === 'cloud' && (
          <label className="form-field">
            <span>{t('email')}</span>
            <input type="email" dir="ltr" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        )}
        <label className="form-field">
          <span>{mode === 'cloud' ? t('password') : t('passcode')}</span>
          <input type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus={mode !== 'cloud'} />
        </label>
        {err && <p className="form-warn">{t('loginFailed')}</p>}
        {mode === 'local' && <p className="add-note">{t('localNote')}</p>}
        <div className="modal-foot" style={{ padding: 0 }}>
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="btn" disabled={busy}>{busy ? <Loader2 className="spin" /> : <LogIn />} {t('signIn')}</button>
        </div>
      </form>
    </Modal>
  )
}
