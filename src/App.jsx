import { useState, useEffect } from "react";
import Scene from "./components/Scene";

const PAINTING_SRC = "/assets/proof/photo_2026-02-05_23-39-32.jpg";
const SUNFLOWER_SRC = "/assets/sunflower.webp";
const GOD_RAYS_SRC = "/assets/Sluglord  website Assets_god-rays copy.webp";
const SUN_SRC = "/assets/Sun, Sky_Sun.webp";
const PRELOADER_DURATION = 5500;
const FADE_OUT_MS = 900;

/* Decorative sunflowers flanking the painting */
const decorFlowers = [
  // Left side
  { left: "2%",  bottom: "-4%", height: "32vh", tilt: 10,  delay: 0.4, sway: 3.2 },
  { left: "-3%", bottom: "-6%", height: "38vh", tilt: 6,   delay: 0.2, sway: 3.5 },
  { left: "8%",  bottom: "0%",  height: "24vh", tilt: 14,  delay: 0.7, sway: 3.8 },
  { left: "-1%", bottom: "4%",  height: "18vh", tilt: 8,   delay: 1.0, sway: 4.0 },
  { left: "5%",  bottom: "-8%", height: "35vh", tilt: 4,   delay: 0.1, sway: 3.3 },
  // Right side
  { left: "92%", bottom: "-5%", height: "34vh", tilt: -8,  delay: 0.3, sway: 3.4 },
  { left: "97%", bottom: "-3%", height: "28vh", tilt: -12, delay: 0.6, sway: 3.6 },
  { left: "88%", bottom: "1%",  height: "22vh", tilt: -6,  delay: 0.8, sway: 3.9 },
  { left: "95%", bottom: "-7%", height: "36vh", tilt: -4,  delay: 0.15, sway: 3.2 },
  { left: "100%",bottom: "3%",  height: "17vh", tilt: -14, delay: 0.9, sway: 4.1 },
];

/* Floating pollen particles */
const particles = Array.from({ length: 15 }, (_, i) => ({
  left: `${10 + Math.random() * 80}%`,
  bottom: `${5 + Math.random() * 40}%`,
  size: 2 + Math.random() * 3,
  duration: 8 + Math.random() * 6,
  delay: Math.random() * 8,
  dx: -30 + Math.random() * 60,
  dy: -(40 + Math.random() * 80),
}));

function Preloader({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, FADE_OUT_MS);
    }, PRELOADER_DURATION);
    return () => clearTimeout(timer);
  }, [onDone]);

  const dismiss = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onDone, FADE_OUT_MS);
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer select-none"
      style={{
        background: "radial-gradient(ellipse at 50% 35%, #2A1E10 0%, #140C04 70%, #0A0602 100%)",
        animation: exiting
          ? `preloader-exit ${FADE_OUT_MS}ms ease-in forwards`
          : undefined,
      }}
      onClick={dismiss}
    >
      {/* Subtle god rays from top */}
      <img
        src={GOD_RAYS_SRC}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          mixBlendMode: "screen",
          opacity: 0.12,
          animation: "ray-drift 30s ease-in-out infinite, ray-pulse 12s ease-in-out infinite",
          transformOrigin: "50% 0%",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, transparent 75%)",
        }}
        draggable={false}
      />

      {/* Sun glow — top-left, subtle warmth */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          left: "-5%",
          width: "50%",
          height: "45%",
        }}
      >
        <img
          src={SUN_SRC}
          alt=""
          className="w-full h-full object-contain"
          style={{
            opacity: 0.15,
            animation: "sun-pulse 10s ease-in-out infinite",
            filter: "blur(8px)",
          }}
          draggable={false}
        />
      </div>

      {/* Large warm ambient glow behind painting */}
      <div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "90vmin",
          height: "90vmin",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,23,0.18) 0%, rgba(232,184,74,0.06) 40%, transparent 65%)",
          animation: "preloader-glow 6s ease-in-out infinite",
        }}
      />

      {/* Floating pollen particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              backgroundColor: "rgba(255,220,140,0.7)",
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              animation: `preloader-particle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative sunflowers on edges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {decorFlowers.map((f, i) => (
          <div
            key={i}
            className="absolute aspect-[2/5]"
            style={{
              left: f.left,
              bottom: f.bottom,
              height: f.height,
              "--tilt": `${f.tilt}deg`,
              transform: `rotate(${f.tilt}deg)`,
              transformOrigin: "bottom center",
              animation: `grass-sway ${f.sway}s ease-in-out infinite, preloader-fade-in 1.4s ease-out both`,
              animationDelay: `${f.delay}s, ${f.delay}s`,
              opacity: 0.45,
              filter: "brightness(0.5) saturate(0.6)",
            }}
          >
            <img
              src={SUNFLOWER_SRC}
              alt=""
              className="w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-5 sm:gap-7 px-6 max-w-lg">
          {/* Painting with ornate golden frame */}
          <div
            className="relative"
            style={{
              animation: "preloader-fade-in 1.5s ease-out both",
              animationDelay: "0.3s",
            }}
          >
            {/* Painting glow halo */}
            <div
              className="absolute -inset-[30%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,160,23,0.2) 0%, transparent 60%)",
                animation: "preloader-glow 5s ease-in-out infinite",
              }}
            />
            {/* Multi-layer golden frame */}
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                padding: "8px",
                background: "linear-gradient(145deg, #D4A017 0%, #8B6914 15%, #F5DEB3 30%, #D4A017 50%, #8B6914 70%, #F5DEB3 85%, #D4A017 100%)",
                backgroundSize: "200% 200%",
                animation: "preloader-shimmer 4s linear infinite",
                boxShadow: "0 12px 50px rgba(0,0,0,0.7), 0 0 100px rgba(212,160,23,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              {/* Inner frame bevel */}
              <div
                className="rounded-[4px] overflow-hidden"
                style={{
                  padding: "3px",
                  background: "linear-gradient(to bottom, rgba(90,60,20,0.9), rgba(60,40,15,0.9))",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(212,160,23,0.2)",
                }}
              >
                <img
                  src={PAINTING_SRC}
                  alt="The original Sluglord painting by Matt Furie"
                  className="w-[52vmin] sm:w-[40vmin] max-w-sm aspect-square object-cover rounded-[2px]"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Decorative divider */}
          <div
            className="flex items-center gap-3 w-full max-w-[280px]"
            style={{
              animation: "preloader-fade-in 1s ease-out both",
              animationDelay: "1.2s",
            }}
          >
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,160,23,0.4))" }} />
            <img src={SUNFLOWER_SRC} alt="" className="w-5 h-5 object-contain" style={{ opacity: 0.5, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }} draggable={false} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,160,23,0.4))" }} />
          </div>

          {/* Title */}
          <div
            className="text-center"
            style={{
              animation: "preloader-fade-in 1.2s ease-out both",
              animationDelay: "1.5s",
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-wide"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: "#F5DEB3",
                textShadow: "0 2px 16px rgba(212,160,23,0.35), 0 0 40px rgba(212,160,23,0.1)",
              }}
            >
              The Original Sluglord
            </h2>
          </div>

          {/* Subtitle */}
          <div
            className="text-center -mt-2"
            style={{
              animation: "preloader-fade-in 1s ease-out both",
              animationDelay: "2.2s",
            }}
          >
            <p
              className="text-sm sm:text-base tracking-[0.2em] uppercase"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: "rgba(245,222,179,0.45)",
              }}
            >
              Painting by Matt Furie
            </p>
            <p
              className="text-xs sm:text-sm mt-1.5 italic"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: "rgba(245,222,179,0.3)",
              }}
            >
              Owned by the dev
            </p>
          </div>
        </div>
      </div>

      {/* Cinematic vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      <Scene />
      {showPreloader && <Preloader onDone={() => setShowPreloader(false)} />}
    </>
  );
}
