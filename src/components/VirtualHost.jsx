import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, Users, Star, DollarSign, ExternalLink, ThumbsUp, Sparkles } from 'lucide-react'

const B = import.meta.env.BASE_URL

const STATS = [
  { label: '累计赞藏', value: 92.3, suffix: 'K+', icon: Heart, iconKey: 'heart', color: '#ec4899' },
  { label: '账号粉丝', value: 7500, suffix: '+', icon: Users, iconKey: 'users', color: '#6366f1' },
  { label: '单篇最高点赞', value: 3.6, suffix: 'W+', icon: Star, iconKey: 'star', color: '#f59e0b' },
  { label: '累计店铺 GMV', value: 20, suffix: 'W+', icon: DollarSign, iconKey: 'dollar', color: '#10b981' },
]

const PANELS = [
  {
    key: 'profile',
    src: B + 'images/xiaohongshu/xhs-profile.jpg',
    label: '账号主页',
    alt: '小红书主页截图',
    type: 'profile',
  },
  {
    key: 'shop',
    src: B + 'images/xiaohongshu/xhs-shop.jpg',
    label: '店铺页面',
    alt: '小红书店铺截图',
    type: 'shop',
  },
  {
    key: 'notes',
    src: B + 'images/xiaohongshu/xhs-note.jpg',
    label: '热门笔记',
    alt: '小红书热门笔记截图',
    type: 'notes',
  },
]

/* ---------- Icon animation presets ---------- */
const iconAnimations = {
  heart: {
    animate: { scale: [1, 1.25, 1, 1.15, 1] },
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
  },
  users: {
    animate: { y: [0, -5, 0, -3, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
  star: {
    animate: { rotate: [0, -12, 12, -8, 0], scale: [1, 1.08, 1, 1.05, 1] },
    transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
  },
  dollar: {
    animate: { rotateY: [0, 180, 360] },
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

/* ---------- Animated Stat (with hover glow, icon animation, click easter egg) ---------- */
function AnimatedStat({ stat, delay }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [floatHearts, setFloatHearts] = useState([])

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const steps = 60
    const increment = stat.value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      if (step >= steps) { setDisplayValue(stat.value); clearInterval(timer) }
      else { setDisplayValue(Math.round(increment * step * 10) / 10) }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, stat.value])

  const formatted = stat.value % 1 !== 0
    ? displayValue.toFixed(1)
    : Math.floor(displayValue).toLocaleString()

  const anim = iconAnimations[stat.iconKey]

  const handleClick = useCallback((e) => {
    if (stat.iconKey === 'dollar') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#fcd34d', '#fff7ed'],
        startVelocity: 45,
      })
    }
    if (stat.iconKey === 'heart') {
      const rect = e.currentTarget.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const spawns = []
      for (let i = 0; i < 7; i++) {
        const id = Date.now() + i + Math.random()
        spawns.push({
          id,
          x: cx + (Math.random() - 0.5) * 80,
          y: cy + (Math.random() - 0.5) * 40,
        })
      }
      setFloatHearts((prev) => [...prev, ...spawns])
      spawns.forEach((s) => {
        setTimeout(() => setFloatHearts((prev) => prev.filter((p) => p.id !== s.id)), 2000)
      })
    }
  }, [stat.iconKey])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="relative flex flex-col items-center gap-1.5 p-4 cursor-pointer rounded-2xl transition-colors duration-500"
      style={{
        background: isHovered ? `${stat.color}12` : 'transparent',
        boxShadow: isHovered ? `0 0 24px ${stat.color}12` : 'none',
      }}
    >
      {/* Icon with micro-animation */}
      <motion.div
        animate={isHovered ? anim.animate : {}}
        transition={isHovered ? anim.transition : {}}
        style={{ perspective: stat.iconKey === 'dollar' ? 400 : undefined }}
        className="flex items-center justify-center"
      >
        <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
      </motion.div>

      <span className="text-xl md:text-2xl font-bold text-gray-100 tracking-tight">
        {formatted}
        <span className="text-base md:text-lg font-semibold" style={{ color: stat.color }}>{stat.suffix}</span>
      </span>
      <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">{stat.label}</span>

      {/* Floating hearts on click */}
      <AnimatePresence>
        {floatHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 1.4,
              x: (Math.random() - 0.5) * 100,
              y: -50 - Math.random() * 80,
              rotate: (Math.random() - 0.5) * 60,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute pointer-events-none z-50"
            style={{ left: h.x, top: h.y }}
          >
            <Heart className="w-5 h-5 text-red-400" fill="#f87171" strokeWidth={1} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------- Burst particle (enhanced explosion spread) ---------- */
function BurstParticle({ id, x, y, type }) {
  const angle = useRef((Math.random() - 0.5) * 90).current
  const driftX = useRef((Math.random() - 0.5) * 160).current
  const driftY = useRef(-60 - Math.random() * 120).current
  const delay = useRef(Math.random() * 0.15).current
  const scaleEnd = useRef(0.8 + Math.random() * 1.2).current

  const icons = {
    heart: { icon: Heart, color: '#f87171', fill: true },
    thumb: { icon: ThumbsUp, color: '#6366f1', fill: false },
    star:  { icon: Star, color: '#fbbf24', fill: true },
    spark: { icon: Sparkles, color: '#a78bfa', fill: false },
  }

  const { icon: Icon, color, fill } = icons[type]

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
      animate={{ opacity: 0, scale: scaleEnd, x: driftX, y: driftY, rotate: angle }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.8, delay, ease: 'easeOut' }}
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <Icon
        className="w-6 h-6"
        style={{ color }}
        fill={fill ? color : 'none'}
        strokeWidth={fill ? 1 : 2}
      />
    </motion.div>
  )
}

/* ---------- Magnetic Button ---------- */
function MagneticButton({ href, children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set(e.clientX - r.left - r.width / 2)
        y.set(e.clientY - r.top - r.height / 2)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 text-[#090b0f] text-sm font-medium
        hover:shadow-[0_0_30px_rgba(45,212,191,0.25)] transition-shadow cursor-pointer"
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5" />
    </motion.a>
  )
}

/* ---------- Phone Panel ---------- */
function PhonePanel({ panel }) {
  const [particles, setParticles] = useState([])
  const [lastTap, setLastTap] = useState(0)

  const handleTap = (e) => {
    const now = Date.now()
    if (now - lastTap < 300) {
      const rect = e.currentTarget.getBoundingClientRect()
      const baseX = e.clientX - rect.left
      const baseY = e.clientY - rect.top

      const types = panel.type === 'notes'
        ? ['heart', 'heart', 'heart', 'heart', 'thumb', 'thumb', 'star', 'spark', 'spark']
        : ['heart', 'heart', 'heart', 'heart', 'heart', 'spark', 'spark']

      for (let i = 0; i < types.length; i++) {
        const id = Date.now() + i + Math.random()
        const ox = baseX + (Math.random() - 0.5) * 100
        const oy = baseY + (Math.random() - 0.5) * 60
        setParticles((prev) => [...prev, { id, x: ox, y: oy, type: types[i] }])
        setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 2000)
      }
    }
    setLastTap(now)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="flex flex-col items-center"
    >
      {/* Phone mockup frame */}
      <div className="relative w-full max-w-[280px] mx-auto transition-shadow duration-300 hover:shadow-xl hover:shadow-teal-400/10">
        {/* Phone bezel */}
        <div className="rounded-[2.5rem] bg-[#1a1d25] border-[3px] border-white/[0.08] shadow-md overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#1a1d25]">
            <span className="text-[10px] font-semibold text-gray-400">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" className="text-gray-400">
                <rect x="0" y="0" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                <rect x="2" y="1.5" width="8" height="7" rx="1" fill="currentColor" />
                <rect x="12.5" y="3" width="1.5" height="4" rx="0.75" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Screen area - no crop */}
          <div
            className="relative bg-[#0f1117] cursor-pointer select-none"
            onClick={handleTap}
          >
            <img
              src={panel.src}
              alt={panel.alt}
              className="w-full h-auto object-contain block"
              draggable="false"
            />

            {/* Particles overlay */}
            <AnimatePresence>
              {particles.map((p) => (
                <BurstParticle key={p.id} id={p.id} x={p.x} y={p.y} type={p.type} />
              ))}
            </AnimatePresence>

            {/* Double-tap hint */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 3, duration: 1 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-sm text-[10px] text-gray-400 shadow-sm whitespace-nowrap pointer-events-none"
            >
              双击{panel.type === 'notes' ? '点赞' : '互动'}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Label */}
      <span className="mt-3 text-xs font-medium text-gray-500">{panel.label}</span>
    </motion.div>
  )
}

/* ---------- Main Section ---------- */
export default function VirtualHost() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-mono">
            Brand Incubation
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-100 font-serif">
            品牌孵化：<span className="text-accent">小红书爆款企划</span>
          </h2>
          <p className="mt-2 text-gray-400 text-sm">深度共创 · 跨界操盘 · 品效合一</p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bento p-6 md:p-8 mb-6 max-w-3xl mx-auto"
        >
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            与<span className="font-semibold text-gray-200">景德镇陶艺设计师</span>深度共创，主推
            <span className="font-semibold text-gray-200">萌系手作陶瓷</span>。
            我在此项目中跨界担任<span className="text-accent font-semibold">视觉与内容核心</span>，
            负责陶瓷产品的<span className="font-medium text-gray-300">3D 数字建模</span>、
            <span className="font-medium text-gray-300">商品视觉拍摄</span>以及
            <span className="font-medium text-gray-300">小红书网感文案策划</span>。
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bento p-4 md:p-8 mb-6 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {STATS.map((stat, i) => (
              <AnimatedStat key={stat.label} stat={stat} delay={i * 0.12} />
            ))}
          </div>
        </motion.div>

        {/* Three Phone Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {PANELS.map((panel) => (
            <PhonePanel key={panel.key} panel={panel} />
          ))}
        </div>

        {/* Magnetic Visit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <MagneticButton href="https://xhslink.com/m/6WWXBrIU7GA">
            访问小红书主页
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
