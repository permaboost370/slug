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

/** Detect screen size for responsive rendering */
function useScreenSize() {
  const [size, setSize] = useState(() => {
    const w = window.innerWidth;
    return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSize(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
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

      {/* Warm wash to kill blue tones in the sky gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(230,175,120,0.55) 0%, rgba(235,185,115,0.5) 35%, rgba(225,170,100,0.45) 60%, rgba(210,160,90,0.2) 85%, transparent 100%)" }}
      />

      {/* Golden hour clouds overlay (screen blend makes black bg transparent) */}
      {config.assets.clouds && (
        <>
          {/* Primary clouds — upper sky */}
          <div className="absolute z-[2] pointer-events-none" style={{ top: "-15%", left: "-10%", right: "-10%", bottom: "-40%" }}>
            <img
              src={config.assets.clouds}
              alt=""
              className="w-full h-full object-cover"
              style={{
                mixBlendMode: "screen",
                opacity: 0.9,
                objectPosition: "center 85%",
                animation: "sky-drift 70s ease-in-out infinite",
                scale: "1.25",
              }}
              draggable={false}
            />
          </div>
          {/* Secondary clouds — fills mid-sky gap, flipped & offset */}
          <div className="absolute z-[2] pointer-events-none" style={{ top: "15%", left: "-10%", right: "-10%", bottom: "-60%" }}>
            <img
              src={config.assets.clouds}
              alt=""
              className="w-full h-full object-cover"
              style={{
                mixBlendMode: "screen",
                opacity: 0.55,
                objectPosition: "center 90%",
                transform: "scaleX(-1)",
                animation: "sky-drift 90s ease-in-out infinite reverse",
                scale: "1.3",
              }}
              draggable={false}
            />
          </div>
        </>
      )}

      {/* Drifting cloud shapes (only when no sky or cloud image) */}
      {!config.assets.sky && !config.assets.clouds && (
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
   LAYER 4 — MAIN HILLSIDE (with integrated character + blink effect)
   ═══════════════════════════════════════════════════════════════════ */
function MainHill() {
  const [blinking, setBlinking] = useState(false);

  // Blink effect - only when we have both open/blink assets
  useEffect(() => {
    if (!config.assets.hillMainOpen || !config.assets.hillMainBlink) return;

    console.log("Blink effect initialized - open:", config.assets.hillMainOpen, "blink:", config.assets.hillMainBlink);

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 2000; // Blink every 2-4 seconds
      return setTimeout(() => {
        console.log("Blinking!");
        setBlinking(true);
        setTimeout(() => setBlinking(false), 400); // Blink lasts 400ms
        timerId = scheduleBlink();
      }, delay);
    };
    let timerId = scheduleBlink();
    return () => clearTimeout(timerId);
  }, []);

  // Use new assets with blink effect if available, otherwise fallback
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
   SUNFLOWER FIELD — Dense corridor walls on left + right
   Center gap for character path. Flowers face inward toward sun.
   ═══════════════════════════════════════════════════════════════════ */

// Place a flower on the left or right side, creating dense walls along the road
function sidePosition(rng, bandBottomMin, bandBottomMax, gapNarrowness, forceSide = null) {
  const r = (min, max) => min + rng() * (max - min);
  // Keep flowers OFF the road - wider gap especially on left
  const gapHalf = 16 - gapNarrowness * 8; // 16% at front, ~8% at far back
  const side = forceSide || (rng() < 0.5 ? "left" : "right");
  let left;
  if (side === "left") {
    // Left side - stay well clear of road
    left = r(-8, 50 - gapHalf - 3);
  } else {
    // Right side - stay clear of road
    left = r(50 + gapHalf + 3, 108);
  }
  // Slight tilt variation for natural look
  const tilt = side === "left" ? r(-3, 5) : r(-5, 3);
  return { left: `${left}%`, bottom: `${r(bandBottomMin, bandBottomMax)}%`, tilt, side };
}

function generateSunflowerField() {
  const rng = seededRandom(42);
  const r = (min, max) => min + rng() * (max - min);

  // DENSE FIELD - Many flowers, tightly packed, going all the way back

  // Band 0 — Horizon line: tiniest dots at the very back
  const horizon = Array.from({ length: 200 }, () => {
    const pos = sidePosition(rng, 58, 66, 0.99);
    return { ...pos, height: `${r(0.5, 1.5)}vh`, sway: r(6, 8),
      z: 2, opacity: 0.2, filter: "brightness(0.5) saturate(0.25)" };
  });

  // Band 1 — Very far distance: tiny dots
  const veryFar = Array.from({ length: 180 }, () => {
    const pos = sidePosition(rng, 54, 62, 0.98);
    return { ...pos, height: `${r(1, 2.5)}vh`, sway: r(5, 7),
      z: 3, opacity: 0.25, filter: "brightness(0.55) saturate(0.3)" };
  });

  // Band 2 — Far distance: tiny, dimmed, dense
  const far = Array.from({ length: 160 }, () => {
    const pos = sidePosition(rng, 48, 56, 0.95);
    return { ...pos, height: `${r(1.5, 4)}vh`, sway: r(5, 7),
      z: 3, opacity: 0.3, filter: "brightness(0.6) saturate(0.35)" };
  });

  // Band 3 — Upper mid distance: small, dimmed
  const upperMid = Array.from({ length: 150 }, () => {
    const pos = sidePosition(rng, 40, 48, 0.85);
    return { ...pos, height: `${r(3, 6)}vh`, sway: r(4.5, 6),
      z: 3, opacity: 0.4, filter: "brightness(0.65) saturate(0.45)" };
  });

  // Band 4 — Mid field: medium size
  const mid = Array.from({ length: 130 }, () => {
    const pos = sidePosition(rng, 32, 42, 0.65);
    return { ...pos, height: `${r(5, 10)}vh`, sway: r(4, 5.5),
      z: 4, opacity: 0.55, filter: "brightness(0.75) saturate(0.6)" };
  });

  // Band 5 — Lower mid: medium-large
  const lowerMid = Array.from({ length: 110 }, () => {
    const pos = sidePosition(rng, 24, 34, 0.45);
    return { ...pos, height: `${r(9, 16)}vh`, sway: r(3.5, 5),
      z: 5, opacity: 0.75, filter: "brightness(0.85) saturate(0.75)" };
  });

  // Band 6 — Near foreground: large
  const nearFront = Array.from({ length: 90 }, () => {
    const pos = sidePosition(rng, 14, 26, 0.25);
    return { ...pos, height: `${r(14, 24)}vh`, sway: r(3, 4.5),
      z: 5, opacity: 0.9, filter: "brightness(0.92) saturate(0.85)" };
  });

  // Band 7 — Foreground: largest, vivid
  const front = Array.from({ length: 70 }, () => {
    const pos = sidePosition(rng, 4, 18, 0.1);
    return { ...pos, height: `${r(22, 38)}vh`, sway: r(2.8, 4),
      z: 6, opacity: 1, filter: "none" };
  });

  // Extra edge flowers on far left - pack the left edge but away from road
  const edgeLeft = Array.from({ length: 50 }, () => {
    const bottom = r(8, 55);
    const progress = bottom / 55;
    return {
      left: `${r(-12, 12)}%`,
      bottom: `${bottom}%`,
      height: `${2 + (1 - progress) * 28}vh`,
      tilt: r(-2, 4),
      side: "left",
      sway: r(3, 5),
      z: progress < 0.4 ? 6 : 4,
      opacity: 0.3 + (1 - progress) * 0.7,
      filter: progress > 0.6 ? "brightness(0.65) saturate(0.45)" : "none"
    };
  });

  // Extra edge flowers on far right - pack the right edge
  const edgeRight = Array.from({ length: 50 }, () => {
    const bottom = r(8, 55);
    const progress = bottom / 55;
    return {
      left: `${r(88, 112)}%`,
      bottom: `${bottom}%`,
      height: `${2 + (1 - progress) * 28}vh`,
      tilt: r(-4, 2),
      side: "right",
      sway: r(3, 5),
      z: progress < 0.4 ? 6 : 4,
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
                 bottom-[-4%] sm:bottom-[-6%] md:bottom-[-8%] lg:bottom-[-10%]
                 h-[55vh] sm:h-[62vh] md:h-[68vh] lg:h-[72vh] aspect-[4/5]"
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

      {/* Ground shadow beneath character - helps blend with paved road */}
      <div
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "90%", height: "15%" }}
      >
        {config.assets.sluglordShadow ? (
          <img src={config.assets.sluglordShadow} alt="" className="w-full h-full object-contain" draggable={false} />
        ) : (
          <div
            className="w-full h-full rounded-[50%]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 80%)",
              filter: "blur(6px)"
            }}
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
   FOREGROUND SUNFLOWERS — Animated flowers framing the scene
   Large sunflowers on left/right edges for depth and movement
   ═══════════════════════════════════════════════════════════════════ */
const foregroundFlowers = [
  // Left side - large foreground flowers (lowered to ground)
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

  // Right side - large foreground flowers (lowered to ground)
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
];

function ForegroundSunflowers() {
  const size = useScreenSize();
  if (!config.assets.sunflower) return null;

  const step = size === "mobile" ? 3 : size === "tablet" ? 2 : 1;
  const filtered = step === 1 ? foregroundFlowers : foregroundFlowers.filter((_, i) => i % step === 0);

  return (
    <>
      {filtered.map((s, i) => (
        <div
          key={`fg-sunflower-${i}`}
          className="absolute aspect-[2/5]"
          style={{
            left: s.left,
            bottom: s.bottom,
            height: s.height,
            zIndex: s.z,
            transform: `rotate(${s.tilt}deg)`,
            transformOrigin: "bottom center",
            animation: `grass-sway ${s.sway}s ease-in-out infinite`,
          }}
        >
          <img
            src={config.assets.sunflower}
            alt=""
            loading="lazy"
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
          loading="lazy"
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
          loading="lazy"
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
  // Only render if grass asset exists
  if (!config.assets.grassForeground) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[18%] z-[8] pointer-events-none overflow-hidden">
      <img src={config.assets.grassForeground} alt="" className="w-full h-full object-cover object-bottom" style={{ transform: "scaleY(-1)" }} draggable={false} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UI — TOKEN NAME + TICKER
   ═══════════════════════════════════════════════════════════════════ */
function TokenTitle() {
  return (
    <div className="absolute z-[10] top-2 sm:top-6 left-1/2 -translate-x-1/2 text-center select-none">
      {config.assets.titleLogo ? (
        <img
          src={config.assets.titleLogo}
          alt={config.tokenName}
          className="w-[50vw] sm:w-[45vw] md:w-[35vw] max-w-md"
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
        <img src={config.assets.woodenSign} alt="" className="w-24 sm:w-36 md:w-44" draggable={false} />
        <span
          className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold"
          style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
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
      <span className="text-base sm:text-lg font-bold" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
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
    <div className="absolute z-[12] top-[52px] right-4 sm:top-6 sm:right-6 flex flex-col items-center gap-1">
      <SignButton label={"\uD835\uDCDB\uD835\uDCF8\uD835\uDCFB\uD835\uDCEE"} onClick={() => onOpenModal("lore")} />
      <SignButton label={"\uD835\uDCD5\uD835\uDCFB\uD835\uDCF8\uD835\uDCF8\uD835\uDCEF"} onClick={() => onOpenModal("proof")} />

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
            <img src={config.assets.woodenSign} alt="Sign" className="w-24 sm:w-36 md:w-44" draggable={false} />
            <span
              className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold px-2"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
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
              className="text-base sm:text-lg font-bold"
              style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
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
    <div className="absolute z-[12]
                    bottom-[12%] left-4
                    sm:bottom-[6%] sm:left-6
                    max-sm:top-[52px] max-sm:left-3 max-sm:bottom-auto
                    flex flex-col items-center gap-1 sm:gap-3">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
          title={l.label}
        >
          <div className="w-11 h-11 sm:w-16 sm:h-16 group-hover:scale-110 transition-transform flex items-center justify-center">
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
      className="fixed inset-0 z-[50] flex items-center justify-center overflow-hidden"
      style={{ animation: "modal-fade 0.35s ease-out", isolation: "isolate" }}
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
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(40,25,10,0.85)" }} />
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
          className="absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold leading-none cursor-pointer transition-all"
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
        <div className="relative overflow-y-auto max-h-[85vh] sm:max-h-[90vh] px-5 py-6 sm:px-14 sm:py-10">
          <div className="flex flex-col items-center text-center w-full">
            {children}
          </div>
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
      {/* Title */}
      <h2
        className="w-full text-xl sm:text-2xl font-bold text-center mb-5"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
      >
        The Legend of Sluglord
      </h2>

      {/* Sluglord badge */}
      {config.assets.sluglordBadge && (
        <div className="w-full flex justify-center mb-6">
          <div className="relative">
            <img
              src={config.assets.sluglordBadge}
              alt="Sluglord"
              className="h-44 sm:h-56 w-auto max-w-[80vw] object-contain relative z-[1]"
              style={{
                filter: "drop-shadow(0 4px 12px rgba(80,50,30,0.35))",
              }}
              draggable={false}
            />
            {/* Glow behind badge */}
            <div className="absolute inset-0 -m-6 rounded-full pointer-events-none" style={{
              background: "radial-gradient(ellipse at center, rgba(212,160,23,0.15) 0%, transparent 65%)",
            }} />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full flex items-center justify-center gap-3 mb-6">
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
        className="w-full max-w-xl space-y-5 text-[15px] sm:text-base leading-[1.85] text-center"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#4A3728" }}
      >
        <p>
          <strong style={{ color: "#7B5B3A" }}>Sluglord</strong> is a mix of Pepe the Frog,
          Jabba the Hutt and an enlightened being.
        </p>
        <p>
          I was walking home up the hill I always walk some sunny morning after
          dropping my daughter off at school. I said goodbye to a friend, turned
          to walk away and saw a happy Buddha garden figurine with a happy smile,
          arms wide open to the sky, soaking up the sun. The moment influenced
          my idea.
        </p>
        <p>
          I like showing the 'good' side of 'bad' guys. The flower represents
          cosmic wonder and the beauty of life, the clouds, the rain, the soil,
          the interconnectedness of everything. There is a good reason flowers
          are popular in art.
        </p>
        <p>
          The flower compliments the smile of the Sluglord and his outstretched
          arms bask in the sun like the petals of a flower.
        </p>
      </div>

      {/* Quote */}
      <div
        className="w-full max-w-xl mt-7 mb-1 rounded-xl px-5 py-5 text-center"
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
      {/* Title */}
      <h2
        className="w-full text-xl sm:text-2xl font-bold text-center mb-1"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
      >
        Memes
      </h2>
      <p className="w-full text-center text-xs sm:text-sm mb-6" style={{ color: "#8B7355", fontFamily: "'Baloo 2', sans-serif" }}>
        The finest Sluglord collection
      </p>

      {/* Divider */}
      <div className="w-full flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-7 h-7 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      {/* Grid */}
      <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
   PROOF GALLERY — Image gallery for proof/evidence
   ═══════════════════════════════════════════════════════════════════ */
/** Video player that crops dark/empty areas to focus on visible content */
function ProofVideo({ src }) {
  const [ratio, setRatio] = useState(9 / 12);

  const handleMetadata = useCallback((e) => {
    const v = e.target;
    if (v.videoWidth && v.videoHeight) {
      const nativeRatio = v.videoWidth / v.videoHeight;
      // Crop to ~55% of original height to remove dark ceiling/floor
      setRatio(nativeRatio / 0.55);
    }
  }, []);

  return (
    <div className="mb-6 flex justify-center w-full">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          maxHeight: "min(45vh, 340px)",
          maxWidth: "min(55vw, 260px)",
          width: "fit-content",
          aspectRatio: ratio,
          border: "2px solid rgba(139,115,85,0.2)",
          boxShadow: "0 2px 8px rgba(80,50,30,0.15)",
        }}
      >
        <video
          src={src}
          className="block w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "center 58%",
          }}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={handleMetadata}
        />
      </div>
    </div>
  );
}

function ProofGallery({ onClose }) {
  const proofs = config.content?.proof || [];
  const videos = proofs.filter(p => p.type === "video");
  const images = proofs.filter(p => p.type !== "video");
  const imageSlots = images.length > 0 ? images : Array.from({ length: 6 }, (_, i) => ({ placeholder: true, index: i + 1 }));

  return (
    <ModalOverlay onClose={onClose}>
      {/* Title */}
      <h2
        className="w-full text-xl sm:text-2xl font-bold text-center mb-1"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
      >
        Proof
      </h2>
      <p className="w-full text-center text-xs sm:text-sm mb-6" style={{ color: "#8B7355", fontFamily: "'Baloo 2', sans-serif" }}>
        Receipts from the Sluglord
      </p>

      {/* Divider */}
      <div className="w-full flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-7 h-7 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      {/* Video on top, centered */}
      {videos.map((v, i) => (
        <ProofVideo key={`video-${i}`} src={v.url} />
      ))}

      {/* Image grid */}
      <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {imageSlots.map((item, i) => (
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
                  PROOF {item.index}
                </span>
              </div>
            ) : (
              <img src={item.url} alt={item.alt || `Proof ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
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
        {/* Sunflowers baked into hill asset, animated ones in foreground */}
        {/* <BackSunflowers /> */}
        {/* Sluglord is now integrated into MainHill asset */}
        {/* <Sluglord /> */}
        <ForegroundSunflowers />
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
      {modalOpen === "proof" && <ProofGallery onClose={() => setModalOpen(null)} />}
    </>
  );
}
