import config from "../config";
import useSound from "../hooks/useSound";

export default function SignButton({ label, onClick, className = "" }) {
  const { play: playHover } = useSound(config.audio.sfx?.signHover);
  const { play: playClick } = useSound(config.audio.sfx?.signClick);

  const handleClick = (e) => {
    playClick();
    onClick?.(e);
  };

  if (config.assets.woodenSign) {
    return (
      <div
        className={`relative cursor-pointer sign-hover ${className}`}
        onClick={handleClick}
        onMouseEnter={playHover}
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
      className={`relative cursor-pointer sign-hover rounded-md px-4 py-2 shadow-lg border-2 border-dashed ${className}`}
      style={{ backgroundColor: "rgba(107,83,68,0.88)", borderColor: "rgba(107,83,68,0.5)" }}
      onClick={handleClick}
      onMouseEnter={playHover}
    >
      <span className="text-base sm:text-lg font-bold" style={{ fontFamily: "'Baloo 2', sans-serif", color: "#FFFEF5", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
        {label}
      </span>
    </div>
  );
}
