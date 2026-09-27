import { motion, useReducedMotion } from 'framer-motion'

/** Scroll-reveal wrapper. Use `delay` for stagger. */
export default function Reveal({ children, delay = 0, y = 22, as = 'div', className, once = true, ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </M>
  )
}

/** Container with staggered children. Wrap items in <Stagger.Item>. */
export function Stagger({ children, className, stagger = 0.08, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}
Stagger.Item = function Item({ children, className, style }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
