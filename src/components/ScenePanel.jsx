import { useState, useEffect } from "react";
import config from "../config";
import useScreenSize from "../hooks/useScreenSize";
import Placeholder from "./Placeholder";

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function Asset({ src, label, dims, format = "PNG transparent", color, className = "", style = {}, imgClass = "", alt = "" }) {
  if (src) {
    return <img src={src} alt={alt} className={`${imgClass || className}`} style={style} draggable={false} />;
  }
  return <Placeholder label={label} dims={dims} format={format} color={color} className={className} style={style} />;
}

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function scaleHeight(h, factor) {
  const match = h.match(/([\d.]+)(vh)/);
  return match ? `${(parseFloat(match[1]) * factor).toFixed(1)}vh` : h;
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 1 — SUNRISE SKY
   ═══════════════════════════════════════════════════════════════════ */
function SunriseSky() {
  return (
    <>
      <div className="absolute inset-0 z-[1]">
        {config.assets.sky ? (
          <img
            src={config.assets.sky}
            alt=""
            className="w-full h-full object-cover"
            style={{ animation: "sky-drift 56s ease-in-out infinite", scale: "1.05" }}
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "radial-gradient(ellipse at 50% 30%, #FFF0B0 0%, #F5C463 20%, #E8A838 40%, #D4A574 60%, #6B8FBF 100%)" }}
          />
        )}
      </div>

      {!config.assets.sky && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
          {[
            { top: "6%",  w: "18%", h: "7%",  dur: "80s", delay: "0s"    },
            { top: "13%", w: "12%", h: "5%",  dur: "80s", delay: "-28s"  },
            { top: "4%",  w: "15%", h: "6%",  dur: "80s", delay: "-56s"  },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: c.top,
                left: "40%",
                width: c.w,
                height: c.h,
                backgroundColor: "rgba(255,220,180,0.4)",
                animation: `cloud-drift ${c.dur} ease-in-out infinite alternate`,
                animationDelay: c.delay,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 2 — SUN GLOW
   ═══════════════════════════════════════════════════════════════════ */
function SunGlow() {
  return (
    <div className="absolute z-[2] pointer-events-none" style={{ top: "-18%", left: "-10%", width: "70%", height: "65%" }}>
      <div
        className="absolute inset-[-20%] rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 55%, rgba(255,220,100,0.3) 0%, rgba(255,180,60,0.12) 35%, transparent 65%)",
          animation: "sun-halo 14s ease-in-out infinite",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute inset-[10%] rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 55%, rgba(255,245,180,0.25) 0%, rgba(255,210,80,0.1) 40%, transparent 60%)",
          animation: "sun-flare 8s ease-in-out infinite",
          filter: "blur(12px)",
        }}
      />
      {config.assets.sunGlow ? (
        <img
          src={config.assets.sunGlow}
          alt=""
          className="w-full h-full object-contain"
          style={{ animation: "sun-pulse 10s ease-in-out infinite" }}
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 55%, rgba(255,240,140,0.8) 0%, rgba(255,210,80,0.4) 30%, rgba(255,180,60,0.15) 55%, transparent 72%)",
            animation: "sun-pulse 10s ease-in-out infinite",
            filter: "blur(18px)",
          }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 3 — DISTANT HILLS
   ═══════════════════════════════════════════════════════════════════ */
function DistantHills() {
  return (
    <div className="absolute left-0 right-0 bottom-[18%] z-[3] pointer-events-none">
      {config.assets.hillsBackground ? (
        <img src={config.assets.hillsBackground} alt="" className="w-full" draggable={false} />
      ) : (
        <div className="w-full h-full relative">
          <div
            className="absolute bottom-0 left-[-3%] right-[-3%] h-[85%]"
            style={{ backgroundColor: "#A8B878", borderRadius: "45% 55% 0 0 / 100% 100% 0 0" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Placeholder label="DISTANT HILLS" dims="1920x600px" color="transparent" className="border-0" style={{ backgroundColor: "transparent" }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 3.5 — ATMOSPHERIC HAZE
   ═══════════════════════════════════════════════════════════════════ */
function AtmosphericHaze() {
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none max-sm:opacity-50">
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "18%", height: "35%",
          background: "linear-gradient(to top, rgba(232,184,74,0.12), rgba(232,184,74,0.04) 40%, transparent)",
          animation: "haze-drift 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "30%", height: "25%",
          background: "linear-gradient(to top, rgba(107,143,191,0.08), rgba(107,143,191,0.03) 50%, transparent)",
          animation: "haze-drift 28s ease-in-out infinite",
          animationDelay: "-6s",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "15%", height: "30%",
          background: "radial-gradient(ellipse at 30% 80%, rgba(232,184,74,0.1) 0%, transparent 60%)",
          animation: "haze-drift 20s ease-in-out infinite",
          animationDelay: "-10s",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 4 — MAIN HILLSIDE (with blink effect)
   ═══════════════════════════════════════════════════════════════════ */
function MainHill() {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!config.assets.hillMainOpen || !config.assets.hillMainBlink) return;
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 2000;
      return setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 400);
        timerId = scheduleBlink();
      }, delay);
    };
    let timerId = scheduleBlink();
    return () => clearTimeout(timerId);
  }, []);

  const hasBlinkAssets = config.assets.hillMainOpen && config.assets.hillMainBlink;
  const hillSrc = hasBlinkAssets
    ? (blinking ? config.assets.hillMainBlink : config.assets.hillMainOpen)
    : config.assets.hillMain;

  return (
    <div className="absolute left-0 right-0 bottom-0 z-[4] pointer-events-none max-sm:scale-[1.45] max-sm:origin-bottom">
      {hillSrc ? (
        <img src={hillSrc} alt="" className="w-full block" draggable={false} />
      ) : (
        <div className="h-[55vh] relative overflow-hidden">
          <div
            className="absolute -top-[15%] left-[-4%] right-[-4%] h-[45%]"
            style={{ backgroundColor: "#8DB255", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
          />
          <div className="absolute top-[18%] left-0 right-0 bottom-0" style={{ backgroundColor: "#5A7A32" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] sm:text-xs text-black/25 font-mono border-2 border-dashed border-black/15 px-3 py-1 rounded" style={{ backgroundColor: "rgba(141,178,85,0.35)" }}>
              MAIN HILLSIDE | 1920x800px | PNG
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUNFLOWER FIELD
   ═══════════════════════════════════════════════════════════════════ */

function sidePosition(rng, bandBottomMin, bandBottomMax, gapNarrowness, forceSide = null) {
  const r = (min, max) => min + rng() * (max - min);
  const gapHalf = 16 - gapNarrowness * 8;
  const side = forceSide || (rng() < 0.5 ? "left" : "right");
  let left;
  if (side === "left") {
    left = r(-8, 50 - gapHalf - 3);
  } else {
    left = r(50 + gapHalf + 3, 108);
  }
  const tilt = side === "left" ? r(-3, 5) : r(-5, 3);
  return { left: `${left}%`, bottom: `${r(bandBottomMin, bandBottomMax)}%`, tilt, side };
}

function generateSunflowerField() {
  const rng = seededRandom(42);
  const r = (min, max) => min + rng() * (max - min);

  const horizon = Array.from({ length: 200 }, () => {
    const pos = sidePosition(rng, 58, 66, 0.99);
    return { ...pos, height: `${r(0.5, 1.5)}vh`, sway: r(6, 8), z: 2, opacity: 0.2, filter: "brightness(0.5) saturate(0.25)" };
  });
  const veryFar = Array.from({ length: 180 }, () => {
    const pos = sidePosition(rng, 54, 62, 0.98);
    return { ...pos, height: `${r(1, 2.5)}vh`, sway: r(5, 7), z: 3, opacity: 0.25, filter: "brightness(0.55) saturate(0.3)" };
  });
  const far = Array.from({ length: 160 }, () => {
    const pos = sidePosition(rng, 48, 56, 0.95);
    return { ...pos, height: `${r(1.5, 4)}vh`, sway: r(5, 7), z: 3, opacity: 0.3, filter: "brightness(0.6) saturate(0.35)" };
  });
  const upperMid = Array.from({ length: 150 }, () => {
    const pos = sidePosition(rng, 40, 48, 0.85);
    return { ...pos, height: `${r(3, 6)}vh`, sway: r(4.5, 6), z: 3, opacity: 0.4, filter: "brightness(0.65) saturate(0.45)" };
  });
  const mid = Array.from({ length: 130 }, () => {
    const pos = sidePosition(rng, 32, 42, 0.65);
    return { ...pos, height: `${r(5, 10)}vh`, sway: r(4, 5.5), z: 4, opacity: 0.55, filter: "brightness(0.75) saturate(0.6)" };
  });
  const lowerMid = Array.from({ length: 110 }, () => {
    const pos = sidePosition(rng, 24, 34, 0.45);
    return { ...pos, height: `${r(9, 16)}vh`, sway: r(3.5, 5), z: 5, opacity: 0.75, filter: "brightness(0.85) saturate(0.75)" };
  });
  const nearFront = Array.from({ length: 90 }, () => {
    const pos = sidePosition(rng, 14, 26, 0.25);
    return { ...pos, height: `${r(14, 24)}vh`, sway: r(3, 4.5), z: 5, opacity: 0.9, filter: "brightness(0.92) saturate(0.85)" };
  });
  const front = Array.from({ length: 70 }, () => {
    const pos = sidePosition(rng, 4, 18, 0.1);
    return { ...pos, height: `${r(22, 38)}vh`, sway: r(2.8, 4), z: 6, opacity: 1, filter: "none" };
  });
  const edgeLeft = Array.from({ length: 50 }, () => {
    const bottom = r(8, 55);
    const progress = bottom / 55;
    return {
      left: `${r(-12, 12)}%`, bottom: `${bottom}%`, height: `${2 + (1 - progress) * 28}vh`,
      tilt: r(-2, 4), side: "left", sway: r(3, 5), z: progress < 0.4 ? 6 : 4,
      opacity: 0.3 + (1 - progress) * 0.7,
      filter: progress > 0.6 ? "brightness(0.65) saturate(0.45)" : "none"
    };
  });
  const edgeRight = Array.from({ length: 50 }, () => {
    const bottom = r(8, 55);
    const progress = bottom / 55;
    return {
      left: `${r(88, 112)}%`, bottom: `${bottom}%`, height: `${2 + (1 - progress) * 28}vh`,
      tilt: r(-4, 2), side: "right", sway: r(3, 5), z: progress < 0.4 ? 6 : 4,
      opacity: 0.3 + (1 - progress) * 0.7,
      filter: progress > 0.6 ? "brightness(0.65) saturate(0.45)" : "none"
    };
  });

  return {
    back: [...horizon, ...veryFar, ...far, ...upperMid, ...mid],
    front: [...lowerMid, ...nearFront, ...front, ...edgeLeft, ...edgeRight]
  };
}

const sunflowerField = generateSunflowerField();

function SunflowerLayer({ flowers, keyPrefix, placeholderLabel }) {
  const size = useScreenSize();
  const step = size === "mobile" ? 4 : size === "tablet" ? 2 : 1;
  const heightScale = size === "mobile" ? 0.6 : size === "tablet" ? 0.8 : 1;
  const filtered = step === 1 ? flowers : flowers.filter((_, i) => i % step === 0);

  if (!config.assets.sunflower) {
    return (
      <div className="absolute z-[4] bottom-[30%] left-[10%] right-[10%] h-[12vh]">
        <Placeholder label={placeholderLabel} dims="field" format="PNG transparent" color="#C4A040" className="w-full h-full" />
      </div>
    );
  }

  return (
    <>
      {filtered.map((s, i) => (
        <div
          key={`${keyPrefix}-${i}`}
          className="absolute aspect-[2/5]"
          style={{
            left: s.left, bottom: s.bottom, height: scaleHeight(s.height, heightScale),
            zIndex: s.z, transform: `rotate(${s.tilt}deg)`, transformOrigin: "bottom center",
            animation: `grass-sway ${s.sway}s ease-in-out infinite`, opacity: s.opacity,
          }}
        >
          <img src={config.assets.sunflower} alt="" className="w-full h-full object-contain" style={{ filter: s.filter }} draggable={false} />
        </div>
      ))}
    </>
  );
}

function FrontSunflowers() {
  return <SunflowerLayer flowers={sunflowerField.front} keyPrefix="front" placeholderLabel="FRONT SUNFLOWERS" />;
}

/* ═══════════════════════════════════════════════════════════════════
   FOREGROUND SUNFLOWERS
   ═══════════════════════════════════════════════════════════════════ */
const foregroundFlowers = [
  { left: "-3%", bottom: "-8%", height: "38vh", tilt: 8, sway: 3.2, z: 10 },
  { left: "2%", bottom: "-5%", height: "32vh", tilt: 12, sway: 3.5, z: 10 },
  { left: "-5%", bottom: "-4%", height: "28vh", tilt: 5, sway: 3.8, z: 9 },
  { left: "6%", bottom: "-7%", height: "35vh", tilt: 10, sway: 3.3, z: 10 },
  { left: "1%", bottom: "-2%", height: "24vh", tilt: 7, sway: 4.0, z: 9 },
  { left: "9%", bottom: "-6%", height: "30vh", tilt: 14, sway: 3.6, z: 10 },
  { left: "-2%", bottom: "0%", height: "22vh", tilt: 6, sway: 4.2, z: 9 },
  { left: "4%", bottom: "-3%", height: "27vh", tilt: 9, sway: 3.7, z: 9 },
  { left: "11%", bottom: "-8%", height: "33vh", tilt: 11, sway: 3.4, z: 10 },
  { left: "7%", bottom: "1%", height: "20vh", tilt: 8, sway: 4.1, z: 8 },
  { left: "13%", bottom: "-6%", height: "29vh", tilt: 13, sway: 3.5, z: 10 },
  { left: "-6%", bottom: "-6%", height: "34vh", tilt: 4, sway: 3.3, z: 10 },
  { left: "5%", bottom: "3%", height: "18vh", tilt: 10, sway: 4.3, z: 8 },
  { left: "14%", bottom: "-4%", height: "25vh", tilt: 15, sway: 3.8, z: 9 },
  { left: "0%", bottom: "5%", height: "16vh", tilt: 6, sway: 4.5, z: 7 },
  { left: "16%", bottom: "-5%", height: "28vh", tilt: 12, sway: 3.6, z: 9 },
  { left: "10%", bottom: "2%", height: "17vh", tilt: 9, sway: 4.4, z: 7 },
  { left: "-8%", bottom: "-10%", height: "40vh", tilt: 3, sway: 3.1, z: 10 },
  { left: "8%", bottom: "-9%", height: "36vh", tilt: 16, sway: 3.3, z: 10 },
  { left: "18%", bottom: "-7%", height: "26vh", tilt: 11, sway: 3.7, z: 9 },
  { left: "-4%", bottom: "2%", height: "20vh", tilt: 7, sway: 4.2, z: 8 },
  { left: "12%", bottom: "-3%", height: "23vh", tilt: 13, sway: 3.9, z: 9 },
  { left: "3%", bottom: "-10%", height: "37vh", tilt: 6, sway: 3.2, z: 10 },
  { left: "15%", bottom: "0%", height: "19vh", tilt: 10, sway: 4.1, z: 8 },
  { left: "-7%", bottom: "-3%", height: "30vh", tilt: 4, sway: 3.5, z: 10 },
  { left: "20%", bottom: "-5%", height: "22vh", tilt: 14, sway: 3.8, z: 9 },
  { left: "94%", bottom: "-8%", height: "36vh", tilt: -10, sway: 3.4, z: 10 },
  { left: "98%", bottom: "-4%", height: "30vh", tilt: -8, sway: 3.6, z: 10 },
  { left: "91%", bottom: "-6%", height: "33vh", tilt: -12, sway: 3.2, z: 10 },
  { left: "96%", bottom: "-2%", height: "26vh", tilt: -6, sway: 3.9, z: 9 },
  { left: "100%", bottom: "-7%", height: "34vh", tilt: -5, sway: 3.5, z: 10 },
  { left: "88%", bottom: "-5%", height: "31vh", tilt: -14, sway: 3.5, z: 10 },
  { left: "102%", bottom: "0%", height: "23vh", tilt: -7, sway: 4.0, z: 9 },
  { left: "93%", bottom: "-3%", height: "28vh", tilt: -9, sway: 3.7, z: 9 },
  { left: "86%", bottom: "-7%", height: "34vh", tilt: -11, sway: 3.3, z: 10 },
  { left: "90%", bottom: "1%", height: "21vh", tilt: -8, sway: 4.2, z: 8 },
  { left: "84%", bottom: "-4%", height: "29vh", tilt: -13, sway: 3.5, z: 10 },
  { left: "104%", bottom: "-5%", height: "32vh", tilt: -4, sway: 3.4, z: 10 },
  { left: "92%", bottom: "2%", height: "19vh", tilt: -10, sway: 4.3, z: 8 },
  { left: "82%", bottom: "-6%", height: "26vh", tilt: -15, sway: 3.7, z: 9 },
  { left: "97%", bottom: "4%", height: "17vh", tilt: -6, sway: 4.4, z: 7 },
  { left: "80%", bottom: "-3%", height: "27vh", tilt: -12, sway: 3.6, z: 9 },
  { left: "87%", bottom: "3%", height: "18vh", tilt: -9, sway: 4.5, z: 7 },
  { left: "106%", bottom: "-9%", height: "38vh", tilt: -3, sway: 3.1, z: 10 },
  { left: "89%", bottom: "-10%", height: "35vh", tilt: -16, sway: 3.3, z: 10 },
  { left: "78%", bottom: "-5%", height: "25vh", tilt: -11, sway: 3.7, z: 9 },
  { left: "101%", bottom: "1%", height: "21vh", tilt: -7, sway: 4.2, z: 8 },
  { left: "85%", bottom: "-8%", height: "32vh", tilt: -14, sway: 3.4, z: 10 },
  { left: "95%", bottom: "-10%", height: "37vh", tilt: -6, sway: 3.2, z: 10 },
  { left: "83%", bottom: "0%", height: "19vh", tilt: -10, sway: 4.1, z: 8 },
  { left: "76%", bottom: "-4%", height: "24vh", tilt: -13, sway: 3.8, z: 9 },
  { left: "99%", bottom: "-6%", height: "29vh", tilt: -5, sway: 3.5, z: 10 },
];

function ForegroundSunflowers() {
  const size = useScreenSize();
  if (!config.assets.sunflower) return null;

  const step = size === "mobile" ? 3 : size === "tablet" ? 2 : 1;
  const heightScale = size === "mobile" ? 0.55 : size === "tablet" ? 0.8 : 1;
  const filtered = step === 1 ? foregroundFlowers : foregroundFlowers.filter((_, i) => i % step === 0);

  return (
    <>
      {filtered.map((s, i) => (
        <div
          key={`fg-sunflower-${i}`}
          className="absolute aspect-[2/5]"
          style={{
            left: s.left, bottom: s.bottom, height: scaleHeight(s.height, heightScale),
            zIndex: s.z, transform: `rotate(${s.tilt}deg)`, transformOrigin: "bottom center",
            animation: `grass-sway ${s.sway}s ease-in-out infinite`,
          }}
        >
          <img
            src={config.assets.sunflower} alt="" loading="lazy"
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
            draggable={false}
          />
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   POLLEN PARTICLES
   ═══════════════════════════════════════════════════════════════════ */
const pollenParticles = Array.from({ length: 20 }, (_, i) => ({
  left: `${5 + Math.random() * 90}%`,
  bottom: `${10 + Math.random() * 50}%`,
  size: 2 + Math.random() * 3,
  duration: 10 + Math.random() * 8,
  delay: Math.random() * 14,
}));

function Pollen() {
  return (
    <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
      {pollenParticles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left, bottom: p.bottom, width: p.size, height: p.size,
            backgroundColor: "rgba(255,220,160,0.7)",
            animation: `pollen-float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GOD RAYS
   ═══════════════════════════════════════════════════════════════════ */
function GodRays() {
  if (config.assets.godRays) {
    return (
      <div
        className="absolute inset-0 z-[7] pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 70%)",
        }}
      >
        <img
          src={config.assets.godRays} alt="" loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: "ray-drift 30s ease-in-out infinite, ray-pulse 12s ease-in-out infinite, ray-breathe 18s ease-in-out infinite",
            mixBlendMode: "screen", opacity: 0.6, transformOrigin: "50% 0%",
          }}
          draggable={false}
        />
        <img
          src={config.assets.godRays} alt="" loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: "ray-drift 35s ease-in-out infinite reverse, ray-pulse 9s ease-in-out infinite, ray-breathe 22s ease-in-out infinite",
            animationDelay: "-6s", mixBlendMode: "screen", opacity: 0.3, transformOrigin: "50% 0%",
          }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-[7] pointer-events-none overflow-hidden"
      style={{ animation: "ray-pulse 12s ease-in-out infinite" }}
    >
      {[-2, -1, 0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: `${6 + Math.abs(i) * 2}%`, height: "170%", top: "-35%",
            left: `${50 + i * 12 - 3}%`, transform: `rotate(${i * 8}deg)`,
            opacity: 0.22 - Math.abs(i) * 0.03, filter: "blur(28px)",
            backgroundColor: "rgba(255,220,140,0.35)",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOREGROUND GRASS
   ═══════════════════════════════════════════════════════════════════ */
function ForegroundGrass() {
  if (!config.assets.grassForeground) return null;
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[18%] z-[8] pointer-events-none overflow-hidden">
      <img src={config.assets.grassForeground} alt="" className="w-full h-full object-cover object-bottom" style={{ transform: "scaleY(-1)" }} draggable={false} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CINEMATIC VIGNETTE
   ═══════════════════════════════════════════════════════════════════ */
function CinematicVignette() {
  return (
    <div
      className="absolute inset-0 z-[11] pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE PANEL — Pure visual scene (no UI overlay)
   ═══════════════════════════════════════════════════════════════════ */
export default function ScenePanel() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <SunriseSky />
      <SunGlow />
      <DistantHills />
      <AtmosphericHaze />
      <MainHill />
      <ForegroundSunflowers />
      <Pollen />
      <GodRays />
      <ForegroundGrass />
      <CinematicVignette />
    </div>
  );
}
