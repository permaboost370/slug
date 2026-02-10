import { useState } from "react";
import config from "../config";
import useScreenSize from "../hooks/useScreenSize";
import SignButton from "./SignButton";
import TypewriterLore from "./TypewriterLore";

function SocialIcon({ type }) {
  const color = "#5A3E2B";
  const size = "w-5 h-5 sm:w-6 sm:h-6";

  if (type === "x") {
    return (
      <svg className={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (type === "telegram") {
    return (
      <svg className={size} viewBox="0 0 24 24" fill={color}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  }

  if (type === "dex") {
    return (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    );
  }

  return null;
}

export default function Sidebar({ onOpenModal, copy, toast }) {
  const size = useScreenSize();
  const [loreActive, setLoreActive] = useState(false);

  const handleLore = () => {
    if (size === "mobile") {
      onOpenModal("lore");
    } else {
      setLoreActive((prev) => !prev);
    }
  };

  const links = [
    { key: "x",        url: config.socials.x,           label: "X" },
    { key: "telegram", url: config.socials.telegram,     label: "Telegram" },
    { key: "dex",      url: config.socials.dexscreener,  label: "DEX" },
  ];

  return (
    <div
      className="w-full h-full overflow-y-auto flex flex-col items-center justify-center px-5 py-5 sm:px-8 sm:py-10 sm:border-l-[3px]"
      style={{
        background: "linear-gradient(175deg, #F5E6C8 0%, #EDD9B5 25%, #E8CFA5 50%, #DFC494 75%, #D4B882 100%)",
        borderColor: "#8B7355",
        animation: "sidebar-enter 0.5s ease-out",
      }}
    >
      {/* Paper texture lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139,115,85,0.06) 28px, rgba(139,115,85,0.06) 29px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Warm inner shadow — deeper edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 60px rgba(139,115,85,0.2), inset 0 0 120px rgba(139,115,85,0.1)" }}
      />

      {/* Ambient warm glow — drifting light spot */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "35%",
          left: "50%",
          width: "120%",
          height: "80%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,210,80,0.12) 0%, rgba(232,184,74,0.05) 40%, transparent 65%)",
          animation: "sidebar-glow 12s ease-in-out infinite",
        }}
      />

      {/* God rays bleeding from scene side */}
      {config.assets.godRays && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block"
          style={{
            maskImage: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)",
          }}
        >
          <img
            src={config.assets.godRays}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              animation: "ray-drift 30s ease-in-out infinite, ray-pulse 14s ease-in-out infinite",
              mixBlendMode: "soft-light",
              opacity: 0.15,
              transformOrigin: "0% 0%",
            }}
            draggable={false}
          />
        </div>
      )}

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(139,115,85,0.18) 100%)",
        }}
      />

      {/* Decorative sunflowers along bottom edges */}
      {config.assets.sunflower && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={config.assets.sunflower}
            alt=""
            className="absolute"
            style={{
              bottom: "-6%", left: "-4%", height: "14vh",
              transform: "rotate(10deg)",
              opacity: 0.12, filter: "blur(1px) saturate(0.6)",
            }}
            draggable={false}
          />
          <img
            src={config.assets.sunflower}
            alt=""
            className="absolute"
            style={{
              bottom: "-8%", right: "-3%", height: "12vh",
              transform: "rotate(-8deg) scaleX(-1)",
              opacity: 0.1, filter: "blur(1px) saturate(0.6)",
            }}
            draggable={false}
          />
          <img
            src={config.assets.sunflower}
            alt=""
            className="absolute hidden sm:block"
            style={{
              bottom: "-4%", left: "20%", height: "14vh",
              transform: "rotate(6deg)",
              opacity: 0.08, filter: "blur(1.5px) saturate(0.5)",
            }}
            draggable={false}
          />
        </div>
      )}

      {/* ── Logo with glow halo + float + shimmer ── */}
      <div
        className="relative mb-8 sm:mb-10 hidden sm:block"
        style={{ animation: "logo-float 6s ease-in-out infinite" }}
      >
        {config.assets.titleLogo ? (
          <>
            {/* Outer warm glow halo */}
            <div
              className="absolute -inset-[45%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255,210,80,0.3) 0%, rgba(255,180,60,0.12) 40%, transparent 70%)",
                animation: "logo-glow 8s ease-in-out infinite",
                filter: "blur(16px)",
              }}
            />
            {/* Inner tighter glow */}
            <div
              className="absolute -inset-[20%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255,240,180,0.2) 0%, rgba(255,210,80,0.08) 50%, transparent 70%)",
                animation: "logo-glow 6s ease-in-out infinite",
                animationDelay: "-3s",
                filter: "blur(8px)",
              }}
            />
            {/* Logo image */}
            <div className="relative overflow-hidden">
              <img
                src={config.assets.titleLogo}
                alt={config.tokenName}
                className="relative z-[1] w-[55vw] sm:w-[16vw] max-w-[240px]"
                style={{
                  filter: "drop-shadow(1px 0 0 rgba(0,0,0,0.25)) drop-shadow(-1px 0 0 rgba(0,0,0,0.25)) drop-shadow(0 1px 0 rgba(0,0,0,0.25)) drop-shadow(0 -1px 0 rgba(0,0,0,0.25)) drop-shadow(0 0 12px rgba(255,210,80,0.2))",
                }}
                draggable={false}
              />
              {/* Shimmer sweep — masked to logo shape */}
              <div
                className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
                style={{
                  maskImage: `url(${config.assets.titleLogo})`,
                  WebkitMaskImage: `url(${config.assets.titleLogo})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              >
                <div
                  className="absolute top-0 h-full"
                  style={{
                    width: "40%",
                    background: "linear-gradient(105deg, transparent 0%, rgba(255,250,220,0.5) 45%, rgba(255,240,180,0.2) 55%, transparent 100%)",
                    animation: "logo-shimmer 4s ease-in-out infinite",
                    animationDelay: "2s",
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <h1
            className="text-3xl sm:text-4xl font-extrabold leading-none tracking-wide"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              color: "#6B5344",
              textShadow: "2px 3px 0 rgba(232,184,74,0.35), 0 0 40px rgba(232,184,74,0.12)",
            }}
          >
            {config.tokenName}
          </h1>
        )}
      </div>

      {/* Divider */}
      <div className="relative z-[1] w-full hidden sm:flex items-center justify-center gap-3 mb-8 sm:mb-10">
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-6 h-6 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      {/* Sign menu — vertical stack */}
      <div className="relative z-[1] flex flex-col items-center gap-3 sm:gap-3 mb-12 sm:mb-10">
        <SignButton label={"\uD835\uDCDB\uD835\uDCF8\uD835\uDCFB\uD835\uDCEE"} onClick={handleLore} />
        <SignButton label={"\uD835\uDCD5\uD835\uDCFB\uD835\uDCF8\uD835\uDCF8\uD835\uDCEF"} onClick={() => onOpenModal("proof")} />
        <div className="relative">
          {toast && (
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-lg z-10"
              style={{ backgroundColor: "#5A7A32", color: "#FFFEF5", animation: "toast-in 1.8s ease forwards" }}
            >
              Copied!
            </div>
          )}
          <SignButton label={"\uD835\uDCD2\uD835\uDCD0"} onClick={copy} />
        </div>
      </div>

      {/* Social links — circled SVG icons */}
      <div className="relative z-[1] flex items-center gap-5 sm:gap-6 mt-auto pt-4 sm:mt-0 sm:pt-0 mb-4 sm:mb-8">
        {links.map((l) => (
          <a
            key={l.key}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            title={l.label}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: "linear-gradient(175deg, #F5E6C8 0%, #EDD9B5 40%, #DFC494 100%)",
                border: "2px solid #8B7355",
                boxShadow: "0 2px 8px rgba(80,50,30,0.15), inset 0 1px 0 rgba(255,250,230,0.4)",
              }}
            >
              <SocialIcon type={l.key} />
            </div>
          </a>
        ))}
      </div>

      {/* TypewriterLore slot — desktop only, conditionally rendered */}
      {loreActive && size !== "mobile" && (
        <div className="relative z-[1] w-full max-w-xs mt-2">
          <TypewriterLore
            text={config.content.loreText}
            attribution={config.content.loreAttribution}
          />
        </div>
      )}
    </div>
  );
}
