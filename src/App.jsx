import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'

import ReviewGenerator from './components/ReviewGenerator'
import Gallery from './components/Gallery'
import ThreeDSpace from './components/ThreeDSpace'
import VirtualHost from './components/VirtualHost'
import SkillsPlayground from './components/SkillsPlayground'
import Contact from './components/Contact'

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-3">
      <div className="h-px w-12 bg-black/[0.03] rounded-full" />
    </div>
  )
}

export default function App() {
  const [bgTint, setBgTint] = useState('#f5f5f7')

  const handleTagClick = useCallback((color) => {
    setBgTint(color)
    setTimeout(() => setBgTint('#f5f5f7'), 1200)
  }, [])

  return (
    <div className="relative">
      {/* Dynamic background tint */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{ backgroundColor: bgTint }}
        transition={{ duration: 0.6 }}
      />

      {/* Subtle grain-like gradient overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(6,182,212,0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Sections */}
      <Hero onTagClick={handleTagClick} />
      <SectionDivider />
      <ReviewGenerator />
      <SectionDivider />
      <Gallery />
      <SectionDivider />
      <ThreeDSpace />
      <SectionDivider />
      <VirtualHost />
      <SectionDivider />
      <SkillsPlayground />
      <SectionDivider />
      <Contact />
    </div>
  )
}
