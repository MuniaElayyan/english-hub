import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, SearchX } from 'lucide-react'
import Reveal, { Stagger } from '../components/Reveal'
import SearchToolbar from '../components/SearchToolbar'
import Icon from '../components/Icon'
import EmptyState from '../components/EmptyState'
import { useLibrary } from '../library'
import { useLang } from '../i18n'

const typeLabel = { audio: 'AUDIO', file: 'FILE', game: 'Game', pdf: 'PDF', docx: 'DOCX', image: 'IMG', video: 'MP4', youtube: 'YouTube', facebook: 'Facebook', wordwall: 'Wordwall', link: 'Link' }
const kinds = [
  { value: 'books', types: ['pdf', 'docx', 'file', 'audio'], en: 'Documents', ar: 'مستندات' },
  { value: 'media', types: ['image'], en: 'Posters', ar: 'بوسترات' },
  { value: 'videos', types: ['video', 'youtube', 'facebook'], en: 'Videos', ar: 'فيديوهات' },
  { value: 'games', types: ['wordwall', 'game'], en: 'Games', ar: 'ألعاب' },
]

export default function Resources() {
  const { t, tx, lang, isAr } = useLang()
  const { grades, allItems } = useLibrary()
  const [q, setQ] = useState('')
  const [grade, setGrade] = useState('all')
  const [kind, setKind] = useState('all')
  const Chevron = isAr ? ChevronLeft : ChevronRight

  const all = useMemo(() => allItems(), [grades]) // eslint-disable-line react-hooks/exhaustive-deps
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    const k = kinds.find((x) => x.value === kind)
    return all.filter((r) =>
      (grade === 'all' || r.gradeId === grade) &&
      (!k || k.types.includes(r.type)) &&
      (!s || [r.title?.en, r.title?.ar, r.description?.en, r.description?.ar, ...r.trail.flatMap((n) => [n.name?.en, n.name?.ar])].filter(Boolean).join(' ').toLowerCase().includes(s)),
    )
  }, [all, q, grade, kind])

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Reveal>
            <h1>{t('searchTitle')}</h1>
            <p className="lead">{t('searchSub')}</p>
          </Reveal>
        </div>
      </div>
      <section className="container" style={{ paddingBottom: 'clamp(64px, 9vw, 120px)' }}>
        <SearchToolbar
          query={q} onQuery={setQ}
          filters={[
            { key: 'g', label: t('grade'), options: grades.map((g) => ({ value: g.id, label: tx(g.name) })), value: grade, onChange: setGrade },
            { key: 'k', label: t('resources'), options: kinds.map((k) => ({ value: k.value, label: k[lang] })), value: kind, onChange: setKind },
          ]}
          count={results.length}
        />
        {results.length ? (
          <Stagger className="res-list" stagger={0.03} key={`${q}-${grade}-${kind}`}>
            {results.map((r) => {
              const folder = r.trail[r.trail.length - 1]
              const to = `/classes/${r.gradeId}${r.path.map((p) => `/${p}`).join('')}`
              return (
                <Stagger.Item key={`${r.gradeId}-${r.id}`}>
                  <Link to={to} className="res-hit">
                    <span className="rh-icon"><Icon name={folder?.icon} /></span>
                    <div>
                      <strong>{tx(r.title)}</strong>
                      <div className="rh-meta">
                        <span>{tx(r.gradeName)}</span>
                        {r.trail.map((n, i) => <span key={i}>{tx(n.name)}</span>)}
                      </div>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="filetype">{typeLabel[r.type] || r.type}</span>
                      <Chevron style={{ width: 18, color: 'var(--muted)' }} />
                    </span>
                  </Link>
                </Stagger.Item>
              )
            })}
          </Stagger>
        ) : (
          <EmptyState icon={SearchX} title={t('nothingFound')} text={t('nothingFoundSub')} />
        )}
      </section>
    </>
  )
}
