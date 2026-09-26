import { motion, useReducedMotion } from 'framer-motion'
import { siteMeta, teacher } from '../data/site'
import { useLang } from '../i18n'

const ease = [0.22, 1, 0.36, 1]

/** Floating wrapper: entrance + slow idle drift. */
function Float({ children, className, delay = 0, drift = 8, dur = 6, rotate = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      <motion.div
        className="float-inner"
        animate={reduce ? {} : { y: [0, -drift, 0], rotate: [rotate, rotate + 1.5, rotate] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Hero visual: the classroom illustration (siteMeta.heroImage) framed like a
 * pinned photo, with floating lesson cards around it.
 */
export default function HeroVisual() {
  const reduce = useReducedMotion()
  const { t, tx, isAr } = useLang()
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-orb one" />
      <div className="hero-orb two" />

      <motion.div
        className="hero-frame"
        initial={{ opacity: 0, y: 40, rotate: isAr ? 5 : -5, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotate: isAr ? 2.5 : -2.5, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease }}
      >
        <motion.img
          src={siteMeta.heroImage}
          alt=""
          initial={{ scale: 1.08 }}
          animate={reduce ? { scale: 1 } : { scale: [1.04, 1, 1.04] }}
          transition={reduce ? { duration: 1 } : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="hero-frame-caption">
          <span>{tx(teacher.school)}</span>
          <strong>{tx(teacher.name)}{t('heroCaption')}</strong>
        </div>
      </motion.div>

      <Float className="float-card vocab" delay={0.6} drift={10} dur={7}>
        <small>vocabulary · adjective</small>
        <strong>curious</strong>
        <small>eager to learn</small>
      </Float>

      <Float className="float-card bubble" delay={0.8} drift={7} dur={5.5} rotate={-2}>
        <strong>Hello, class!</strong>
      </Float>

      <Float className="float-card grammar" delay={1} drift={6} dur={6.5}>
        <small>They</small>
        <span className="pill">is</span>
        <span className="pill on">are</span>
      </Float>

      <Float className="letter-tile a" delay={1.15} drift={9} dur={8}>A</Float>
      <Float className="letter-tile b" delay={1.3} drift={7} dur={7} rotate={8}>b</Float>
    </div>
  )
}
