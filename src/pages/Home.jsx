import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft, GraduationCap, BookOpen, ClipboardCheck, Gamepad2, Clapperboard, Search } from 'lucide-react'
import GradeGrid from '../components/GradeGrid'
import Reveal, { Stagger } from '../components/Reveal'
import { teacher, book } from '../data/site'
import { useLibrary } from '../library'
import { useLang } from '../i18n'

const ease = [0.22, 1, 0.36, 1]

export default function Home() {
  const reduce = useReducedMotion()
  const { t, tx, isAr } = useLang()
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const up = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })
  const { grades, countAllItems } = useLibrary()
  const total = countAllItems()

  return (
    <>
      <section className="hero">
        <div className="hero-video-bg">
          <video
            className="hero-video"
            src="/videos/hero-classroom.mp4"
            poster="/hero-classroom-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div className="hero-video-overlay" />
        </div>
        <div className="hero-grid hero-inner">
          <div>
            <motion.div className="hero-eyebrow" {...up(0.05)}>
              <span className="dot"><GraduationCap /></span>
              {t('heroEyebrow')} · {tx(teacher.school)}
            </motion.div>
            <motion.h1 {...up(0.15)} dir="ltr" style={{ textAlign: 'start' }}>
              {t('heroTitle1')}<br />
              <em>{t('heroTitle2')}</em>
            </motion.h1>
            <motion.p className="hero-by" {...up(0.24)}>
              {t('preparedBy')} <strong>{tx(teacher.name)}</strong> · {tx(teacher.title)}
            </motion.p>
            <motion.p className="lead" {...up(0.3)}>{tx(teacher.intro)}</motion.p>
            <motion.div className="hero-cta" {...up(0.42)}>
              <Link to="/classes" className="btn">{t('exploreClasses')} <Arrow className="arrow" /></Link>
              <Link to="/about" className="btn ghost">{t('aboutTeacher')}</Link>
            </motion.div>
            <motion.div className="hero-meta" {...up(0.55)}>
              <div><strong>{grades.length}</strong><span>{t('gradesTaught')}</span></div>
              <div><strong>{teacher.yearsTeaching}</strong><span>{t('yearsTeaching')}</span></div>
              <div><strong>{total}+</strong><span>{t('materialsOnline')}</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 'clamp(40px, 6vw, 72px)', paddingBottom: 'clamp(48px, 7vw, 96px)' }}>
        <Reveal>
          <div className="stats">
            <div className="stat"><span className="value">{grades.length}</span><span className="label">{t('grades')}</span><span className="sub">{grades.map((g) => g.number).join(' · ')}</span></div>
            <div className="stat"><span className="value">{t('english')}</span><span className="label">{t('subject')}</span><span className="sub">{book.title}</span></div>
            <div className="stat"><span className="value">{total}+</span><span className="label">{t('resourcesLabel')}</span><span className="sub">{t('growing')}</span></div>
            <div className="stat"><span className="value">{teacher.yearsTeaching}</span><span className="label">{t('yearsTeaching')}</span><span className="sub">{tx(teacher.school)}</span></div>
          </div>
        </Reveal>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <h2>{t('pickClass')}</h2>
          <p>{t('pickClassSub')}</p>
        </Reveal>
        <GradeGrid />
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="intro-band">
          <Reveal className="intro-quote">
            <p>{t('quote')}</p>
            <div className="iq-by"><span className="av">E</span><span>{tx(teacher.name)} · {tx(teacher.school)}</span></div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2>{t('whatInside')}</h2>
            <p className="muted" style={{ marginTop: 12 }}>{t('whatInsideSub')}</p>
            <div className="feature-list">
              {[
                { i: BookOpen, t: 'f2', s: 'f2s' },
                { i: ClipboardCheck, t: 'f1', s: 'f1s' },
                { i: Gamepad2, t: 'f3', s: 'f3s' },
                { i: Clapperboard, t: 'f4', s: 'f4s' },
              ].map(({ i: I, t: k, s }) => (
                <div className="feature" key={k}><span className="f-icon"><I /></span><div><strong>{t(k)}</strong><span>{t(s)}</span></div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'clamp(64px, 9vw, 120px)' }}>
        <Reveal className="cta-band">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSub')}</p>
          <div className="row">
            <Link to="/resources" className="btn"><Search /> {t('searchResources')}</Link>
            <Link to="/classes" className="btn ghost">{t('browseByGrade')}</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
