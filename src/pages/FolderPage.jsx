import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Plus, FolderPlus, Trash2 } from 'lucide-react'
import Reveal, { Stagger } from '../components/Reveal'
import Icon from '../components/Icon'
import FolderCard from '../components/FolderCard'
import FolderView from '../components/FolderView'
import EmptyState from '../components/EmptyState'
import NotFound from './NotFound'
import AddItemModal from '../components/AddItemModal'
import AddFolderModal from '../components/AddFolderModal'
import { resolvePath, countItems } from '../data/resources'
import { useLibrary, folderKey } from '../library'
import { useLang } from '../i18n'

/** Renders any node of a grade's folder tree: /classes/:gradeId/<path...> */
export default function FolderPage() {
  const { gradeId, '*': splat } = useParams()
  const { t, tx, isAr } = useLang()
  const { getGrade, isTeacher, ready, remove } = useLibrary()
  const [adding, setAdding] = useState(null) // 'item' | 'folder'
  const grade = getGrade(gradeId)
  const segments = (splat || '').split('/').filter(Boolean)
  const resolved = grade && resolvePath(grade, segments)
  // a folder the teacher created only exists once the library has loaded
  if (grade && !resolved && !ready) return <div className="container" style={{ minHeight: '60vh' }} />
  if (!grade || !resolved) return <NotFound />

  const { node, trail } = resolved
  const isRoot = node === grade
  const Chevron = isAr ? ChevronLeft : ChevronRight
  const Back = isAr ? ArrowRight : ArrowLeft
  const pathTo = (i) => `/classes/${grade.id}${trail.slice(1, i + 1).map((n) => `/${n.id}`).join('')}`
  const parentTo = pathTo(trail.length - 2)
  const children = node.children || []
  const items = node.items || []
  const key = folderKey(grade.id, segments)
  // wording + default tab of the "add" dialog follow the kind of folder
  const kind = ['Clapperboard', 'Youtube', 'Video'].includes(node.icon) ? 'videos' : ['Gamepad2', 'Puzzle'].includes(node.icon) ? 'games' : 'docs'
  const removeFolder = async (c) => {
    if (!window.confirm(`${t('confirmDelete')}\n\n${tx(c.name)}`)) return
    try { await remove(c.record) } catch (er) { window.alert(`${t('deleteFailed')} ${er.message || ''}`) }
  }

  // FolderView already ends its card grids with an "add material" tile — except the single-book reader layout
  const itemsHaveTile = items.length > 0 && !(items.length === 1 && items[0].type === 'pdf' && !items[0].added)
  const folderGrid = (
    <Stagger className="cat-grid" stagger={0.06} key={`${node.id}-${children.length}-${isTeacher}`}>
            {children.map((c) => (
              <Stagger.Item key={c.id} className="card-shell">
                {isTeacher && c.added && !c.children.length && !c.items.length && (
                  <button className="card-bin" aria-label={t('delete')} title={t('delete')} onClick={() => removeFolder(c)}><Trash2 /></button>
                )}
                <FolderCard node={c} to={`${isRoot ? `/classes/${grade.id}` : pathTo(trail.length - 1)}/${c.id}`} />
              </Stagger.Item>
            ))}
            {isTeacher && (
              <Stagger.Item key="add-folder">
                <button className="add-tile" onClick={() => setAdding('folder')}><span className="at-plus"><FolderPlus /></span>{t('addFolder')}</button>
              </Stagger.Item>
            )}
            {isTeacher && !itemsHaveTile && (
              <Stagger.Item key="add-item">
                <button className="add-tile" onClick={() => setAdding('item')}><span className="at-plus"><Plus /></span>{t('addMaterial')}</button>
              </Stagger.Item>
            )}
          </Stagger>
  )

  return (
    <>
      <div className="page-head">
        {isRoot && <div className="grade-head-num" aria-hidden="true">{grade.number}</div>}
        <div className="container">
          <Reveal>
            <div className="crumbs">
              <Link to="/classes">{t('classes')}</Link>
              {trail.map((n, i) => (
                <span key={n.id + i} style={{ display: 'contents' }}>
                  <Chevron />
                  {i === trail.length - 1 ? <span>{tx(n.name)}</span> : <Link to={pathTo(i)}>{tx(n.name)}</Link>}
                </span>
              ))}
            </div>
            <div className="head-row">
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                {!isRoot && <span className="cat-icon head-icon"><Icon name={node.icon} /></span>}
                <div>
                  <h1>{tx(node.name)}</h1>
                  {isRoot && <p className="lead hub-sub">{t('learningHub')}</p>}
                  <p className="lead">{tx(node.description)}</p>
                </div>
              </div>
              <div className="head-actions">
                {isTeacher && <button className="btn sm" onClick={() => setAdding('item')}><Plus /> {t('addMaterial')}</button>}
                {isTeacher && <button className="btn sm soft" onClick={() => setAdding('folder')}><FolderPlus /> {t('addFolder')}</button>}
                {!isRoot && <Link to={parentTo} className="btn sm ghost"><Back /> {tx(trail[trail.length - 2].name)}</Link>}
              </div>
            </div>
            {isRoot && (
              <div className="unit-strip">
                <span className="chip outline">{countItems(grade)} {t('files')}</span>
                <span className="chip outline">{t('subject')}: {t('english')}</span>
              </div>
            )}
          </Reveal>
        </div>
      </div>

      <section className="container" style={{ paddingBottom: 'clamp(48px, 7vw, 96px)' }}>
        {children.length > 0 && folderGrid}
        {items.length > 0 && <div style={{ marginTop: children.length ? 40 : 0 }}><FolderView items={items} onAdd={() => setAdding('item')} /></div>}
        {children.length === 0 && isTeacher && <div style={{ marginTop: items.length ? 40 : 0 }}>{folderGrid}</div>}
        {!children.length && !items.length && !isTeacher && (
          <EmptyState folder={isTeacher ? undefined : `/public/resources/${grade.id}/${segments.join('/')}/`} text={isTeacher ? t('emptyTeacherSub') : undefined}>
            {isTeacher && (
              <div className="row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                <button className="btn" onClick={() => setAdding('item')}><Plus /> {t('addMaterial')}</button>
                <button className="btn ghost" onClick={() => setAdding('folder')}><FolderPlus /> {t('addFolder')}</button>
              </div>
            )}
          </EmptyState>
        )}

        <AddItemModal open={adding === 'item'} onClose={() => setAdding(null)} folderKey={key} folderName={tx(node.name)} kind={kind} />
        <AddFolderModal open={adding === 'folder'} onClose={() => setAdding(null)} parentKey={key} siblings={children} />
      </section>
    </>
  )
}
