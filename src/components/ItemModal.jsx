import { Download, ExternalLink, Youtube, Facebook } from 'lucide-react'
import Modal from './Modal'
import DocxView from './DocxView'
import { useLang } from '../i18n'

const ytEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
const wwEmbed = (url) => {
  const m = url.match(/resource\/(\d+)/)
  return m ? `https://wordwall.net/embed/${m[1]}` : url
}

/** Opens any item: pdf / image / docx / video / audio / youtube / wordwall / game / link. External types get an "open in new tab" button. */
export default function ItemModal({ item, onClose }) {
  const { t, tx } = useLang()
  const it = item
  if (!it) return <Modal open={false} onClose={onClose} />

  const ext = it.url || (it.type === 'youtube' && `https://www.youtube.com/watch?v=${it.youtubeId}`)
  const footer = (
    <>
      {it.type === 'docx' && <a className="btn sm" href={it.downloadUrl || it.file} download><Download /> {t('downloadDocx')}</a>}
      {it.file && it.type !== 'docx' && <a className="btn sm ghost" href={it.file} target="_blank" rel="noopener noreferrer"><ExternalLink /> {t('openNewTab')}</a>}
      {it.file && it.type !== 'docx' && <a className="btn sm" href={it.downloadUrl || it.file} download><Download /> {t('download')}</a>}
      {['link', 'game'].includes(it.type) && <a className="btn sm" href={ext} target="_blank" rel="noopener noreferrer"><ExternalLink /> {t('openNewTab')}</a>}
      {it.preview && <a className="btn sm ghost" href={it.preview} target="_blank" rel="noopener noreferrer"><ExternalLink /> {t('pdfPreview')}</a>}
      {it.type === 'youtube' && <a className="btn sm ghost" href={ext} target="_blank" rel="noopener noreferrer"><Youtube /> {t('openOnYouTube')}</a>}
      {it.type === 'wordwall' && <a className="btn sm ghost" href={ext} target="_blank" rel="noopener noreferrer"><ExternalLink /> {t('openOnWordwall')}</a>}
      {it.type === 'facebook' && <a className="btn sm" href={ext} target="_blank" rel="noopener noreferrer"><Facebook /> {t('openOnFacebook')}</a>}
    </>
  )

  return (
    <Modal open onClose={onClose} title={tx(it.title)} subtitle={tx(it.description)} footer={footer} narrow={it.type === 'facebook'}>
      {it.type === 'image' && <div className="poster-view"><img src={it.file} alt={tx(it.title)} /></div>}
      {(it.type === 'pdf' || (it.type === 'docx' && it.preview)) && (
        <div className="pdf-frame"><iframe src={`${it.type === 'pdf' ? it.file : it.preview}#view=FitH`} title={tx(it.title)} /></div>
      )}
      {it.type === 'docx' && !it.preview && <DocxView src={it.file} />}
      {it.type === 'audio' && <div className="audio-view"><audio src={it.file} controls autoPlay /></div>}
      {(it.type === 'game' || (it.type === 'link' && it.embed)) && <iframe className="game-frame" src={it.embed || it.url} title={tx(it.title)} allow="autoplay; fullscreen" allowFullScreen />}
      {it.type === 'link' && !it.embed && (
        <a className="link-view" href={it.url} target="_blank" rel="noopener noreferrer">
          {it.thumbnail && <img src={it.thumbnail} alt="" />}
          <span dir="ltr">{it.url}</span>
        </a>
      )}
      {it.type === 'video' && (
        <div className="video-player"><video src={it.file} controls autoPlay poster={it.thumbnail || undefined} /></div>
      )}
      {it.type === 'youtube' && (
        <div className="video-player">
          <iframe src={ytEmbed(it.youtubeId)} title={tx(it.title)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}
      {it.type === 'wordwall' && <iframe className="game-frame" src={wwEmbed(it.url)} title={tx(it.title)} allowFullScreen />}
      {it.type === 'facebook' && <p className="muted" style={{ textAlign: 'center', padding: '12px 0' }}>{t('fbNote')}</p>}
    </Modal>
  )
}
