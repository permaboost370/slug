import { useState } from "react";
import config from "../config";
import useScreenSize from "../hooks/useScreenSize";
import SignButton from "./SignButton";
import TypewriterLore from "./TypewriterLore";

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
    { key: "x",        url: config.socials.x,           icon: "\uD835\uDD4F", assetKey: "iconX",        label: "X" },
    { key: "telegram", url: config.socials.telegram,     icon: "\u2708",        assetKey: "iconTelegram", label: "TG" },
    { key: "dex",      url: config.socials.dexscreener,  icon: "\uD83D\uDCCA", assetKey: "iconDex",      label: "DEX" },
  ];

  return (
    <div
      className="w-full h-full overflow-y-auto flex flex-col items-center justify-center px-5 py-8 sm:px-8 sm:py-10 sm:border-l-[3px]"
      style={{
        background: "linear-gradient(175deg, #F5E6C8 0%, #EDD9B5 30%, #E8CFA5 60%, #DFC494 100%)",
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
      {/* Warm inner shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 40px rgba(139,115,85,0.15), inset 0 0 80px rgba(139,115,85,0.08)" }}
      />

      {/* Token title / logo */}
      <div className="relative mb-8 sm:mb-10">
        {config.assets.titleLogo ? (
          <img
            src={config.assets.titleLogo}
            alt={config.tokenName}
            className="w-[55vw] sm:w-[16vw] max-w-[240px]"
            style={{
              filter: "drop-shadow(1px 0 0 rgba(0,0,0,0.3)) drop-shadow(-1px 0 0 rgba(0,0,0,0.3)) drop-shadow(0 1px 0 rgba(0,0,0,0.3)) drop-shadow(0 -1px 0 rgba(0,0,0,0.3))",
            }}
            draggable={false}
          />
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
      <div className="w-full flex items-center justify-center gap-3 mb-8 sm:mb-10">
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-6 h-6 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      {/* Sign menu — vertical stack */}
      <div className="flex flex-col items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
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

      {/* Social links — horizontal row */}
      <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
        {links.map((l) => (
          <a
            key={l.key}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            title={l.label}
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform flex items-center justify-center">
              {config.assets[l.assetKey] ? (
                <img src={config.assets[l.assetKey]} alt={l.label} className="w-full h-full object-contain drop-shadow-md" draggable={false} />
              ) : (
                <span className="text-lg" style={{ color: "#5A3E2B" }}>{l.icon}</span>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* TypewriterLore slot — desktop only, conditionally rendered */}
      {loreActive && size !== "mobile" && (
        <div className="w-full max-w-xs mt-2">
          <TypewriterLore
            text={config.content.loreText}
            attribution={config.content.loreAttribution}
          />
        </div>
      )}
    </div>
  );
}
