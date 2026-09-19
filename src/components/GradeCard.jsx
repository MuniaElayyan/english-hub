import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { countItems } from '../data/resources'
import { useLang } from '../i18n'
import { AR_ORDINALS, EN_NUMBERS } from '../library'

const words = { en: EN_NUMBERS, ar: AR_ORDINALS }

export default function GradeCard({ grade }) {
  const { t, tx, isAr, lang } = useLang()
  const count = countItems(grade)
  const Arrow = isAr ? ArrowLeft : ArrowRight
  return (
    <Link to={`/classes/${grade.id}`} className={`grade-card ${grade.accent}`} aria-label={`${t('exploreGrade')} ${tx(grade.name)}`}>
      <span className="gc-deco" />
      <div className="gc-num">{grade.number}</div>
      <div className="gc-word">{isAr ? `الصف ${words.ar[grade.number] || grade.number}` : `grade ${words.en[grade.number] || grade.number}`}</div>
      <h3>{tx(grade.tagline)}</h3>
      <p>{tx(grade.description)}</p>
      <div className="gc-foot">
        <span className="gc-count"><strong>{count}</strong> {count ? t('items') : t('comingSoon')}</span>
        <span className="btn sm">{t('exploreGrade')} <Arrow className="arrow" /></span>
      </div>
    </Link>
  )
}
