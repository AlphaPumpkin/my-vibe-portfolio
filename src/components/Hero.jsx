import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const TEXTS = [
  'UI/UX 设计师',
  '视觉创意人',
  '建筑与城规探索者',
  '3D 与游戏爱好者',
  'Vibe Coding 玩家',
]

const TAGS = [
  { label: '🎨 平面设计', color: '#6366f1' },
  { label: '🎮 3D环境艺术', color: '#0ea5e9' },
  { label: '📷 业余摄影', color: '#10b981' },
  { label: '👩 ENTJ', color: '#8b5cf6' },
  { label: '🔋 高能量人群', color: '#f59e0b' },
]

function Typewriter({ texts, className = '' }) {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    let delay

    if (!deleting && charIndex < current.length) {
      delay = setTimeout(() => setCharIndex(charIndex + 1), 100)
    } else if (!deleting && charIndex === current.length) {
      delay = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex > 0) {
      delay = setTimeout(() => setCharIndex(charIndex - 1), 50)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setTextIndex((textIndex + 1) % texts.length)
    }

    return () => clearTimeout(delay)
  }, [charIndex, deleting, textIndex])

  return (
    <span className={className}>
      {texts[textIndex].slice(0, charIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[1em] bg-indigo-400 ml-1 align-middle"
      />
    </span>
  )
}

function MagneticAvatar() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })
  const rotateX = useTransform(springY, [-50, 50], [10, -10])
  const rotateY = useTransform(springX, [-50, 50], [-10, 10])

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set(e.clientX - cx)
    y.set(e.clientY - cy)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ x: springX, y: springY, rotateX, rotateY }}
      className="relative w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer z-10"
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-200 via-sky-200 to-rose-200 blur-sm opacity-60" />
      <div className="absolute inset-[3px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
        <img src="/images/avatar.jpg" alt="徐楠的头像" className="w-full h-full object-cover" />
      </div>
    </motion.div>
  )
}

export default function Hero({ onTagClick }) {
  const [hoveredTag, setHoveredTag] = useState(null)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Magnetic Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <MagneticAvatar />
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-center"
      >
        <span className="text-accent">Hi, 我是 </span>
        <span className="text-slate-800">徐楠</span>
      </motion.h1>

      {/* Typewriter subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-4 text-lg md:text-xl text-slate-400 font-light h-8"
      >
        <Typewriter texts={TEXTS} className="font-mono" />
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-6 max-w-lg text-center text-slate-400 text-sm md:text-base leading-relaxed"
      >
        用设计语言讲述品牌故事，以代码编织数字体验。
        热衷于探索视觉与交互的边界。
      </motion.p>

      {/* Interest Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-10 flex flex-wrap gap-2.5 justify-center max-w-lg"
      >
        {TAGS.map((tag) => (
          <motion.button
            key={tag.label}
            onClick={() => onTagClick?.(tag.color)}
            onMouseEnter={() => setHoveredTag(tag.label)}
            onMouseLeave={() => setHoveredTag(null)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              background: hoveredTag === tag.label ? `${tag.color}12` : '#f1f5f9',
              border: `1px solid ${hoveredTag === tag.label ? tag.color + '30' : '#e2e8f0'}`,
              color: hoveredTag === tag.label ? tag.color : '#64748b',
            }}
          >
            {tag.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-300 tracking-[0.3em] uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-indigo-300 to-transparent"
        />
      </motion.div>
    </section>
  )
}
