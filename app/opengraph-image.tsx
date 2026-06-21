import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          gap: 48,
        }}
      >
        {/* Cat paw — SVG so it renders reliably */}
        <svg width="160" height="160" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="7" cy="14" rx="4" ry="5.5" fill="white" transform="rotate(-30 7 14)" />
          <ellipse cx="15" cy="8.5" rx="4" ry="5.5" fill="white" transform="rotate(-10 15 8.5)" />
          <ellipse cx="25" cy="8.5" rx="4" ry="5.5" fill="white" transform="rotate(10 25 8.5)" />
          <ellipse cx="33" cy="14" rx="4" ry="5.5" fill="white" transform="rotate(30 33 14)" />
          <path d="M 20 36 C 8 31 5 21 11 17 C 14.5 15 18 18 20 21 C 22 18 25.5 15 29 17 C 35 21 32 31 20 36 Z" fill="white" />
        </svg>

        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-4px',
            fontFamily: 'sans-serif',
          }}
        >
          FlowKeys
        </div>
      </div>
    ),
    { ...size }
  )
}
