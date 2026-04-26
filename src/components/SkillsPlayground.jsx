import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  Box, Gamepad2, PencilRuler, Cuboid, PenTool, Image, Layout, Layers, Film,
} from 'lucide-react'

const TOOLS = [
  { name: 'Maya', icon: Box, color: '#00B4A0', label: '3D 建模 & 动画' },
  { name: '3ds Max', icon: Layers, color: '#0099B0', label: '参数化建模 & 渲染' },
  { name: 'UE5', icon: Gamepad2, color: '#007ACC', label: '实时渲染 & 关卡设计' },
  { name: 'SU', icon: PencilRuler, color: '#E72B2B', label: '快速体量推敲' },
  { name: 'Blender', icon: Cuboid, color: '#F5792A', label: '建模 & 概念设计' },
  { name: 'MasterGo', icon: PenTool, color: '#6C5CE7', label: 'UI/UX 设计 & 原型' },
  { name: 'PS', icon: Image, color: '#31A8FF', label: '图像处理 & 后期' },
  { name: 'Axure', icon: Layout, color: '#6359A5', label: '交互原型 & 流程图' },
  { name: 'AE', icon: Film, color: '#7B2FBE', label: '动态图形 & 视觉特效' },
]

function ToolBadge({ tool }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 100, damping: 14 })
  const sy = useSpring(my, { stiffness: 100, damping: 14 })
  const [hovered, setHovered] = useState(false)

  // Unique microgravity drift parameters per badge
  const drift = useRef({
    xAmp: 2.5 + Math.random() * 6,
    yAmp: 2 + Math.random() * 5,
    rotAmp: 1 + Math.random() * 3,
    dur: 4 + Math.random() * 5,
    delay: Math.random() * 2.5,
  }).current

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.32)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.32)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center select-none"
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
    >
      {/* Microgravity drift wrapper */}
      <motion.div
        className="relative w-[68px] h-[68px] rounded-[18px] flex items-center justify-center cursor-pointer
          backdrop-blur-sm"
        style={{
          background: hovered ? `${tool.color}14` : 'rgba(255,255,255,0.45)',
          border: `1.5px solid ${hovered ? tool.color + '40' : 'rgba(255,255,255,0.65)'}`,
          boxShadow: hovered
            ? `0 10px 30px ${tool.color}1A, 0 0 0 4px ${tool.color}08`
            : '0 2px 8px rgba(0,0,0,0.03)',
        }}
        animate={{
          x: [0, drift.xAmp, 0, -drift.xAmp, 0],
          y: [0, -drift.yAmp, 0, drift.yAmp, 0],
          rotate: [0, drift.rotAmp, 0, -drift.rotAmp, 0],
        }}
        transition={{
          duration: drift.dur,
          repeat: Infinity,
          delay: drift.delay,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.13 }}
      >
        <tool.icon
          className="w-6 h-6 transition-colors duration-500"
          style={{ color: hovered ? tool.color : '#94a3b8' }}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Label */}
      <motion.span
        className="mt-3 text-[11px] font-medium transition-colors duration-500"
        style={{ color: hovered ? tool.color : '#94a3b8' }}
      >
        {tool.name}
      </motion.span>
    </motion.div>
  )
}

export default function SkillsPlayground() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-mono">
            Tech Stack
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-800">
            技术<span className="text-accent">工具栈</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm">微重力悬浮 · 磁性吸附 · 悬停唤醒品牌色彩</p>
        </motion.div>

        {/* Glass Bento container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/70 shadow-sm p-8 md:p-12"
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-4 md:gap-6">
            {TOOLS.map((tool) => (
              <ToolBadge key={tool.name} tool={tool} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
