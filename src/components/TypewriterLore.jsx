import { useState, useEffect, useCallback } from "react";

export default function TypewriterLore({ text, attribution, speed = 30 }) {
  const [charIndex, setCharIndex] = useState(0);
  const done = charIndex >= text.length;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setCharIndex((prev) => Math.min(prev + 1, text.length));
    }, speed);
    return () => clearInterval(id);
  }, [done, speed, text.length]);

  const skip = useCallback(() => {
    if (!done) setCharIndex(text.length);
  }, [done, text.length]);

  return (
    <div
      className="rounded-xl px-4 py-4 sm:px-5 sm:py-5 cursor-pointer select-none"
      style={{
        backgroundColor: "rgba(139,115,85,0.08)",
        border: "1.5px solid rgba(139,115,85,0.18)",
        boxShadow: "inset 0 2px 8px rgba(139,115,85,0.06)",
      }}
      onClick={skip}
      title={done ? undefined : "Click to skip"}
    >
      <p
        className="text-[13px] sm:text-[15px] leading-[1.85] whitespace-pre-wrap"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#4A3728" }}
      >
        {text.slice(0, charIndex)}
        {!done && (
          <span
            className="inline-block w-[2px] h-[1em] ml-[1px] align-middle"
            style={{
              backgroundColor: "#4A3728",
              animation: "typewriter-cursor 0.8s step-end infinite",
            }}
          />
        )}
      </p>

      {done && attribution && (
        <p
          className="mt-4 text-sm sm:text-base italic leading-relaxed whitespace-pre-wrap text-center"
          style={{
            color: "#6B5340",
            fontFamily: "'Baloo 2', sans-serif",
            animation: "modal-fade 0.5s ease-out",
          }}
        >
          {attribution}
        </p>
      )}
    </div>
  );
}
