import GradeGrid from '../components/GradeGrid'
import Reveal from '../components/Reveal'
import { useLang } from '../i18n'

export default function Classes() {
  const { t } = useLang()
  return (
    <>
      <div className="page-head">
        <div className="container">
          <Reveal>
            <h1>{t('classes')}</h1>
            <p className="lead">{t('classesSub')}</p>
          </Reveal>
        </div>
      </div>
      <section className="container" style={{ paddingBottom: 'clamp(64px, 9vw, 120px)' }}>
        <GradeGrid />
      </section>
    </>
  )
}
