import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react'
import Icon from './Icon'
import { countItems } from '../data/resources'
import { useLang } from '../i18n'

/** A folder (or external link) rendered as a card. `to` = route of the folder. */
export default function FolderCard({ node, to }) {
  const { t, tx, isAr } = useLang()
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const items = countItems(node)
  const folders = node.children?.length || 0

  if (node.link) {
    return (
      <a href={node.link} target="_blank" rel="noopener noreferrer" className={`cat-card link-card ${node.link.includes("facebook") ? "fb" : node.link.includes("drive.google") ? "drive" : ""}`}>
        <div className="cat-head">
          <span className="cat-icon"><Icon name={node.icon} /></span>
          {node.badge && <span className="badge">{tx(node.badge)}</span>}
        </div>
        <h3>{tx(node.name)}</h3>
        <p>{tx(node.description)}</p>
        <div className="cat-foot">
          <span className="count">{t('newTab')}</span>
          <span className="cat-link">{t('openLink')} <ExternalLink /></span>
        </div>
      </a>
    )
  }

  const playful = node.id === 'games'
  return (
    <Link to={to} className={`cat-card ${playful ? 'playful' : ''}`}>
      <div className="cat-head">
        <span className="cat-icon"><Icon name={node.icon} /></span>
        {node.badge && <span className="badge">{tx(node.badge)}</span>}
      </div>
      <h3>{tx(node.name)}</h3>
      <p>{tx(node.description)}</p>
      <div className="cat-foot">
        <span className="count">
          {folders > 0 && <><strong>{folders}</strong> {t('folders')}{items > 0 ? ' · ' : ''}</>}
          {items > 0 && <><strong>{items}</strong> {t('files')}</>}
          {!folders && !items && t('comingSoon')}
        </span>
        <span className="cat-link">{t('openFolder')} <Arrow /></span>
      </div>
    </Link>
  )
}
