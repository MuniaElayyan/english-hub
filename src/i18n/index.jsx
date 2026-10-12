import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { strings } from './strings'

const KEY = 'eh-lang'
const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(KEY) || 'en' } catch { return 'en' }
  })

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('lang', lang)
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    try { localStorage.setItem(KEY, lang) } catch {}
  }, [lang])

  const t = useCallback((key) => strings[lang][key] ?? strings.en[key] ?? key, [lang])
  /** Resolve a bilingual field: 'text' | { en, ar } */
  const tx = useCallback((v) => (v && typeof v === 'object' ? (v[lang] ?? v.en ?? '') : v ?? ''), [lang])
  const toggle = useCallback(() => setLang((l) => (l === 'ar' ? 'en' : 'ar')), [])

  const value = useMemo(() => ({ lang, setLang, toggle, t, tx, isAr: lang === 'ar', dir: lang === 'ar' ? 'rtl' : 'ltr', locale: lang === 'ar' ? 'ar-EG' : 'en-GB' }), [lang, t, tx, toggle])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
