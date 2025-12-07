import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
  { q: '¿Cuándo es mi cumpleaños?', options: ['3 de junio', '1 de enero', '14 de febrero'], correct: 0 },
  { q: '¿Cuál es mi color favorito?', options: ['rojo', 'verde', 'azul'], correct: 1 },
  { q: '¿Cómo se llama mi perrita?', options: ['Luna', 'Kimberli Loaiza', 'Maya'], correct: 1 },
  { q: '¿Cuál es mi equipo favorito de fútbol mexicano?', options: ['Chivas', 'América', 'Pumas'], correct: 1 },
  { q: '¿Cuál es mi equipo favorito de la F1?', options: ['Ferrari', 'Mercedes', 'McLaren'], correct: 2 }
]

export default function Quiz({ onFinish }) {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [feedbackType, setFeedbackType] = useState(null)
  const [activeChoice, setActiveChoice] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [showProposal, setShowProposal] = useState(false)
  const [showFinalOverlay, setShowFinalOverlay] = useState(false)
  const [proposalAnswer, setProposalAnswer] = useState(null)
  const isLast = index === QUESTIONS.length - 1

  const sendSms = async (phone, text) => {
    try {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message: text })
      })
    } catch (err) {
      console.warn('SMS send failed (no backend configured)', err)
    }
  }

  const handleChoice = (i) => {
    setActiveChoice(i)
    const ok = i === QUESTIONS[index].correct
    setFeedback(ok ? '¡Correcto!' : `Casi... la respuesta correcta es: ${QUESTIONS[index].options[QUESTIONS[index].correct]}`)
    setFeedbackType(ok ? 'ok' : 'err')
    if (ok) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 900)
    }
    setTimeout(() => {
      setFeedback(null)
      setFeedbackType(null)
      setActiveChoice(null)
      if (index < QUESTIONS.length - 1) setIndex(i => i + 1)
      else {
        setShowTeaser(true)
        setTimeout(() => {
          setShowTeaser(false)
          setShowProposal(true)
        }, 1200)
      }
    }, 900)
  }

  return (
    <div className="relative min-h-screen bg-beautiful p-8">
      <div className="pointer-events-none absolute -left-20 -top-20 w-72 h-72 rounded-full bg-pink-300 opacity-30 blur-3xl transform rotate-12" />
      <div className="pointer-events-none absolute -right-24 top-10 w-80 h-80 rounded-full bg-blue-200 opacity-28 blur-3xl transform -rotate-6" />
      <div className="pointer-events-none absolute left-1/2 -bottom-16 w-96 h-56 rounded-full bg-yellow-200 opacity-22 blur-2xl transform -translate-x-1/2" />

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={isLast ? { opacity: 1, y: 0, scale: 1.02 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <div className="space-y-3 inner-frame quiz-sea">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-dancing bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent">{QUESTIONS[index].q}</h3>
                <div className="text-sm text-gray-500">{index + 1}/{QUESTIONS.length}</div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-pink-300" style={{ width: `${Math.round(((index + 1) / QUESTIONS.length) * 100)}%` }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {QUESTIONS[index].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleChoice(i)}
                    whileTap={{ scale: 0.98 }}
                    animate={activeChoice === i ? (feedbackType === 'ok' ? { scale: 1.03 } : { x: [0, -6, 6, -4, 0] }) : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="option-btn flex items-center gap-3 px-4 py-4 rounded-2xl border border-gray-200 bg-white/90 hover:scale-105 transform transition duration-200 text-left shadow-sm"
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-50 text-sm text-pink-600">{i+1}</span>
                    <span className="font-medium text-gray-800">{opt}</span>
                  </motion.button>
                ))}
              </div>

              {feedback && (
                <div className={`mt-2 text-sm ${feedbackType === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>
              )}

              {showConfetti && (
                <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
                  <motion.div initial={{ y: 0, opacity: 1 }} animate={{ y: -120, opacity: 0 }} transition={{ duration: 0.9 }} className="flex gap-2 items-center">
                    <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
                  </motion.div>
                </div>
              )}

              {/* teaser */}
              <AnimatePresence>
                {showTeaser && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md victorian-card inner-frame p-6 text-center">
                      <div className="text-lg text-gray-700">Antes de despedirme...</div>
                      <div className="mt-2 text-2xl font-dancing text-pink-500">Hay algo muy importante que quiero preguntarte</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* proposal */}
              <AnimatePresence>
                {showProposal && (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }} className="pointer-events-auto absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl victorian-card shadow-xl text-center">
                      <div className="text-sm text-gray-500">Una pregunta... con todo mi corazón</div>
                      <h2 className="mt-3 text-4xl font-dancing text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500">¿Quieres ser mi novia?</h2>

                      <div className="mt-6 flex items-center justify-center">
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => {
                          setProposalAnswer('yes')
                          sendSms('+525632897958', 'Me dijo que sí a la pregunta: ¿Quieres ser mi novia?')
                          setShowFinalOverlay(true)
                          setTimeout(() => {
                            setShowFinalOverlay(false)
                            onFinish()
                          }, 3200)
                        }} className="px-8 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-lg">Sí, claro</motion.button>
                      </div>

                      {proposalAnswer === 'yes' && (
                        <div className="mt-4 text-green-600 font-semibold">¡Me alegra tanto!</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* final overlay */}
              <AnimatePresence>
                {showFinalOverlay && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center">
                    <div className="final-overlay flex items-center justify-center p-8">
                      <div className="final-inner text-center relative">
                        <h1 className="text-6xl md:text-7xl font-dancing text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400">Sí, quiero</h1>
                        <p className="mt-4 text-xl md:text-2xl text-white/90">Gracias por aceptar; eres mi persona favorita.</p>
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="final-sparkles" aria-hidden>
                            {Array.from({ length: 20 }).map((_, i) => (
                              <span
                                key={i}
                                className="final-sparkle"
                                style={{
                                  left: `${5 + Math.random() * 90}%`,
                                  top: `${10 + Math.random() * 70}%`,
                                  animationDelay: `${(i % 6) * 0.12}s`,
                                  width: `${6 + Math.random() * 10}px`,
                                  height: `${6 + Math.random() * 10}px`
                                }}
                              />
                            ))}
                          </div>
                          <div className="final-ribbon" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
 
