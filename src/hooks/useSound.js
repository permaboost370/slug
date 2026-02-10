import { useRef, useCallback } from "react";

/** Simple HTML5 Audio hook. Returns { play }. Handles null URLs (no-op). */
export default function useSound(url) {
  const audioRef = useRef(null);

  if (url && !audioRef.current) {
    audioRef.current = new Audio(url);
  }

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  return { play };
}
