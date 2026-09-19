import { motion, useReducedMotion } from 'framer-motion'

export default function PageTransition({ children }) {
  const reduce = useReducedMotion()
  const v = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -8, filter: 'blur(3px)' },
      }
  return (
    <motion.div {...v} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
