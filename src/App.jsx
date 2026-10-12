import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Classes from './pages/Classes'
import FolderPage from './pages/FolderPage'
import About from './pages/About'
import Resources from './pages/Resources'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/classes" element={<PageTransition><Classes /></PageTransition>} />
            <Route path="/classes/:gradeId/*" element={<PageTransition><FolderPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
