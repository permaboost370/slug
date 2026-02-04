import { useState, useCallback, useEffect } from "react";
import config from "../config";
import Placeholder from "./Placeholder";

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

/** Render an <img> if the asset URL exists, otherwise a Placeholder. */
function Asset({ src, label, dims, format = "PNG transparent", color, className = "", style = {}, imgClass = "", alt = "" }) {
  if (src) {
    return <img src={src} alt={alt} className={`${imgClass || className}`} style={style} draggable={false} />;
  }
  return <Placeholder label={label} dims={dims} format={format} color={color} className={className} style={style} />;
}

/** Seeded random for consistent placement across renders */
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 1 — SUNRISE SKY
   Warm amber→blue gradient fallback, image with slow drift
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

      {/* Drifting cloud shapes (only when no sky image) */}
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
   Soft radial sun orb, top-left, gentle pulse animation
   ═══════════════════════════════════════════════════════════════════ */
function SunGlow() {
  return (
    <div className="absolute z-[2] pointer-events-none" style={{ top: "-18%", left: "-10%", width: "70%", height: "65%" }}>
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
      <Placeholder
        label="SUN GLOW"
        dims="semi-transparent radial"
        color="transparent"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 w-32 h-8"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 3 — DISTANT HILLS (no parallax, warmer positioning)
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
            <Placeholder
              label="DISTANT HILLS"
              dims="1920x600px"
              color="transparent"
              className="border-0"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 4 — MAIN HILLSIDE
   ═══════════════════════════════════════════════════════════════════ */
function MainHill() {
  return (
    <div className="absolute left-0 right-0 bottom-0 z-[4] pointer-events-none">
      {config.assets.hillMain ? (
        <img src={config.assets.hillMain} alt="" className="w-full block" draggable={false} />
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
   SUNFLOWER FIELD — Dense corridor walls on left + right
   Center gap for character path. Flowers face inward toward sun.
   ═══════════════════════════════════════════════════════════════════ */

// Place a flower on the left or right side, avoiding the center corridor
function sidePosition(rng, bandBottomMin, bandBottomMax, gapNarrowness) {
  const r = (min, max) => min + rng() * (max - min);
  // Gap gets narrower further back (perspective). gapNarrowness: 0=wide, 1=narrow
  const gapHalf = 16 - gapNarrowness * 10; // 16% wide at front, ~6% at far back
  const side = rng() < 0.5 ? "left" : "right";
  let left;
  if (side === "left") {
    left = r(-4, 50 - gapHalf);
  } else {
    left = r(50 + gapHalf, 104);
  }
  const tilt = side === "left" ? (8 + r(0, 8)) : (-8 + r(-8, 0)); // lean inward toward center/sun
  return { left: `${left}%`, bottom: `${r(bandBottomMin, bandBottomMax)}%`, tilt, side };
}

function generateSunflowerField() {
  const rng = seededRandom(42);
  const r = (min, max) => min + rng() * (max - min);

  // Band 1 — Far hilltop: tiny, very dimmed, narrow gap
  const far = Array.from({ length: 60 }, () => {
    const pos = sidePosition(rng, 42, 52, 0.9);
    return { ...pos, height: `${r(2, 5)}vh`, sway: r(4.5, 6),
      z: 3, opacity: 0.35, filter: "brightness(0.65) saturate(0.4)" };
  });

  // Band 2 — Upper mid: small, dimmed
  const upperMid = Array.from({ length: 65 }, () => {
    const pos = sidePosition(rng, 36, 44, 0.7);
    return { ...pos, height: `${r(4, 7)}vh`, sway: r(4, 5.5),
      z: 4, opacity: 0.5, filter: "brightness(0.72) saturate(0.5)" };
  });

  // Band 3 — Mid field: medium
  const mid = Array.from({ length: 60 }, () => {
    const pos = sidePosition(rng, 28, 38, 0.5);
    return { ...pos, height: `${r(7, 12)}vh`, sway: r(3.5, 5),
      z: 4, opacity: 0.65, filter: "brightness(0.8) saturate(0.65)" };
  });

  // Band 4 — Lower mid: medium-large, wider gap
  const lowerMid = Array.from({ length: 55 }, () => {
    const pos = sidePosition(rng, 20, 30, 0.3);
    return { ...pos, height: `${r(11, 18)}vh`, sway: r(3.2, 4.8),
      z: 5, opacity: 0.8, filter: "brightness(0.88) saturate(0.8)" };
  });

  // Band 5 — Foreground: large, vivid, widest gap
  const front = Array.from({ length: 50 }, () => {
    const pos = sidePosition(rng, 8, 24, 0.1);
    return { ...pos, height: `${r(18, 32)}vh`, sway: r(3, 4.5),
      z: 6, opacity: 1, filter: "none" };
  });

  return { back: [...far, ...upperMid, ...mid], front: [...lowerMid, ...front] };
}

const sunflowerField = generateSunflowerField();

function SunflowerLayer({ flowers, keyPrefix, placeholderLabel }) {
  if (!config.assets.sunflower) {
    return (
      <div className="absolute z-[4] bottom-[30%] left-[10%] right-[10%] h-[12vh]">
        <Placeholder label={placeholderLabel} dims="field" format="PNG transparent" color="#C4A040" className="w-full h-full" />
      </div>
    );
  }

  return (
    <>
      {flowers.map((s, i) => (
        <div
          key={`${keyPrefix}-${i}`}
          className="absolute aspect-[2/5]"
          style={{
            left: s.left,
            bottom: s.bottom,
            height: s.height,
            zIndex: s.z,
            transform: `rotate(${s.tilt}deg)`,
            transformOrigin: "bottom center",
            animation: `grass-sway ${s.sway}s ease-in-out infinite`,
            opacity: s.opacity,
          }}
        >
          <img
            src={config.assets.sunflower}
            alt=""
            className="w-full h-full object-contain"
            style={{ filter: s.filter }}
            draggable={false}
          />
        </div>
      ))}
    </>
  );
}

function BackSunflowers() {
  return <SunflowerLayer flowers={sunflowerField.back} keyPrefix="back" placeholderLabel="BACK SUNFLOWERS" />;
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 6 — SLUGLORD CHARACTER (with glow halo + ground shadow)
   ═══════════════════════════════════════════════════════════════════ */
function Sluglord() {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      return setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 350);
        timerId = scheduleBlink();
      }, delay);
    };
    let timerId = scheduleBlink();
    return () => clearTimeout(timerId);
  }, []);

  const src = blinking ? config.assets.sluglordBlink : config.assets.sluglordOpen;
  const hasAsset = !!config.assets.sluglordOpen;

  return (
    <div
      className="absolute z-[9]
                 left-1/2 -translate-x-1/2
                 bottom-[6%] sm:bottom-[4%]
                 h-[46vh] sm:h-[52vh] aspect-[4/5]"
    >
      {/* Enlightened glow / halo behind character */}
      <div
        className="absolute -inset-[25%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,210,80,0.35) 0%, rgba(255,180,60,0.15) 40%, transparent 70%)",
          animation: "glow-breathe 8s ease-in-out infinite",
          filter: "blur(12px)",
        }}
      />

      {/* Ground shadow beneath character */}
      <div
        className="absolute bottom-[-4%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "80%", height: "8%" }}
      >
        {config.assets.sluglordShadow ? (
          <img src={config.assets.sluglordShadow} alt="" className="w-full h-full object-contain" draggable={false} />
        ) : (
          <div
            className="w-full h-full rounded-[50%]"
            style={{ backgroundColor: "rgba(0,0,0,0.18)", filter: "blur(6px)" }}
          />
        )}
      </div>

      {/* Character with slower idle animation (8s) */}
      <div
        className="w-full h-full relative"
        style={{ animation: "sluglord-idle 8s ease-in-out infinite", transformOrigin: "bottom center" }}
      >
        {hasAsset ? (
          <img
            src={src || config.assets.sluglordOpen}
            alt="Sluglord"
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35)) brightness(0.95) saturate(0.9)" }}
            draggable={false}
          />
        ) : (
          <Placeholder
            label="SLUGLORD CHARACTER"
            dims="800x1000px"
            format="PNG transparent"
            color="#7BA847"
            className="w-full h-full"
            style={blinking ? { animation: "blink 0.15s ease" } : {}}
          />
        )}
      </div>
    </div>
  );
}

function FrontSunflowers() {
  return <SunflowerLayer flowers={sunflowerField.front} keyPrefix="front" placeholderLabel="FRONT SUNFLOWERS" />;
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 8 — POLLEN PARTICLES (slower drift 10-18s, warmer color)
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
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
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
   LAYER 9 — GOD RAYS (emanate from sun, slower rotation 30s)
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
        {/* Primary ray layer — slower rotation (30s) + pulse */}
        <img
          src={config.assets.godRays}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: "ray-drift 30s ease-in-out infinite, ray-pulse 12s ease-in-out infinite, ray-breathe 18s ease-in-out infinite",
            mixBlendMode: "screen",
            opacity: 0.6,
            transformOrigin: "50% 0%",
          }}
          draggable={false}
        />
        {/* Secondary ray layer — offset timing */}
        <img
          src={config.assets.godRays}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: "ray-drift 35s ease-in-out infinite reverse, ray-pulse 9s ease-in-out infinite, ray-breathe 22s ease-in-out infinite",
            animationDelay: "-6s",
            mixBlendMode: "screen",
            opacity: 0.3,
            transformOrigin: "50% 0%",
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
            width: `${6 + Math.abs(i) * 2}%`,
            height: "170%",
            top: "-35%",
            left: `${50 + i * 12 - 3}%`,
            transform: `rotate(${i * 8}deg)`,
            opacity: 0.22 - Math.abs(i) * 0.03,
            filter: "blur(28px)",
            backgroundColor: "rgba(255,220,140,0.35)",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER 10 — FOREGROUND GRASS (flipped, warmer tones)
   ═══════════════════════════════════════════════════════════════════ */
function ForegroundGrass() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[18%] z-[8] pointer-events-none overflow-hidden">
      {config.assets.grassForeground ? (
        <img src={config.assets.grassForeground} alt="" className="w-full h-full object-cover object-bottom" style={{ transform: "scaleY(-1)" }} draggable={false} />
      ) : (
        <div className="w-full h-full flex items-end">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-full"
              style={{
                height: `${45 + Math.sin(i * 0.7) * 45}%`,
                transformOrigin: "bottom center",
                animation: `grass-sway ${3.0 + (i % 4) * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                backgroundColor: i % 3 === 0 ? "#5A7232" : "#6A8A3A",
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UI — TOKEN NAME + TICKER
   ═══════════════════════════════════════════════════════════════════ */
function TokenTitle() {
  return (
    <div className="absolute z-[10] top-4 sm:top-6 left-1/2 -translate-x-1/2 text-center select-none">
      {config.assets.titleLogo ? (
        <img
          src={config.assets.titleLogo}
          alt={config.tokenName}
          className="w-[60vw] sm:w-[45vw] md:w-[35vw] max-w-md"
          draggable={false}
        />
      ) : (
        <h1
          className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-extrabold leading-none tracking-wide"
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            color: "#6B5344",
            textShadow: "2px 3px 0 rgba(232,184,74,0.35), 0 0 40px rgba(232,184,74,0.12)",
          }}
        >
          {"\uD835\uDCE2\uD835\uDCF5\uD835\uDCFE\uD835\uDCF0\uD835\uDCF5\uD835\uDCF8\uD835\uDCFB\uD835\uDCED"}
        </h1>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UI — WOODEN SIGN STACK (top-right: Lore, Memes, Contract)
   ═══════════════════════════════════════════════════════════════════ */
function SignButton({ label, onClick, className = "" }) {
  if (config.assets.woodenSign) {
    return (
      <div
        className={`relative cursor-pointer hover:scale-105 transition-transform ${className}`}
        onClick={onClick}
      >
        <img src={config.assets.woodenSign} alt="" className="w-36 sm:w-44" draggable={false} />
        <span
          className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold"
          style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5" }}
        >
          {label}
        </span>
      </div>
    );
  }
  return (
    <div
      className={`relative cursor-pointer hover:scale-105 transition-transform rounded-md px-4 py-2 shadow-lg border-2 border-dashed ${className}`}
      style={{ backgroundColor: "rgba(107,83,68,0.88)", borderColor: "rgba(107,83,68,0.5)" }}
      onClick={onClick}
    >
      <span className="text-xs sm:text-sm font-bold" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5" }}>
        {label}
      </span>
    </div>
  );
}

function SignStack({ onOpenModal }) {
  const [toast, setToast] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(config.contractAddress).then(() => {
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    });
  }, []);

  const shortAddr =
    config.contractAddress.length > 16
      ? config.contractAddress.slice(0, 6) + "..." + config.contractAddress.slice(-4)
      : config.contractAddress;

  return (
    <div className="absolute z-[12] top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center gap-1">
      <SignButton label={"\uD835\uDCDB\uD835\uDCF8\uD835\uDCFB\uD835\uDCEE"} onClick={() => onOpenModal("lore")} />
      <SignButton label={"\uD835\uDCDC\uD835\uDCEE\uD835\uDCF6\uD835\uDCEE\uD835\uDCFC"} onClick={() => onOpenModal("memes")} />

      {/* Contract address sign */}
      <div className="relative">
        {toast && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-lg z-10"
            style={{
              backgroundColor: "#5A7A32",
              color: "#FFFEF5",
              animation: "toast-in 1.8s ease forwards",
            }}
          >
            Copied!
          </div>
        )}
        {config.assets.woodenSign ? (
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform"
            onClick={copy}
            title="Click to copy contract address"
          >
            <img src={config.assets.woodenSign} alt="Sign" className="w-36 sm:w-44" draggable={false} />
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold px-2"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5" }}
            >
              {"\uD835\uDCD2\uD835\uDCD0"}
            </span>
          </div>
        ) : (
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform rounded-md px-3 py-2 shadow-lg border-2 border-dashed"
            style={{ backgroundColor: "rgba(107,83,68,0.88)", borderColor: "rgba(107,83,68,0.5)" }}
            onClick={copy}
            title="Click to copy contract address"
          >
            <span
              className="text-xs sm:text-sm font-bold"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5" }}
            >
              {"\uD835\uDCD2\uD835\uDCD0"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UI — SOCIAL ICONS (bottom-left desktop, bottom-center mobile)
   ═══════════════════════════════════════════════════════════════════ */
function SocialLinks() {
  const links = [
    { key: "x",         url: config.socials.x,            icon: "\uD835\uDD4F", assetKey: "iconX",        label: "X" },
    { key: "telegram",  url: config.socials.telegram,     icon: "\u2708",        assetKey: "iconTelegram", label: "TG" },
    { key: "dex",       url: config.socials.dexscreener,  icon: "\uD83D\uDCCA", assetKey: "iconDex",      label: "DEX" },
  ];

  return (
    <div className="absolute z-[10]
                    bottom-[12%] left-4
                    sm:bottom-[6%] sm:left-6
                    max-sm:bottom-[2%] max-sm:left-1/2 max-sm:-translate-x-1/2
                    flex sm:flex-col gap-2.5 sm:gap-3">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
          title={l.label}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-110 transition-transform flex items-center justify-center">
            {config.assets[l.assetKey] ? (
              <img src={config.assets[l.assetKey]} alt={l.label} className="w-full h-full object-contain drop-shadow-md" draggable={false} />
            ) : (
              <span className="text-lg sm:text-xl" style={{ color: "#FFFEF5" }}>{l.icon}</span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MODAL OVERLAY — Fullscreen scenic backdrop with parchment card
   ═══════════════════════════════════════════════════════════════════ */
function ModalOverlay({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[50] flex items-center justify-center"
      style={{ animation: "modal-fade 0.35s ease-out" }}
      onClick={onClose}
    >
      {/* Scene backdrop — sky + hills + warm overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {config.assets.sky ? (
          <img src={config.assets.sky} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #B8D4E3 50%, #D4C5A0 100%)" }} />
        )}
        {config.assets.hillsBackground && (
          <img
            src={config.assets.hillsBackground}
            alt=""
            className="absolute bottom-0 left-0 w-full"
            style={{ opacity: 0.5 }}
            draggable={false}
          />
        )}
        {config.assets.hillMain && (
          <img
            src={config.assets.hillMain}
            alt=""
            className="absolute bottom-0 left-0 w-full"
            style={{ opacity: 0.35 }}
            draggable={false}
          />
        )}
        {/* Warm color wash */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(60,40,20,0.55)" }} />
      </div>

      {/* Decorative sunflowers on left and right edges */}
      {config.assets.sunflower && (
        <>
          <img
            src={config.assets.sunflower} alt=""
            className="absolute bottom-[5%] left-[3%] h-[30vh] sm:h-[40vh] object-contain pointer-events-none hidden sm:block"
            style={{ opacity: 0.3, transform: "rotate(8deg)", filter: "blur(1px)" }}
            draggable={false}
          />
          <img
            src={config.assets.sunflower} alt=""
            className="absolute bottom-[8%] right-[2%] h-[25vh] sm:h-[35vh] object-contain pointer-events-none hidden sm:block"
            style={{ opacity: 0.25, transform: "rotate(-6deg) scaleX(-1)", filter: "blur(1px)" }}
            draggable={false}
          />
        </>
      )}

      {/* Parchment card */}
      <div
        className="relative max-h-[90vh] w-[94vw] max-w-3xl overflow-hidden"
        style={{
          animation: "modal-fade 0.35s ease-out",
          borderRadius: "12px",
          boxShadow: "0 8px 60px rgba(40,25,10,0.6), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,250,230,0.3)",
          border: "3px solid #8B7355",
          background: "linear-gradient(175deg, #F5E6C8 0%, #EDD9B5 30%, #E8CFA5 60%, #DFC494 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139,115,85,0.06) 28px, rgba(139,115,85,0.06) 29px)",
          mixBlendMode: "multiply",
        }} />

        {/* Warm inner shadow edges */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: "inset 0 0 40px rgba(139,115,85,0.15), inset 0 0 80px rgba(139,115,85,0.08)",
        }} />

        {/* Close button — wooden style */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold leading-none cursor-pointer transition-all"
          style={{
            color: "#F5E6C8",
            backgroundColor: "#8B7355",
            border: "2px solid #6B5340",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#6B5340";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#8B7355";
          }}
        >
          &#x2715;
        </button>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto max-h-[90vh] px-8 py-8 sm:px-14 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LORE MODAL — The Sluglord origin story
   ═══════════════════════════════════════════════════════════════════ */
function LoreModal({ onClose }) {
  return (
    <ModalOverlay onClose={onClose}>
      {/* Logo */}
      {config.assets.titleLogo && (
        <div className="flex justify-center mb-5">
          <img
            src={config.assets.titleLogo}
            alt=""
            className="w-48 sm:w-56"
            style={{ filter: "drop-shadow(0 2px 6px rgba(107,83,68,0.3))" }}
            draggable={false}
          />
        </div>
      )}

      {/* Title */}
      <h2
        className="text-xl sm:text-2xl font-bold text-center mb-5"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
      >
        The Legend of Sluglord
      </h2>

      {/* Sluglord character */}
      {config.assets.sluglordOpen && (
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={config.assets.sluglordOpen}
              alt="Sluglord"
              className="h-32 sm:h-40 object-contain relative z-[1]"
              style={{
                filter: "drop-shadow(0 4px 12px rgba(80,50,30,0.35))",
                animation: "sluglord-idle 8s ease-in-out infinite",
                transformOrigin: "bottom center",
              }}
              draggable={false}
            />
            {/* Glow behind character */}
            <div className="absolute inset-0 -m-6 rounded-full pointer-events-none" style={{
              background: "radial-gradient(ellipse at center, rgba(212,160,23,0.15) 0%, transparent 65%)",
            }} />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-7 h-7 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      {/* Story paragraphs */}
      <div
        className="max-w-xl mx-auto space-y-5 text-[15px] sm:text-base leading-[1.85] text-center"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#4A3728" }}
      >
        <p>
          Long before the world knew of Pepe, before the rarest of frogs graced
          the screens of millions, there was a quiet moment on a sun-drenched
          hilltop. Matt Furie, sketchbook in hand, sat among the wild sunflowers
          and let his mind wander.
        </p>
        <p>
          A slug crawled slowly across his shoe. It left a glistening trail in
          the morning dew — unhurried, unbothered, perfectly content. Matt
          watched it for what felt like an hour. The slug didn't care about
          deadlines, clout, or the chaos of the world below the hill. It simply
          <em> was</em>.
        </p>
        <p>
          In that golden light, surrounded by the hum of bees and the rustle of
          petals, an idea crystallised: what if a character could embody that
          same serene, unshakeable calm? A creature so laid-back it borders on
          enlightenment. Not a frog — something even slower, even more
          grounded.
        </p>
        <p>
          Matt opened his sketchbook and drew the first lines of
          <strong style={{ color: "#7B5B3A" }}> Sluglord</strong> — a slug with
          half-lidded eyes, a knowing smile, and a crown of sunflower pollen.
          The legend was born not from hype, but from stillness.
        </p>
      </div>

      {/* Quote */}
      <div
        className="max-w-xl mx-auto mt-7 mb-1 rounded-xl px-5 py-5 text-center"
        style={{
          backgroundColor: "rgba(139,115,85,0.1)",
          border: "1.5px solid rgba(139,115,85,0.2)",
        }}
      >
        <p
          className="text-base sm:text-lg italic leading-relaxed"
          style={{ color: "#6B5340", fontFamily: "'Baloo 2', sans-serif" }}
        >
          "Slow is smooth, and smooth is fast."
        </p>
        <p className="text-[11px] mt-2 tracking-widest uppercase font-semibold" style={{ color: "#8B7355" }}>
          The Sluglord Way
        </p>
      </div>
    </ModalOverlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MEME GALLERY — Placeholder grid for future meme images
   ═══════════════════════════════════════════════════════════════════ */
function MemeGallery({ onClose }) {
  const memes = config.content?.memes || [];
  const slots = memes.length > 0 ? memes : Array.from({ length: 6 }, (_, i) => ({ placeholder: true, index: i + 1 }));

  return (
    <ModalOverlay onClose={onClose}>
      {/* Logo */}
      {config.assets.titleLogo && (
        <div className="flex justify-center mb-5">
          <img
            src={config.assets.titleLogo}
            alt=""
            className="w-48 sm:w-56"
            style={{ filter: "drop-shadow(0 2px 6px rgba(107,83,68,0.3))" }}
            draggable={false}
          />
        </div>
      )}

      {/* Title */}
      <h2
        className="text-xl sm:text-2xl font-bold text-center mb-1"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
      >
        Memes
      </h2>
      <p className="text-center text-xs sm:text-sm mb-6" style={{ color: "#8B7355", fontFamily: "'Baloo 2', sans-serif" }}>
        The finest Sluglord collection
      </p>

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-7 h-7 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      {/* Grid */}
      <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {slots.map((item, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl flex items-center justify-center overflow-hidden transition-transform hover:scale-[1.03]"
            style={{
              border: item.placeholder ? "2px dashed rgba(139,115,85,0.25)" : "2px solid rgba(139,115,85,0.2)",
              backgroundColor: item.placeholder ? "rgba(139,115,85,0.06)" : "transparent",
              boxShadow: item.placeholder ? "none" : "0 2px 8px rgba(80,50,30,0.15)",
            }}
          >
            {item.placeholder ? (
              <div className="flex flex-col items-center gap-2">
                {config.assets.sunflower && (
                  <img
                    src={config.assets.sunflower}
                    alt=""
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    style={{ opacity: 0.2 }}
                    draggable={false}
                  />
                )}
                <span
                  className="text-[10px] sm:text-xs tracking-wider font-medium"
                  style={{ color: "rgba(139,115,85,0.4)", fontFamily: "'Baloo 2', sans-serif" }}
                >
                  MEME {item.index}
                </span>
              </div>
            ) : (
              <img src={item.url} alt={item.alt || `Meme ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
            )}
          </div>
        ))}
      </div>
      <div className="h-4" />
    </ModalOverlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Main composition (The Hilltop Moment)
   ═══════════════════════════════════════════════════════════════════ */
export default function Scene() {
  const [modalOpen, setModalOpen] = useState(null);

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        {/* Landscape layers (back to front) */}
        <SunriseSky />
        <SunGlow />
        <DistantHills />
        <MainHill />
        <BackSunflowers />
        <Sluglord />
        <FrontSunflowers />
        <Pollen />
        <GodRays />
        <ForegroundGrass />

        {/* UI overlay */}
        <TokenTitle />
        <SignStack onOpenModal={setModalOpen} />
        <SocialLinks />
      </div>

      {/* Modals */}
      {modalOpen === "lore" && <LoreModal onClose={() => setModalOpen(null)} />}
      {modalOpen === "memes" && <MemeGallery onClose={() => setModalOpen(null)} />}
    </>
  );
}
