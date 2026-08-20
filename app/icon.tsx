import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
          borderRadius: '16px',
          padding: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0F172A',
            borderRadius: '12px',
          }}
        >
          {/* Shield SVG shape */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#2563EB" stroke="#60A5FA" />
            <circle cx="12" cy="11" r="2.5" fill="#FFFFFF" />
            <path d="M12 13.5v3.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
