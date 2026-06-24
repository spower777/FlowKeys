import type { SoundProfile } from './settings'

let _ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === 'closed') {
    _ctx = new AudioContext()
  }
  if (_ctx.state === 'suspended') void _ctx.resume()
  return _ctx
}

export type KeySoundType = 'normal' | 'error' | 'space' | 'backspace'

type SoundParams = { freq: number; Q: number; gain: number; decay: number }

const PROFILES: Record<Exclude<SoundProfile, 'off'>, Record<KeySoundType, SoundParams>> = {
  mechanical: {
    normal:    { freq: 3500, Q: 0.7,  gain: 0.50, decay: 0.030 },
    error:     { freq: 500,  Q: 4.0,  gain: 0.40, decay: 0.090 },
    backspace: { freq: 2200, Q: 1.5,  gain: 0.35, decay: 0.040 },
    space:     { freq: 1600, Q: 0.5,  gain: 0.45, decay: 0.050 },
  },
  soft: {
    normal:    { freq: 1800, Q: 1.5,  gain: 0.20, decay: 0.020 },
    error:     { freq: 350,  Q: 3.0,  gain: 0.15, decay: 0.070 },
    backspace: { freq: 1200, Q: 1.5,  gain: 0.18, decay: 0.030 },
    space:     { freq: 900,  Q: 0.8,  gain: 0.22, decay: 0.035 },
  },
  typewriter: {
    normal:    { freq: 4500, Q: 0.4,  gain: 0.55, decay: 0.015 },
    error:     { freq: 400,  Q: 5.0,  gain: 0.45, decay: 0.120 },
    backspace: { freq: 3000, Q: 1.0,  gain: 0.40, decay: 0.025 },
    space:     { freq: 2000, Q: 0.4,  gain: 0.50, decay: 0.040 },
  },
  deep: {
    normal:    { freq: 800,  Q: 2.5,  gain: 0.45, decay: 0.060 },
    error:     { freq: 250,  Q: 5.0,  gain: 0.40, decay: 0.120 },
    backspace: { freq: 600,  Q: 2.0,  gain: 0.40, decay: 0.080 },
    space:     { freq: 400,  Q: 1.5,  gain: 0.50, decay: 0.090 },
  },
}

export function playKeySound(type: KeySoundType = 'normal', profile: Exclude<SoundProfile, 'off'> = 'mechanical'): void {
  try {
    const ac = getCtx()
    const t = ac.currentTime
    const p = PROFILES[profile][type]

    const bufLen = Math.ceil(ac.sampleRate * 0.06)
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

    const src = ac.createBufferSource()
    src.buffer = buf

    const filter = ac.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = p.freq
    filter.Q.value = p.Q

    const gain = ac.createGain()
    gain.gain.setValueAtTime(p.gain, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    src.start(t)
    src.stop(t + p.decay + 0.02)
  } catch {
    // Audio unavailable or blocked
  }
}
