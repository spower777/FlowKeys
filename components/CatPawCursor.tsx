'use client'

import { useEffect } from 'react'

export default function CatPawCursor() {
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.font = '26px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🐾', 16, 17)

    const url = canvas.toDataURL('image/png')
    const style = document.createElement('style')
    style.id = 'cat-paw-cursor'
    style.textContent = `
      html { cursor: url("${url}") 4 4, auto; }
      a, button, [role="button"], select, summary, label,
      [tabindex]:not([tabindex="-1"]),
      input[type="submit"], input[type="button"], input[type="reset"] {
        cursor: url("${url}") 4 4, pointer;
      }
    `
    document.head.appendChild(style)
    return () => { document.getElementById('cat-paw-cursor')?.remove() }
  }, [])

  return null
}
