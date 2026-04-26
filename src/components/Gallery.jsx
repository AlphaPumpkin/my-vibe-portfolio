import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORIES = ['全部', '视觉海报', '建筑与城市设计']

const PROJECTS = [
  {
    id: 1,
    title: '「数字秩序」',
    category: '视觉海报',
    imageUrl: '/images/gallery/poster-01.jpg',
    description: '用网格构建理性视觉。',
    color: '#6366f1',
  },
  {
    id: 2,
    title: '「色彩之吻」',
    category: '视觉海报',
    imageUrl: '/images/gallery/poster-02.jpg',
    description: '探索平面空间的流动性。',
    color: '#ec4899',
  },
  {
    id: 3,
    title: '「重塑波普」',
    category: '视觉海报',
    imageUrl: '/images/gallery/poster-3.jpg',
    description: '孟菲斯与极简思维融合。',
    color: '#0ea5e9',
  },
  {
    id: 4,
    title: '「青轻城境」- 规划',
    category: '建筑与城市设计',
    imageUrl: '/images/gallery/urban-plan1.jpg',
    description: '融合水系治理与创新产业园区规划。',
    color: '#f59e0b',
    series: '青轻城境',
  },
  {
    id: 5,
    title: '「青轻城境」- 节点',
    category: '建筑与城市设计',
    imageUrl: '/images/gallery/urban-plan2.jpg',
    description: '融合水系治理与创新产业园区规划。',
    color: '#f59e0b',
    series: '青轻城境',
  },
  {
    id: 6,
    title: '「青轻城境」- 建筑',
    category: '建筑与城市设计',
    imageUrl: '/images/gallery/urban-plan3.jpg',
    description: '融合水系治理与创新产业园区规划。',
    color: '#f59e0b',
    series: '青轻城境',
  },
  {
    id: 7,
    title: '「抚州慢步」- 分析',
    category: '建筑与城市设计',
    imageUrl: '/images/gallery/architecture design05.jpg',
    description: '历史街区的空间重构与更新。',
    color: '#a78bfa',
    series: '抚州慢步',
  },
  {
    id: 8,
    title: '「抚州慢步」- 细节',
    category: '建筑与城市设计',
    imageUrl: '/images/gallery/architecture design06.jpg',
    description: '历史街区的空间重构与更新。',
    color: '#a78bfa',
    series: '抚州慢步',
  },
  {
    id: 9,
    title: '「浮岛家园」',
    category: '建筑与城市设计',
    imageUrl: '/images/gallery/landscape design.jpg',
    description: '未来水上家园景观整合。',
    color: '#10b981',
  },
]

function Lightbox({ project, allProjects, onClose, onNavigate }) {
  const sameCategory = allProjects.filter((p) => p.category === project.category)
  const currentIndex = sameCategory.findIndex((p) => p.id === project.id)
  const prev = currentIndex > 0 ? sameCategory[currentIndex - 1] : null
  const next = currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null

  const handleNavigate = (p) => { onNavigate(p) }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        key={project.id}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 flex flex-col w-fit max-w-[95vw] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {prev && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNavigate(prev) }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-slate-500 hover:text-slate-800 shadow-sm z-20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {next && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNavigate(next) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-slate-500 hover:text-slate-800 shadow-sm z-20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2">
          <img
            src={encodeURI(project.imageUrl)}
            alt={project.title}
            className="w-auto max-w-full h-auto max-h-[75vh] block object-contain mx-auto"
          />
        </div>

        <div className="flex-shrink-0 p-4 md:p-6 bg-white border-t border-gray-100">
          <h3 className="text-xl font-bold text-slate-800">{project.title}</h3>
          <span
            className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: `${project.color}12`, color: project.color }}
          >
            {project.category}
          </span>
          <p className="mt-3 text-slate-500 leading-relaxed text-sm max-w-2xl">{project.description}</p>
          <p className="mt-3 text-[11px] text-slate-400 font-mono">
            {currentIndex + 1} / {sameCategory.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('全部')
  const [lightboxProject, setLightboxProject] = useState(null)

  const posters = PROJECTS.filter((p) => p.category === '视觉海报')
  const architecture = PROJECTS.filter((p) => p.category === '建筑与城市设计')

  const filtered = activeTab === '全部'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeTab)

  const handleNavigate = useCallback((project) => {
    setLightboxProject(project)
  }, [])

  function Card({ project }) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ y: -6 }}
        className="bento cursor-pointer group w-full flex flex-col"
        onClick={() => setLightboxProject(project)}
      >
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={encodeURI(project.imageUrl)}
            alt={project.title}
            className="w-full h-auto object-contain block"
            loading="lazy"
          />
        </div>
        <div className="p-4 border-t border-black/[0.02]">
          <h3 className="text-sm font-semibold text-slate-700 truncate">{project.title}</h3>
          <span
            className="inline-block mt-1 text-[10px] font-medium"
            style={{ color: project.color }}
          >
            {project.category}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-mono">
            Portfolio Gallery
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-800">
            作品<span className="text-accent">画廊</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm">点击卡片查看详情 · 灯箱内点击图片放大细节 · 左右切换浏览</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-2xl p-1.5 border border-black/5 shadow-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className="relative px-5 py-2 text-sm font-medium rounded-xl transition-colors z-10"
                style={{ color: activeTab === cat ? '#1e293b' : '#94a3b8' }}
              >
                {activeTab === cat && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-black/[0.04] rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === '全部' ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[30%] flex-shrink-0">
              <h3 className="text-xs font-semibold text-slate-400 mb-3 tracking-wider uppercase">视觉海报</h3>
              <div className="flex flex-wrap gap-3">
                {posters.map((p) => (
                  <div key={p.id} className="w-[calc(50%-6px)]">
                    <Card project={p} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-slate-400 mb-3 tracking-wider uppercase">建筑与城市设计</h3>
              <div className="flex flex-wrap gap-3">
                {architecture.map((p) => (
                  <div key={p.id} className="w-[calc(50%-6px)] lg:w-[calc(33.33%-8px)]">
                    <Card project={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filtered.map((project) => (
              <div key={project.id} className="w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-10px)] xl:w-[calc(16.66%-10px)]">
                <Card project={project} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxProject && (
          <Lightbox
            project={lightboxProject}
            allProjects={PROJECTS}
            onClose={() => setLightboxProject(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
