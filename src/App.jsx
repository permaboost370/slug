import { useState, useEffect } from "react";
import Scene from "./components/Scene";

const PAINTING_SRC = "/assets/proof/photo_2026-02-05_21-14-03.jpg";
const PRELOADER_DURATION = 5000; // total ms before auto-dismiss
const FADE_OUT_MS = 800;

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
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer select-none"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #3A2A18 0%, #1A1008 100%)",
        animation: exiting
          ? `preloader-exit ${FADE_OUT_MS}ms ease-in forwards`
          : undefined,
      }}
      onClick={dismiss}
    >
      {/* Warm ambient glow behind painting */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "70vmin",
          height: "70vmin",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,184,74,0.2) 0%, rgba(232,184,74,0.05) 50%, transparent 70%)",
          animation: "preloader-glow 6s ease-in-out infinite",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 sm:gap-8 px-6 max-w-lg">
        {/* Painting image with golden frame */}
        <div
          className="relative"
          style={{
            animation: "preloader-fade-in 1.2s ease-out both",
            animationDelay: "0.3s",
          }}
        >
          {/* Golden frame border */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              padding: "6px",
              background: "linear-gradient(145deg, #D4A017 0%, #B8860B 25%, #F5DEB3 50%, #B8860B 75%, #D4A017 100%)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 80px rgba(212,160,23,0.15)",
            }}
          >
            <img
              src={PAINTING_SRC}
              alt="The original Sluglord painting by Matt Furie"
              className="w-[55vmin] sm:w-[45vmin] max-w-sm aspect-[3/4] object-cover rounded-[4px]"
              draggable={false}
            />
          </div>
        </div>

        {/* Title text */}
        <div
          className="text-center"
          style={{
            animation: "preloader-fade-in 1s ease-out both",
            animationDelay: "1s",
          }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-wide"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              color: "#F5DEB3",
              textShadow: "0 2px 12px rgba(212,160,23,0.3)",
            }}
          >
            The Original Sluglord
          </h2>
        </div>

        {/* Subtitle */}
        <div
          className="text-center"
          style={{
            animation: "preloader-fade-in 1s ease-out both",
            animationDelay: "1.8s",
          }}
        >
          <p
            className="text-sm sm:text-base tracking-widest uppercase"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              color: "rgba(245,222,179,0.5)",
              letterSpacing: "0.2em",
            }}
          >
            Painting by Matt Furie
          </p>
          <p
            className="text-xs sm:text-sm mt-2"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              color: "rgba(245,222,179,0.35)",
            }}
          >
            Owned by the dev
          </p>
        </div>

        {/* Tap to enter hint */}
        <div
          className="text-center"
          style={{
            animation: "preloader-fade-in 0.8s ease-out both",
            animationDelay: "2.8s",
          }}
        >
          <p
            className="text-[11px] tracking-[0.15em] uppercase"
            style={{
              color: "rgba(245,222,179,0.25)",
              fontFamily: "'Baloo 2', sans-serif",
            }}
          >
            Tap anywhere to enter
          </p>
        </div>
      </div>
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
