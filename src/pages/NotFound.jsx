import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLang } from '../i18n'

export default function NotFound() {
  const { t, isAr } = useLang()
  const Arrow = isAr ? ArrowRight : ArrowLeft
  return (
    <section className="container notfound">
      <div>
        <div className="big">404</div>
        <h2 style={{ marginTop: 12 }}>{t('nfTitle')}</h2>
        <p className="muted" style={{ marginTop: 10 }}>{t('nfSub')}</p>
        <Link to="/" className="btn" style={{ marginTop: 24 }}><Arrow /> {t('backHome')}</Link>
      </div>
    </section>
  )
}
