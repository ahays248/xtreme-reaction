import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #001100 0%, #000 50%)',
        }}
      >
        {/* Green glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(0,255,0,0.1) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Logo/Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: '-0.025em',
            color: '#00FF00',
            textShadow: '0 0 30px rgba(0,255,0,0.8)',
            marginBottom: 20,
          }}
        >
          XTREME REACTION
        </div>
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#00FF00',
            opacity: 0.8,
            marginBottom: 40,
          }}
        >
          Test Your Reflexes
        </div>
        
        {/* Game Elements */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            alignItems: 'center',
          }}
        >
          {/* Green target */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #00FF00 0%, #00AA00 100%)',
              boxShadow: '0 0 40px rgba(0,255,0,0.8)',
            }}
          />
          
          {/* Timer */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#00FF00',
              textShadow: '0 0 20px rgba(0,255,0,0.6)',
            }}
          >
            60s
          </div>
          
          {/* Red target */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FF0000 0%, #AA0000 100%)',
              boxShadow: '0 0 40px rgba(255,0,0,0.8)',
            }}
          />
        </div>
        
        {/* Call to action */}
        <div
          style={{
            marginTop: 60,
            fontSize: 28,
            color: '#00FF00',
            opacity: 0.7,
            letterSpacing: '0.1em',
          }}
        >
          COMPETE GLOBALLY • SHARE YOUR SCORE
        </div>
        
        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#00FF00',
            opacity: 0.5,
          }}
        >
          XtremeReaction.lol
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}