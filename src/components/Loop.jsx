import { createElement, useEffect, useRef } from 'react'

const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Animação em loop pela Web Animations API: transform/opacity rodam no
 * compositor (GPU), sem recalcular estilo a cada frame, e a animação pausa
 * sozinha quando sai da tela. "Reduzir movimento" desliga.
 */
export default function Loop({ as = 'div', frames, duration = 3, delay = 0, easing = 'ease-in-out', children, ...rest }) {
  const ref = useRef(null)
  const key = JSON.stringify(frames)
  useEffect(() => {
    const el = ref.current
    if (!el || !el.animate || reduceMotion()) return
    const anim = el.animate(frames, { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing })
    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? anim.play() : anim.pause()))
      io.observe(el)
    }
    return () => {
      io?.disconnect()
      anim.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, duration, delay, easing])
  return createElement(as, { ref, ...rest }, children)
}

export const floatFrames = (y = 6, r = 0) => [
  { transform: `translateY(0px) rotate(${-r}deg)` },
  { transform: `translateY(${-y}px) rotate(${r}deg)` },
  { transform: `translateY(0px) rotate(${-r}deg)` },
]
export const pulseFrames = (s = 1.04) => [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }]
