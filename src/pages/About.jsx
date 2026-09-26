import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import Reveal, { Stagger } from '../components/Reveal'
import ContactModal from '../components/ContactModal'
import { teacher } from '../data/site'
import { useLibrary } from '../library'
import { useLang } from '../i18n'

export default function About() {
  const { t, tx, isAr } = useLang()
  const { grades, countAllItems } = useLibrary()
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <>
      <div className="page-head">
        <div className="container">
          <Reveal>
            <h1>{t('aboutTitle')}</h1>
            <p className="lead">{t('aboutSub')}</p>
          </Reveal>
        </div>
      </div>

      <section className="container" style={{ paddingBottom: 'clamp(64px, 9vw, 120px)' }}>
        <div className="about-grid">
          <Reveal className="profile-card">
            <div className="profile-photo">
              {teacher.photo ? <img src={teacher.photo} alt={tx(teacher.name)} /> : (
                <div className="ph-placeholder"><span className="ring">E</span><span>{t('photoPlaceholder')}</span></div>
              )}
              <span className="ph-tag">{tx(teacher.title)}</span>
            </div>
            <div className="profile-body">
              <div>
                <h2>{tx(teacher.name)}</h2>
                <p className="pb-role">{tx(teacher.school)}</p>
              </div>
              <dl>
                <dt>{t('subject')}</dt><dd>{t('english')}</dd>
                <dt>{t('grades')}</dt><dd>{grades.map((g) => g.number).join(' · ')}</dd>
                <dt>{t('experience')}</dt><dd>{teacher.yearsTeaching} {t('years')}</dd>
                <dt>{t('resourcesLabel')}</dt><dd>{countAllItems()}+ {t('online')}</dd>
              </dl>
              <button type="button" className="btn soft" onClick={() => setContactOpen(true)} style={{ justifyContent: 'center', width: '100%' }}><Mail /> {t('contact')}</button>
            </div>
          </Reveal>

          <div className="about-body">
            <Reveal className="bio">
              <h2>{t('aboutMe')}</h2>
              <div style={{ marginTop: 18 }}>
                {tx(teacher.bio).map((p, i) => <p key={i} className="lead">{p}</p>)}
              </div>
            </Reveal>

            <Reveal>
              <h2>{t('howITeach')}</h2>
              <Stagger className="philosophy" stagger={0.08}>
                {teacher.philosophy.map((p, i) => (
                  <Stagger.Item key={i}><div className="phil"><strong>{tx(p.title)}</strong><span>{tx(p.text)}</span></div></Stagger.Item>
                ))}
              </Stagger>
            </Reveal>

            <Reveal>
              <h2>{t('myClasses')}</h2>
              <div className="feature-list">
                {grades.map((g) => (
                  <Link key={g.id} to={`/classes/${g.id}`} className="feature">
                    <span className="f-icon" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{g.number}</span>
                    <div style={{ flex: 1 }}><strong>{tx(g.name)}</strong><span>{tx(g.tagline)}</span></div>
                    <Arrow style={{ width: 18, alignSelf: 'center', color: 'var(--muted)' }} />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} to={teacher.email} />
    </>
  )
}
