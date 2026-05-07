import { useEffect, useState } from 'react';

export function DisasterEffect({ disasterType, children }) {
  if (disasterType === 'earthquake') {
    return <EarthquakeWrapper>{children}</EarthquakeWrapper>;
  }
  if (disasterType === 'flood') {
    return <FloodWrapper>{children}</FloodWrapper>;
  }
  if (disasterType === 'typhoon') {
    return <TyphoonWrapper>{children}</TyphoonWrapper>;
  }
  return <>{children}</>;
}

function EarthquakeWrapper({ children }) {
  // 5秒に1度、強い揺れを発生させる
  const [strong, setStrong] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setStrong(true);
      setTimeout(() => !cancelled && setStrong(false), 1200);
    };
    const interval = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className={strong ? 'quake-shake-strong' : 'quake-shake'}>{children}</div>
      <div
        className="fixed inset-0 pointer-events-none z-30 quake-flash"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(252, 211, 77, 0.55), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
        aria-hidden="true"
      >
        ⚠️ 緊急地震速報 ⚠️
      </div>
    </>
  );
}

function FloodWrapper({ children }) {
  return (
    <>
      {children}
      <FloodOverlay />
    </>
  );
}

function FloodOverlay() {
  const bubbles = Array.from({ length: 8 });
  const debris = ['🌿', '🪵', '🍃'];

  return (
    <div
      className="fixed inset-x-0 bottom-0 pointer-events-none z-30 overflow-hidden"
      style={{ height: '32vh' }}
      aria-hidden="true"
    >
      {/* 漂流物 */}
      {debris.map((d, i) => (
        <span
          key={`debris-${i}`}
          className="absolute text-2xl flood-debris"
          style={{
            bottom: `${10 + i * 8}vh`,
            animationDelay: `${i * 4}s`,
            animationDuration: `${14 + i * 3}s`,
          }}
        >
          {d}
        </span>
      ))}

      {/* 水面コンテナ（下から立ち上がる） */}
      <div
        className="absolute inset-x-0 bottom-0 flood-water"
        style={{ height: '28vh' }}
      >
        {/* 泡 */}
        {bubbles.map((_, i) => (
          <span
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/60 flood-bubble"
            style={{
              left: `${(i * 12 + 5) % 100}%`,
              bottom: '0',
              width: `${6 + (i % 3) * 4}px`,
              height: `${6 + (i % 3) * 4}px`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${4 + (i % 4)}s`,
            }}
          />
        ))}

        {/* 水面の波 (奥) */}
        <svg
          className="absolute -top-6 left-0 w-[200%] h-12 flood-wave-2"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C150,10 300,70 600,40 C900,10 1050,70 1200,40 L1200,80 L0,80 Z"
            fill="rgba(56, 189, 248, 0.55)"
          />
        </svg>

        {/* 水面の波 (手前) */}
        <svg
          className="absolute -top-4 left-0 w-[200%] h-10 flood-wave-1"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z"
            fill="rgba(14, 165, 233, 0.75)"
          />
        </svg>

        {/* 水本体 */}
        <div
          className="absolute inset-0 top-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 165, 233, 0.75) 0%, rgba(8, 47, 73, 0.85) 100%)',
          }}
        />
      </div>
    </div>
  );
}

function TyphoonWrapper({ children }) {
  const drops = Array.from({ length: 30 });
  return (
    <>
      {children}
      <div
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
        aria-hidden="true"
      >
        {drops.map((_, i) => (
          <span
            key={i}
            className="absolute rain-drop bg-sky-400/60"
            style={{
              left: `${(i * 7 + 3) % 100}%`,
              top: '-10vh',
              width: '2px',
              height: `${10 + (i % 4) * 6}px`,
              animationDelay: `${(i * 0.13) % 1.2}s`,
              animationDuration: `${0.9 + (i % 5) * 0.15}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
