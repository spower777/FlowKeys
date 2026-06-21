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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          fontFamily: 'sans-serif',
          gap: 32,
        }}
      >
        {/* Cat paw */}
        <div style={{ fontSize: 140, lineHeight: 1 }}>🐾</div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-2px',
          }}
        >
          FlowKeys
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#666666',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Ucz się pisać na klawiaturze, przepisując własne historie.
        </div>
      </div>
    ),
    { ...size }
  )
}
