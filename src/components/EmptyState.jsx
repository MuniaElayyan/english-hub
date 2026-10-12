import { FolderOpen } from 'lucide-react'
import { useLang } from '../i18n'

export default function EmptyState({ title, text, folder, icon: IconC = FolderOpen, children }) {
  const { t } = useLang()
  return (
    <div className="empty" role="status">
      <div className="e-icon"><IconC /></div>
      <h3>{title || t('emptyFolder')}</h3>
      <p>{text || t('emptyFolderSub')}</p>
      {folder && <p><code dir="ltr">{folder}</code></p>}
      {children}
    </div>
  )
}
