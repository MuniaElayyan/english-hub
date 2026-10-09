import { useState } from 'react'
import { Send } from 'lucide-react'
import Modal from './Modal'
import { useLang } from '../i18n'

/**
 * Contact card: collects the sender's name, role and message, then hands
 * everything to the visitor's own email app addressed straight to `to`.
 * No backend involved — mailto: is the only way a static site can compose
 * a real email on the visitor's behalf.
 */
export default function ContactModal({ open, onClose, to }) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [warn, setWarn] = useState(false)

  const send = (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) { setWarn(true); return }
    const subject = role.trim() ? `${name} (${role})` : name
    const body = `${message}\n\n—\n${name}${role.trim() ? ` · ${role}` : ''}`
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    onClose()
    setName(''); setRole(''); setMessage(''); setWarn(false)
  }

  return (
    <Modal open={open} onClose={onClose} title={t('contactTitle')} subtitle={t('contactSub')} narrow>
      <form className="contact-form" onSubmit={send}>
        <label className="form-field">
          <span>{t('yourName')}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>{t('yourRole')}</span>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder={t('yourRolePlaceholder')} />
        </label>
        <label className="form-field">
          <span>{t('yourMessage')}</span>
          <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('yourMessagePlaceholder')} required />
        </label>
        {warn && <p className="form-warn">{t('fillRequired')}</p>}
        <div className="modal-foot" style={{ padding: 0 }}>
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="btn"><Send /> {t('sendEmail')}</button>
        </div>
      </form>
    </Modal>
  )
}
