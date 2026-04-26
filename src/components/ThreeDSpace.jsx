import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  { id: 1, title: '「暮光几何」', imageUrl: '/images/gallery/architecture design01.jpg', description: '建筑 3D 表现：黄昏下的极简清水混凝土与玻璃幕墙，探讨光影与几何的重构。', color: '#d97706', cropThumbnail: true },
  { id: 2, title: '「砖石矩阵」', imageUrl: '/images/gallery/architecture design02.jpg', description: '建筑 3D 表现：高层立面的材质推敲，红砖与现代模块化面板的肌理碰撞。', color: '#dc2626', cropThumbnail: true },
  { id: 3, title: '「木隐之室」', imageUrl: '/images/gallery/architecture design03.jpg', description: '室内 3D 表现：A字型木结构屋顶与清冷内饰的结合，营造极致的克制与宁静。', color: '#78716c' },
  { id: 4, title: '「原野方舟」', imageUrl: '/images/gallery/architecture design04.jpg', description: '建筑 3D 表现：将粗野主义的混凝土盒子锚固于自然坡地，与原野生态形成张力。', color: '#65a30d' },
  { id: 5, title: '「雪岭孤岛」', imageUrl: '/images/gallery/architecture design5.jpg', description: '建筑 3D 表现：极寒环境下的建筑锚点，动态雪景与静态建筑的视觉对抗。', color: '#0284c7' },
  { id: 6, title: '「林间守望」', imageUrl: '/images/gallery/architecture design6.jpg', description: '建筑 3D 表现：暮色中的孤立建筑，通过灯光设计强化空间的庇护感与故事性。', color: '#4f46e5' },
]

const VIDEOS = [
  { id: 7, title: '「废土余生：沙洲营地」', videoUrl: '/images/gallery/game-scene1.mp4', description: '游戏场景建构：全景废土风聚落设计。包含复杂资产搭建、破损材质表现与黄沙漫天的环境特效渲染。', color: '#b45309', maxH: '80vh' },
  { id: 8, title: '「深渊呢喃：鸦骸之塔」', videoUrl: '/images/gallery/game-scene2.mp4', description: '游戏场景建构：暗黑哥特风场景美术。聚焦于残破塔楼的压迫感营造、水面反射与动态群鸦的氛围烘托。', color: '#4338ca', maxH: '80vh' },
]

function Lightbox({ project, allImages, onClose, onNavigate }) {
  const currentIndex = allImages.findIndex((p) => p.id === project.id)
  const prev = currentIndex > 0 ? allImages[currentIndex - 1] : null
  const next = currentIndex < allImages.length - 1 ? allImages[currentIndex + 1] : null

  const handleNav = (p) => { onNavigate(p) }

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
            onClick={(e) => { e.stopPropagation(); handleNav(prev) }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-slate-500 hover:text-slate-800 shadow-sm z-20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {next && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNav(next) }}
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
            三维与虚拟建构
          </span>
          <p className="mt-3 text-slate-500 leading-relaxed text-sm max-w-2xl">{project.description}</p>
          <p className="mt-3 text-[11px] text-slate-400 font-mono">
            {currentIndex + 1} / {allImages.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ThreeDSpace() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-mono">
            3D & Virtual Spaces
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-800">
            三维与虚拟<span className="text-accent">构建</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm">建筑 3D 表现 · 游戏场景开发 · 点击图片放大细节</p>
        </motion.div>

        {/* 系列一：构筑之诗 · 建筑表现 */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 text-center">
            系列一：构筑之诗 · 建筑表现
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            {/* 左侧两列 */}
            <div className="flex flex-wrap gap-4 w-full md:w-[35%]">
              {IMAGES.slice(0, 2).map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bento cursor-pointer group overflow-hidden w-[calc(50%-8px)] flex flex-col"
                  onClick={() => setLightboxImage(project)}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={encodeURI(project.imageUrl)}
                      alt={project.title}
                      className={
                        project.cropThumbnail
                          ? 'w-full aspect-[4/5] sm:aspect-[3/4] object-cover object-center'
                          : 'w-full h-auto object-contain block'
                      }
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 border-t border-black/[0.02]">
                    <h3 className="text-[11px] font-semibold text-slate-700 truncate">{project.title}</h3>
                    <span
                      className="inline-block mt-0.5 text-[9px] font-medium"
                      style={{ color: project.color }}
                    >
                      三维与虚拟建构
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* 右侧四列 */}
            <div className="flex flex-wrap gap-4 flex-1">
              {IMAGES.slice(2, 6).map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bento cursor-pointer group overflow-hidden w-[calc(50%-8px)] sm:w-[calc(50%-8px)] flex flex-col"
                  onClick={() => setLightboxImage(project)}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={encodeURI(project.imageUrl)}
                      alt={project.title}
                      className={
                        project.cropThumbnail
                          ? 'w-full aspect-[4/5] sm:aspect-[3/4] object-cover object-center'
                          : 'w-full h-auto object-contain block'
                      }
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 border-t border-black/[0.02]">
                    <h3 className="text-[11px] font-semibold text-slate-700 truncate">{project.title}</h3>
                    <span
                      className="inline-block mt-0.5 text-[9px] font-medium"
                      style={{ color: project.color }}
                    >
                      三维与虚拟建构
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 系列二：虚拟疆域 · 游戏场景开发 — 全宽 */}
      <div className="mt-24 px-4 md:px-8">
        <h3 className="text-sm font-semibold text-slate-500 mb-4 text-center">
          系列二：虚拟疆域 · 游戏场景制作
        </h3>
        <div className="flex flex-col gap-16 max-w-[80vw] mx-auto">
          {VIDEOS.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bento overflow-hidden"
            >
              <div className="relative bg-black" style={{ maxHeight: project.maxH }}>
                <video
                  src={project.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain block"
                />
              </div>
              <div className="p-5 border-t border-black/[0.02]">
                <h3 className="text-base font-bold text-slate-800">{project.title}</h3>
                <span
                  className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: `${project.color}12`, color: project.color }}
                >
                  三维与虚拟建构
                </span>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox
            project={lightboxImage}
            allImages={IMAGES}
            onClose={() => setLightboxImage(null)}
            onNavigate={setLightboxImage}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
