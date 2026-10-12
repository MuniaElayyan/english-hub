import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, LogOut } from 'lucide-react'
import TeacherLogin from './TeacherLogin'
import { useLibrary } from '../library'
import { teacher, siteMeta } from '../data/site'
import { useLang } from '../i18n'

export default function Footer() {
  const { t, tx } = useLang()
  const { isTeacher, logout, grades } = useLibrary()
  const [loginOpen, setLoginOpen] = useState(false)
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand">
              <span className="brand-mark">E</span>
              <span className="brand-text">
                <strong>{tx(teacher.name)}</strong>
                <span>{tx(teacher.school)}</span>
              </span>
            </Link>
            <p className="f-desc">{t('footerDesc')}</p>
          </div>
          <div>
            <h4>{t('classes')}</h4>
            <ul>
              {grades.map((g) => (
                <li key={g.id}><Link to={`/classes/${g.id}`}>{tx(g.name)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t('quickLinks')}</h4>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/classes">{t('classes')}</Link></li>
              <li><Link to="/resources">{t('searchResources')}</Link></li>
              <li><Link to="/about">{t('aboutTeacher')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {siteMeta.year} {tx(teacher.name)} · {tx(teacher.school)} · {t('allRights')}</span>
          <span>{t('tagline')}</span>
          <button className="footer-teacher" onClick={() => (isTeacher ? logout() : setLoginOpen(true))}>
            {isTeacher ? <><LogOut /> {t('signOut')}</> : <><KeyRound /> {t('teacherLogin')}</>}
          </button>
        </div>
      </div>
      <TeacherLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
    </footer>
  )
}
