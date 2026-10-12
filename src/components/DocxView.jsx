import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useLang } from '../i18n'

/** Shows a Word document inside the site (docx-preview renders it to HTML in the browser). */
export default function DocxView({ src }) {
  const { t } = useLang()
  const host = useRef(null)
  const [state, setState] = useState('loading')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [{ renderAsync }, blob] = await Promise.all([import('docx-preview'), fetch(src).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob() })])
        if (!alive || !host.current) return
        await renderAsync(blob, host.current, undefined, { inWrapper: true, ignoreLastRenderedPageBreak: false, useBase64URL: true })
        if (alive) setState('ready')
      } catch (e) { console.warn('[docx]', e); if (alive) setState('error') }
    })()
    return () => { alive = false }
  }, [src])

  return (
    <div className="docx-frame">
      {state === 'loading' && <p className="tp-state"><Loader2 className="spin" /> {t('readingSource')}</p>}
      {state === 'error' && <p className="muted" style={{ padding: 24, textAlign: 'center' }}>{t('docxError')}</p>}
      <div ref={host} className="docx-host" dir="ltr" />
    </div>
  )
}
