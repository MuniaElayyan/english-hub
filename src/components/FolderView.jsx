import { useMemo, useState } from 'react'
import { Play, Maximize2, Download, ExternalLink, FileText, Youtube, Facebook, Gamepad2, Link as LinkIcon, Eye, Plus, Trash2 } from 'lucide-react'
import ItemModal from './ItemModal'
import Reveal, { Stagger } from './Reveal'
import { useLang } from '../i18n'
import { useLibrary } from '../library'

const kindOf = (it) => {
  if (['video', 'youtube', 'facebook'].includes(it.type)) return 'videos'
  if (['wordwall', 'game'].includes(it.type)) return 'games'
  // anything that has a picture gets a picture card
  if (it.type === 'image' || (['pdf', 'docx', 'link'].includes(it.type) && it.thumbnail)) return 'media'
  if (it.type === 'link') return 'links'
  return 'documents'
}
const typeLabel = { pdf: 'PDF', docx: 'DOCX', pptx: 'PPTX', audio: 'AUDIO', file: 'FILE', image: 'IMG', video: 'MP4', youtube: 'YouTube', facebook: 'Facebook', wordwall: 'Wordwall', game: 'Game', link: 'Link' }

const Section = ({ title, children }) => (
  <section className="fv-section">
    <Reveal as="h2" className="fv-title">{title}</Reveal>
    {children}
  </section>
)

/** Renders a folder's items grouped by kind. `onAdd` (teacher mode) adds a "+" tile to every group. */
export default function FolderView({ items, onAdd }) {
  const { t, tx } = useLang()
  const { isTeacher, remove } = useLibrary()
  const [open, setOpen] = useState(null)

  // Teacher mode: a bin on every card she added herself (built-in material lives in the code).
  const Bin = ({ item }) => (isTeacher && item.added ? (
    <button
      className="card-bin" aria-label={t('delete')} title={t('delete')}
      onClick={async (e) => {
        e.preventDefault(); e.stopPropagation()
        if (!window.confirm(`${t('confirmDelete')}\n\n${tx(item.title)}`)) return
        try { await remove(item.record) } catch (er) { window.alert(`${t('deleteFailed')} ${er.message || ''}`) }
      }}
    ><Trash2 /></button>
  ) : null)
  const AddTile = ({ wide }) => (isTeacher && onAdd ? (
    <button className={`add-tile ${wide ? 'wide' : ''}`} onClick={onAdd}><span className="at-plus"><Plus /></span>{t('addMaterial')}</button>
  ) : null)
  const groups = useMemo(() => {
    const g = { media: [], documents: [], videos: [], games: [], links: [] }
    items.forEach((it) => g[kindOf(it)].push(it))
    return g
  }, [items])

  // single PDF book → reader layout
  if (items.length === 1 && items[0].type === 'pdf' && !items[0].added) {
    const b = items[0]
    return (
      <div className="book-layout">
        <Reveal className="book-card">
          {b.thumbnail ? (
            <div className="book-cover-img"><img src={b.thumbnail} alt="" /></div>
          ) : (
            <div className="book-cover"><div className="bc-title">{tx(b.title)}</div></div>
          )}
          <div className="book-info">
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', lineHeight: 1.2 }}>{tx(b.title)}</strong>
            <div className="bi-row"><span>{t('format')}</span><strong>PDF</strong></div>
            {b.pages && <div className="bi-row"><span>{t('pages')}</span><strong>{b.pages}</strong></div>}
            <a className="btn" href={b.file} target="_blank" rel="noopener noreferrer"><ExternalLink /> {t('openNewTab')}</a>
            <a className="btn ghost" href={b.file} download><Download /> {t('download')}</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="pdf-frame"><iframe src={`${b.file}#view=FitH`} title={tx(b.title)} /></div>
        </Reveal>
      </div>
    )
  }

  return (
    <>
      {groups.media.length > 0 && (
        <Section title={t('media')}>
          <Stagger className="poster-grid" stagger={0.06} key={`${groups.media.length}-${isTeacher}`}>
            {groups.media.map((p) => (
              <Stagger.Item key={p.id} className="card-shell">
                <Bin item={p} />
                <button className={`poster-card ${p.added ? 'fit' : ''}`} onClick={() => setOpen(p)} aria-label={tx(p.title)}>
                  <img src={p.thumbnail || p.file} alt={tx(p.title)} loading="lazy" />
                  <span className="pc-zoom"><Maximize2 /></span>
                  <div className="pc-body">
                    <strong>{tx(p.title)}</strong>
                    <span className="filetype">{typeLabel[p.type]}</span>
                  </div>
                </button>
              </Stagger.Item>
            ))}
            {isTeacher && onAdd && <Stagger.Item key="add"><AddTile /></Stagger.Item>}
          </Stagger>
        </Section>
      )}

      {groups.videos.length > 0 && (
        <Section title={t('videos')}>
          <Stagger className="video-grid" stagger={0.06} key={`${groups.videos.length}-${isTeacher}`}>
            {groups.videos.map((v) => {
              const external = v.type === 'facebook'
              const thumb = v.thumbnail || (v.type === 'youtube' ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : null)
              const Card = external ? 'a' : 'button'
              const props = external ? { href: v.url, target: '_blank', rel: 'noopener noreferrer' } : { onClick: () => setOpen(v) }
              return (
                <Stagger.Item key={v.id} className="card-shell">
                  <Bin item={v} />
                  <Card className="video-card" {...props}>
                    <div className={`video-thumb ${v.type}`}>
                      {thumb ? <img src={thumb} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} /> : <span className="vt-deco" />}
                      <span className="vt-play">{external ? <ExternalLink /> : <Play />}</span>
                      {v.duration && <span className="vt-dur">{v.duration}</span>}
                    </div>
                    <div className="video-body">
                      <h3>{tx(v.title)}</h3>
                      <div className="vb-meta">
                        <span className="tag">{v.type === 'youtube' ? <Youtube /> : v.type === 'facebook' ? <Facebook /> : <Play />} {v.type === 'youtube' ? t('youtube') : v.type === 'facebook' ? t('facebook') : t('localVideo')}</span>
                        {external && <span className="tag">{t('newTab')}</span>}
                      </div>
                    </div>
                  </Card>
                </Stagger.Item>
              )
            })}
            {isTeacher && onAdd && <Stagger.Item key="add"><AddTile /></Stagger.Item>}
          </Stagger>
        </Section>
      )}

      {groups.games.length > 0 && (
        <Section title={t('games')}>
          <Stagger className="game-grid" stagger={0.06} key={`${groups.games.length}-${isTeacher}`}>
            {groups.games.map((g) => (
              <Stagger.Item key={g.id} className="card-shell">
                <Bin item={g} />
                <div className={`game-card ${g.thumbnail ? 'has-thumb' : ''}`} data-cat="Vocabulary">
                  {g.thumbnail && <button className="g-thumb" onClick={() => setOpen(g)} aria-label={tx(g.title)}><img src={g.thumbnail} alt="" loading="lazy" /></button>}
                  {!g.thumbnail && <Gamepad2 className="g-shape" />}
                  <span className="g-cat">{typeLabel[g.type]}</span>
                  <h3>{tx(g.title)}</h3>
                  <p>{tx(g.description)}</p>
                  <div className="g-actions">
                    <button className="btn sm" onClick={() => setOpen(g)}><Play /> {t('playHere')}</button>
                    {g.url && <a className="btn sm ghost" href={g.url} target="_blank" rel="noopener noreferrer"><ExternalLink /> {g.type === 'wordwall' ? t('openOnWordwall') : t('openNewTab')}</a>}
                  </div>
                </div>
              </Stagger.Item>
            ))}
            {isTeacher && onAdd && <Stagger.Item key="add"><AddTile /></Stagger.Item>}
          </Stagger>
        </Section>
      )}

      {groups.documents.length > 0 && (
        <Section title={t('documents')}>
          <Stagger className="res-list" stagger={0.05} key={groups.documents.length}>
            {groups.documents.map((d) => (
              <Stagger.Item key={d.id} className="card-shell row">
                <Bin item={d} />
                <article className="res-row">
                  <span className="filetype">{typeLabel[d.type] || d.type?.toUpperCase()}</span>
                  <div className="rr-main">
                    <div className="rr-title">{tx(d.title)}</div>
                    {d.description && <div className="rr-meta"><span className="tag"><FileText /> {tx(d.description)}</span></div>}
                  </div>
                  <div className="rr-actions">
                    {(['pdf', 'audio'].includes(d.type) || d.preview || (d.type === 'docx' && d.added)) && <button className="btn sm soft" onClick={() => setOpen(d)}><Eye /> {t('preview')}</button>}
                    {d.file && <a className="btn sm ghost" href={d.downloadUrl || d.file} download><Download /> {t('download')}</a>}
                  </div>
                </article>
              </Stagger.Item>
            ))}
          </Stagger>
        </Section>
      )}

      {groups.links.length > 0 && (
        <Section title={t('links')}>
          <Stagger className="res-list" stagger={0.05} key={groups.links.length}>
            {groups.links.map((l) => (
              <Stagger.Item key={l.id} className="card-shell row">
                <Bin item={l} />
                <a className="res-row" href={l.url} target="_blank" rel="noopener noreferrer">
                  <span className="filetype"><LinkIcon style={{ width: 14 }} /></span>
                  <div className="rr-main">
                    <div className="rr-title">{tx(l.title)}</div>
                    <div className="rr-meta"><span className="tag" dir="ltr">{l.url}</span></div>
                  </div>
                  <div className="rr-actions"><span className="btn sm soft"><ExternalLink /> {t('openLink')}</span></div>
                </a>
              </Stagger.Item>
            ))}
          </Stagger>
        </Section>
      )}

      {isTeacher && onAdd && (groups.documents.length > 0 || groups.links.length > 0) && !(groups.media.length || groups.videos.length || groups.games.length) && (
        <div style={{ marginTop: 18 }}><AddTile wide /></div>
      )}

      {open && <ItemModal item={open} onClose={() => setOpen(null)} />}
    </>
  )
}
