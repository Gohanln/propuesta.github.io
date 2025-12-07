import React, { useState, useEffect, useRef } from 'react'
import Quiz from './components/Quiz'
import { motion } from 'framer-motion'

export default function App() {
  const [finished, setFinished] = useState(false)
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const audioRef = useRef(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioSrc, setAudioSrc] = useState('/music.mp3')

  const finalMessage = 'Me haces muy feliz, te amo muchísimo. Prometo dar siempre lo mejor de mí para hacerte feliz y para cuidar lo que estamos construyendo juntos. Gracias por todo lo que me haces sentir, por tu cariño y por la luz que le das a mi vida.'

  useEffect(() => {
    if (!finished) return
    setTyped('')
    setTypingDone(false)
    let i = 0
    const iv = setInterval(() => {
      if (i < finalMessage.length) {
        setTyped(prev => prev + finalMessage.charAt(i))
        i += 1
      } else {
        clearInterval(iv)
        setTypingDone(true)
        setTimeout(() => document.body.classList.add('celebrate'), 200)
      }
    }, 50)
    return () => clearInterval(iv)
  }, [finished])

  useEffect(() => {
    // Check whether local /music.mp3 exists; if not, fall back to a public test mp3
    const checkAndSet = async () => {
      try {
        const resp = await fetch('/music.mp3', { method: 'HEAD' })
        if (resp.ok) {
          setAudioSrc('/music.mp3')
        } else {
          // fallback short test clip (public MDN example)
          setAudioSrc('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3')
        }
      } catch (e) {
        setAudioSrc('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3')
      }
    }
    checkAndSet()
  }, [])

  useEffect(() => {
    // attempt autoplay once audioSrc is set
    const tryPlay = async () => {
      if (!audioRef.current || !audioSrc) return
      try {
        audioRef.current.volume = 0.7
        audioRef.current.muted = false
        // set src explicitly in case it changed
        audioRef.current.src = audioSrc
        await audioRef.current.play()
        setAudioPlaying(true)
      } catch (e) {
        // autoplay may be blocked — user gesture required
      }
    }
    tryPlay()
  }, [audioSrc])

  const toggleAudio = async () => {
    if (!audioRef.current) return
    try {
      if (audioPlaying) {
        audioRef.current.pause()
        setAudioPlaying(false)
      } else {
        // ensure volume/unmuted before play
        audioRef.current.volume = 0.7
        audioRef.current.muted = false
        await audioRef.current.play()
        setAudioPlaying(true)
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden">
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <div className="absolute inset-0 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-xl mx-4 victorian-card rounded-3xl p-8 shadow-lg"
      >
        <header className="text-center mb-6">
          <p className="subtitle mt-2 font-inter">Un quiz romántico y divertido</p>
        </header>

        {!finished ? (
          <Quiz onFinish={() => setFinished(true)} />
        ) : null}
      </motion.div>

      {finished && (
        <div className="final-overlay">
          <div className="final-inner">
            <p className="final-text italic text-red-400">{typed}{!typingDone ? <span className="cursor">▌</span> : null}</p>
            {typingDone && <div className="mt-6 text-6xl heart-beat">💛</div>}
          </div>

          {typingDone && (
            <>
              {/* final roses removed */}
              <div className="final-waves" aria-hidden>
                {Array.from({ length: 28 }).map((_, i) => {
                  const top = `${10 + Math.random() * 80}%`
                  const left = `${Math.random() * 90}%`
                  const width = `${20 + Math.random() * 140}px`
                  const rot = `${Math.random() * 360}deg`
                  const delay = `${(Math.random() * 1.6).toFixed(2)}s`
                  const duration = `${2 + Math.random() * 2.2}s`
                  return (
                    <span
                      key={i}
                      className="final-wave"
                      style={{
                        top,
                        left,
                        width,
                        transform: `rotate(${rot})`,
                        animationDelay: delay,
                        animationDuration: duration,
                        opacity: 0
                      }}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={toggleAudio}
        aria-label={audioPlaying ? 'Pausar música' : 'Reproducir música'}
        title={audioPlaying ? 'Pausar música' : 'Reproducir música'}
        className="fixed z-50 bottom-6 right-6 bg-white/85 backdrop-blur-sm hover:scale-105 transition-transform rounded-full p-3 shadow-lg flex items-center justify-center"
      >
        <span style={{ fontSize: 20 }}>{audioPlaying ? '🔊' : '🔈'}</span>
      </button>
    </div>
  )
}
