let _ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === 'closed') {
    _ctx = new AudioContext()
  }
  if (_ctx.state === 'suspended') void _ctx.resume()
  return _ctx
}

export type KeySoundType = 'normal' | 'error' | 'space' | 'backspace'

export function playKeySound(type: KeySoundType = 'normal'): void {
  try {
    const ac = getCtx()
    const t = ac.currentTime

    const bufLen = Math.ceil(ac.sampleRate * 0.06)
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

    const src = ac.createBufferSource()
    src.buffer = buf

    const filter = ac.createBiquadFilter()
    filter.type = 'bandpass'

    const gain = ac.createGain()

    switch (type) {
      case 'normal':
        filter.frequency.value = 3500
        filter.Q.value = 0.7
        gain.gain.setValueAtTime(0.5, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
        break
      case 'error':
        filter.frequency.value = 500
        filter.Q.value = 4
        gain.gain.setValueAtTime(0.4, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
        break
      case 'backspace':
        filter.frequency.value = 2200
        filter.Q.value = 1.5
        gain.gain.setValueAtTime(0.35, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
        break
      case 'space':
        filter.frequency.value = 1600
        filter.Q.value = 0.5
        gain.gain.setValueAtTime(0.45, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
        break
    }

    src.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    src.start(t)
    src.stop(t + 0.12)
  } catch {
    // Audio unavailable or blocked
  }
}
