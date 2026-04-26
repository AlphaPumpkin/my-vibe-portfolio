import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Copy, Dice5, Sparkles, SlidersHorizontal } from 'lucide-react'

const REVIEWS = [
  {
    title: '清迈夜市美食探店',
    text: '在清迈周日夜市连吃三小时！这碗冬阴功汤简直封神，椰奶和酸辣的比例完美到让人想哭。店主是一个笑眯眯的泰国阿姨，看到我在拍照还特意加了两只大虾。芒果糯米饭的椰浆是现开的，甜而不腻。逛累了在街边做个足底按摩只要 100 铢，感觉人生已经到达了巅峰。下次一定要带朋友再来一次！',
  },
  {
    title: '东京深夜食堂',
    text: '在涩谷巷子深处找到一家只有 8 个座位的居酒屋。老板是位戴眼镜的老爷爷，一个人料理所有食物。烤鸡皮脆到发出咔嚓声，梅子茶泡饭温暖了整个深夜。隔壁的日本大叔用翻译软件和我聊天，最后居然帮我买了单。在这个城市最孤独的时刻，遇见了最温暖的人情味。料理不只是食物，是人与人的连接。',
  },
  {
    title: '冰岛追极光之旅',
    text: '零下 15 度的夜晚，裹着两层羽绒服在雷克雅未克郊外守候。凌晨两点，绿色的光带突然从山背后流淌出来，像宇宙的呼吸一样在头顶舞动。导游说我们运气太好了，这是本周最强的一次极光爆发。站在雪地里仰头看了整整一个小时，冻到手指快没知觉但完全不想眨眼。有些美，真的不是相机能记录的。',
  },
  {
    title: '巴塞罗那建筑漫步',
    text: '高迪的建筑简直不像是这个星球的东西。圣家堂内部的光线透过彩色玻璃洒下来，红色和蓝色交织在一起，整个人像站在万花筒里。在古埃尔公园坐了一下午，看着马赛克蜥蜴喷泉边上排队拍照的人群，突然觉得建筑可以不只是空间，更是一种能让人感受到快乐的艺术。',
  },
  {
    title: '大理的慢时光',
    text: '在洱海边租了一辆小电驴，沿着环海公路慢慢骑。风吹过来带着苍山雪的味道，湖面上有白族渔民在撒网。找了家民宿的露台坐下，老板娘送来一壶普洱和刚烤的鲜花饼。远处苍山十九峰在云雾里若隐若现，手机早就没电了，但一点都不焦虑——这种与世界断联的感觉，反而像是真正连接上了什么。',
  },
]

const PLACEHOLDERS = [
  '在泰国夜市吃了一顿冬阴功汤...',
  '在东京巷子里发现了深夜食堂...',
  '在冰岛追到了绿色的极光...',
  '在巴塞罗那看高迪的建筑...',
  '在大理洱海边骑小电驴...',
]

function PlaceholderTypewriter() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = PLACEHOLDERS[idx]
    let timer
    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(charIdx + 1), 60)
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), 2500)
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(charIdx - 1), 30)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setIdx((idx + 1) % PLACEHOLDERS.length)
    }
    setText(current.slice(0, charIdx))
    return () => clearTimeout(timer)
  }, [charIdx, deleting, idx])

  return (
    <span className="text-purple-400 pointer-events-none">
      {text}
      <span className="animate-pulse text-pink-400">|</span>
    </span>
  )
}

function fireConfetti(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: x + rect.left / window.innerWidth, y: y + rect.top / window.innerHeight },
    colors: ['#ec4899', '#c084fc', '#a78bfa', '#f9a8d4', '#e879f9', '#fda4af'],
  })
}

export default function ReviewGenerator() {
  const [wordCount, setWordCount] = useState(150)
  const [generatedText, setGeneratedText] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(false)
  const [bubblePos, setBubblePos] = useState(0)
  const sliderRef = useRef(null)

  const generateReview = useCallback((index) => {
    const review = REVIEWS[index]
    const truncated = review.text.slice(0, wordCount)
    setGeneratedText(truncated)
    setDisplayedText('')
    setIsGenerating(true)

    let i = 0
    const interval = setInterval(() => {
      if (i < truncated.length) {
        setDisplayedText(truncated.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, 30)
  }, [wordCount])

  const handleRandom = () => {
    const next = (reviewIndex + 1) % REVIEWS.length
    setReviewIndex(next)
    setTimeout(() => generateReview(next), 100)
  }

  const handleCopy = (e) => {
    navigator.clipboard.writeText(displayedText || generatedText)
    setCopied(true)
    fireConfetti(e)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSliderMove = (e) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect()
      const xPos = e.clientX - rect.left
      const pct = xPos / rect.width
      setBubblePos(xPos)
      const val = Math.round((pct * 450 + 50) / 50) * 50
      setWordCount(Math.min(500, Math.max(50, val)))
    }
  }

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-mono">
            Vibe Coding Demo
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-800">
            <span className="text-accent">好评生成器</span> 🪄
          </h2>
          <p className="mt-2 text-slate-400 text-sm">AI 驱动的探店文案 Mock 工具</p>
        </motion.div>

        {/* Phone mockup */}
        <div className="relative mx-auto max-w-[380px]">
          <div className="relative rounded-[3rem] bg-[#2d2838] border-[3px] border-[#3d3650] p-4 shadow-2xl shadow-purple-200/20">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#2d2838] rounded-b-2xl z-10 flex items-end justify-center pb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4a3f5c]" />
            </div>

            {/* Screen - warm pink-purple gradient */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50 p-5 min-h-[600px] border border-purple-100">
              {/* Status bar */}
              <div className="flex justify-between items-center mb-6 text-[10px] text-purple-300 font-mono pt-2">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-1 rounded-full bg-purple-300" />
                  <div className="w-3 h-1 rounded-full bg-purple-300" />
                </div>
              </div>

              {/* App header */}
              <div className="text-center mb-5">
                <span className="text-2xl">🪄</span>
                <h3 className="text-sm font-semibold text-purple-700 mt-1">AI 好评助手</h3>
              </div>

              {/* Input */}
              <div className="bg-white/70 border border-purple-100 rounded-xl p-3 mb-4 backdrop-blur-sm">
                <div className="text-xs text-purple-400 mb-1 font-mono">✨ 描述你的体验</div>
                <div className="text-xs leading-relaxed">
                  <PlaceholderTypewriter />
                </div>
              </div>

              {/* Word count slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400">
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>📝 字数范围</span>
                  </div>
                  <motion.span
                    key={wordCount}
                    initial={{ scale: 1.5, color: '#c084fc' }}
                    animate={{ scale: 1, color: '#7c3aed' }}
                    className="text-xs font-mono"
                  >
                    {wordCount}字
                  </motion.span>
                </div>
                <div
                  ref={sliderRef}
                  className="relative h-8 flex items-center cursor-pointer"
                  onMouseMove={(e) => {
                    if (e.buttons === 1) { handleSliderMove(e); setShowBubble(true) }
                  }}
                  onMouseDown={(e) => { handleSliderMove(e); setShowBubble(true) }}
                  onMouseUp={() => setShowBubble(false)}
                  onMouseLeave={() => setShowBubble(false)}
                >
                  <div className="w-full h-1 rounded-full bg-purple-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                      style={{ width: `${((wordCount - 50) / 450) * 100}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-400 shadow-sm"
                    style={{ left: `calc(${((wordCount - 50) / 450) * 100}% - 8px)` }}
                  />
                  <AnimatePresence>
                    {showBubble && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute -top-10 -translate-x-1/2 px-2.5 py-1 rounded-full bg-purple-500 text-white text-xs font-mono whitespace-nowrap shadow-sm"
                        style={{ left: bubblePos }}
                      >
                        {wordCount}字
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex justify-between px-1 mt-1">
                  {[50, 150, 250, 350, 450, 500].map((v) => (
                    <span key={v} className="text-[9px] text-purple-300 font-mono">{v}</span>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <motion.button
                onClick={() => generateReview(reviewIndex)}
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white text-sm font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-400/25 transition-shadow"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      💖
                    </motion.span>
                    正在生成...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    💖 生成好评
                  </span>
                )}
              </motion.button>

              {/* Generated text */}
              <div className="relative mt-4 bg-white/70 border border-purple-100 rounded-xl p-4 min-h-[160px] backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-purple-400 font-mono">✨ AI 生成结果</span>
                  <div className="flex items-center gap-1">
                    <motion.button
                      onClick={handleRandom}
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-300 hover:text-purple-500 transition-colors"
                      title="换一条"
                    >
                      <Dice5 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
                <motion.div
                  key={reviewIndex + displayedText.length}
                  className="text-xs text-purple-700 leading-relaxed"
                >
                  {displayedText || (
                    <span className="text-purple-300 italic">
                      点击"生成好评"按钮，AI 将为你生成一条探店文案...
                    </span>
                  )}
                  {isGenerating && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-[6px] h-3 bg-purple-400 ml-0.5"
                    />
                  )}
                </motion.div>
              </div>

              {/* Copy button */}
              <motion.button
                onClick={handleCopy}
                disabled={!displayedText && !generatedText}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-3 w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  copied
                    ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                    : 'bg-white/70 border border-purple-100 text-purple-400 hover:text-purple-600 hover:bg-purple-50'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {copied ? (
                  <>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-base">✓</motion.span>
                    复制成功 ✨
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    📋 一键复制
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
