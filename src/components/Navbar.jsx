import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Sun, Moon, ArrowUpRight, ArrowUpLeft, Languages, LogOut, KeyRound } from 'lucide-react'
import TeacherLogin from './TeacherLogin'
import { useLibrary } from '../library'
import { nav, teacher } from '../data/site'
import { useTheme } from '../hooks/useTheme'
import { useLang } from '../i18n'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [overHero, setOverHero] = useState(false)
  const [open, setOpen] = useState(false)
  const { isDark, toggle } = useTheme()
  const { t, tx, isAr, toggle: toggleLang } = useLang()
  const { pathname } = useLocation()
  const { isTeacher, logout, grades } = useLibrary()
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    // `overHero` = the bar is currently sitting on top of the home-page video,
    // so it goes fully transparent with white text.
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      const hero = pathname === '/' ? document.querySelector('.hero') : null
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > navH)
    }
    onScroll()
    const raf = requestAnimationFrame(onScroll) // the new page mounts a tick after the route changes
    const late = setTimeout(onScroll, 450)      // …and after the page transition has finished
    const main = document.getElementById('main')
    const mo = main ? new MutationObserver(onScroll) : null
    mo?.observe(main, { childList: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf); clearTimeout(late); mo?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))
  const Arrow = isAr ? ArrowUpLeft : ArrowUpRight
  // knob slides towards the "end" side in both directions
  const knobX = isDark ? (isAr ? -28 : 28) : 0

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''} ${overHero && !open ? 'over-hero' : ''} ${open ? 'menu-open' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" aria-label={t('brand')}>
            <span className="brand-mark">E</span>
            <span className="brand-text">
              <strong>{t('brand')}</strong>
              <span>{tx(teacher.name)}</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={`nav-link ${isActive(n.to) ? 'active' : ''}`} end={n.to === '/'}>
                {t(n.key)}
                {isActive(n.to) && <motion.span layoutId="nav-underline" className="underline" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            {isTeacher && (
              <button className="teacher-pill" onClick={logout} title={t('signOut')}>
                <span className="tp-dot" /> <span className="tp-label">{t('teacherMode')}</span> <LogOut />
              </button>
            )}
            <button className="lang-toggle" onClick={toggleLang} aria-label={t('switchLang')} title={t('switchLang')}>
              <Languages /> <span>{t('switchLang')}</span>
            </button>
            <button className="theme-toggle" onClick={toggle} aria-label={t('switchTheme')} aria-pressed={isDark}>
              <motion.span className="knob" animate={{ x: knobX }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                {isDark ? <Moon /> : <Sun />}
              </motion.span>
            </button>
            <button className="icon-btn menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t('menu')}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {nav.map((n, i) => (
              <motion.div key={n.to} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                <NavLink to={n.to} className={`mm-link ${isActive(n.to) ? 'active' : ''}`} end={n.to === '/'}>
                  {t(n.key)} <Arrow size={22} />
                </NavLink>
              </motion.div>
            ))}
            <button className="mm-teacher" onClick={() => { setOpen(false); isTeacher ? logout() : setLoginOpen(true) }}>
              {isTeacher ? <><LogOut /> {t('signOut')}</> : <><KeyRound /> {t('teacherLogin')}</>}
            </button>
            <div className="mm-grades">
              {grades.map((g) => (
                <Link key={g.id} to={`/classes/${g.id}`} className="chip outline">{tx(g.name)}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <TeacherLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
