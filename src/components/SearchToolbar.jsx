import { Search } from 'lucide-react'
import { useLang } from '../i18n'

/** Search box + chip filters. filters: [{ key, label, options:[{value,label}], value, onChange }] */
export default function SearchToolbar({ query, onQuery, filters = [], count, placeholder }) {
  const { t } = useLang()
  return (
    <div className="toolbar">
      <label className="search">
        <span className="sr-only">{t('search')}</span>
        <Search />
        <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder={placeholder || t('searchPlaceholder')} />
      </label>
      {filters.map((f) => (
        <div className="filter-group" key={f.key} role="group" aria-label={f.label}>
          <button className={`chip ${f.value === 'all' ? 'active' : 'outline'}`} onClick={() => f.onChange('all')}>{t('all')}</button>
          {f.options.map((o) => (
            <button key={o.value} className={`chip ${f.value === o.value ? 'active' : 'outline'}`} onClick={() => f.onChange(o.value)}>{o.label}</button>
          ))}
        </div>
      ))}
      {typeof count === 'number' && <span className="result-count">{count} {count === 1 ? t('result') : t('results')}</span>}
    </div>
  )
}
