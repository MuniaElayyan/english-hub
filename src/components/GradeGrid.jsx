import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import GradeCard from './GradeCard'
import AddGradeModal from './AddGradeModal'
import { Stagger } from './Reveal'
import { useLang } from '../i18n'
import { useLibrary } from '../library'

/** The grade cards + (teacher mode) an "add grade" card. Used on Home and Classes. */
export default function GradeGrid() {
  const { t, tx } = useLang()
  const { grades, isTeacher, remove } = useLibrary()
  const [adding, setAdding] = useState(false)

  const del = async (g) => {
    if (!window.confirm(`${t('confirmDelete')}\n\n${tx(g.name)}`)) return
    try { await remove(g.record) } catch (er) { window.alert(`${t('deleteFailed')} ${er.message || ''}`) }
  }

  return (
    <>
      <Stagger className="grade-grid" stagger={0.12} key={`${grades.length}-${isTeacher}`}>
        {grades.map((g) => (
          <Stagger.Item key={g.id} className="card-shell">
            {isTeacher && g.added && !g.children.length && !g.items.length && (
              <button className="card-bin" aria-label={t('delete')} title={t('delete')} onClick={() => del(g)}><Trash2 /></button>
            )}
            <GradeCard grade={g} />
          </Stagger.Item>
        ))}
        {isTeacher && (
          <Stagger.Item key="add">
            <button className="add-tile tall" onClick={() => setAdding(true)}><span className="at-plus"><Plus /></span>{t('addGrade')}</button>
          </Stagger.Item>
        )}
      </Stagger>
      <AddGradeModal open={adding} onClose={() => setAdding(false)} />
    </>
  )
}
