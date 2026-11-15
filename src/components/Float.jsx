import Loop, { floatFrames } from './Loop.jsx'

/** Flutuação suave e lenta (Web Animations → GPU, pausa fora da tela). */
export default function Float({ children, className = '', y = 6, duration = 5, delay = 0, rotate = 0 }) {
  return (
    <Loop className={className} frames={floatFrames(y, rotate)} duration={duration} delay={delay}>
      {children}
    </Loop>
  )
}
