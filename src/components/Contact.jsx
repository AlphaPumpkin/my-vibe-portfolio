import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Mail, Send, Github, Twitter } from 'lucide-react'

const EMAIL = 'xnstudent@163.com'

function fireEmailConfetti() {
  const end = Date.now() + 2000
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b']

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export default function Contact() {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleClick = () => {
    setRevealed(true)
    fireEmailConfetti()

    setTimeout(() => {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setCopied(true)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      })
    }, 600)
  }

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-mono">
            Say Hello
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-slate-800">
            Let's <span className="text-accent">Connect</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm">点击下方按钮，我的邮箱会自动复制到你的剪贴板</p>
        </motion.div>

        {/* Say Hi button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          {!revealed ? (
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-10 py-4 rounded-2xl text-lg font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/20"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-sky-500 to-violet-500"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <Send className="w-5 h-5" />
                Say Hi
              </span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col items-center gap-4"
            >
              {/* Email ribbon */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bento px-6 py-4 flex items-center gap-4"
                >
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span className="text-lg md:text-xl font-mono text-slate-600">{EMAIL}</span>
                  {copied && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-500 text-sm font-mono"
                    >
                      ✓ 已复制
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>

              {/* Socials */}
              <div className="flex gap-4 mt-4">
                {[
                  { icon: Github, label: 'GitHub' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Mail, label: 'Email' },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-white border border-black/5 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors shadow-sm"
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white px-5 py-3 rounded-full border border-black/5 shadow-xl flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                ✨
              </motion.span>
              <span className="text-sm text-slate-600">邮箱已复制到剪贴板，期待你的来信!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-xs text-slate-300">
        <p>Built with React + Vite + Tailwind CSS + Framer Motion</p>
        <p className="mt-1">© 2026 Vibe Portfolio</p>
      </div>
    </section>
  )
}
