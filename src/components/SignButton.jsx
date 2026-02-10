import useSound from "../hooks/useSound";
import config from "../config";

export default function SignButton({ label, onClick, className = "" }) {
  const { play: playClick } = useSound(config.audio.sfx?.signClick);

  const handleClick = (e) => {
    playClick();
    onClick?.(e);
  };

  return (
    <button
      className={`relative cursor-pointer rounded-full px-8 py-2.5 sm:px-10 sm:py-3 transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      style={{
        background: "linear-gradient(175deg, #F5E6C8 0%, #EDD9B5 40%, #DFC494 100%)",
        border: "2px solid #8B7355",
        boxShadow: "0 3px 12px rgba(80,50,30,0.2), inset 0 1px 0 rgba(255,250,230,0.5), inset 0 -1px 2px rgba(139,115,85,0.15)",
      }}
      onClick={handleClick}
    >
      <span
        className="text-base sm:text-lg font-bold tracking-wide"
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          color: "#5A3E2B",
          textShadow: "0 1px 0 rgba(255,250,230,0.4)",
        }}
      >
        {label}
      </span>
    </button>
  );
}
