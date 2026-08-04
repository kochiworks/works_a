type ToneStep = {
  freq: number
  time: number
  duration: number
  type?: OscillatorType
  gain?: number
}

let audioCtx: AudioContext | null = null
let enabled = true

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null
  if (!audioCtx) {
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

function playTones(steps: ToneStep[]) {
  if (!enabled) return
  const ctx = getContext()
  if (!ctx) return
  const now = ctx.currentTime
  for (const step of steps) {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.type = step.type ?? 'sine'
    osc.frequency.value = step.freq
    const peak = step.gain ?? 0.18
    const start = now + step.time
    const end = start + step.duration
    gainNode.gain.setValueAtTime(0, start)
    gainNode.gain.linearRampToValueAtTime(peak, start + 0.008)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, end)
    osc.connect(gainNode).connect(ctx.destination)
    osc.start(start)
    osc.stop(end + 0.02)
  }
}

export function setSoundEnabled(value: boolean) {
  enabled = value
}

export function isSoundEnabled() {
  return enabled
}

export function playMoveSound() {
  playTones([{ freq: 720, time: 0, duration: 0.07 }])
}

export function playCaptureSound() {
  playTones([
    { freq: 340, time: 0, duration: 0.08, type: 'square', gain: 0.14 },
    { freq: 220, time: 0.05, duration: 0.09, type: 'square', gain: 0.14 },
  ])
}

export function playCheckSound() {
  playTones([
    { freq: 520, time: 0, duration: 0.09, type: 'triangle' },
    { freq: 780, time: 0.09, duration: 0.12, type: 'triangle' },
  ])
}

export function playCheckmateSound() {
  playTones([
    { freq: 523.25, time: 0, duration: 0.12, type: 'triangle' },
    { freq: 659.25, time: 0.12, duration: 0.12, type: 'triangle' },
    { freq: 783.99, time: 0.24, duration: 0.25, type: 'triangle' },
  ])
}
