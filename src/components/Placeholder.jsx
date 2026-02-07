/* ═══════════════════════════════════════════════════════════════════
   Placeholder — Renders a labeled box when a real asset is not loaded.
   Maintains aspect ratio, shows asset name + dimensions + format.
   ═══════════════════════════════════════════════════════════════════ */

export default function Placeholder({
  label,
  dims,
  format = "PNG",
  color = "#8DB255",
  className = "",
  style = {},
}) {
  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-black/30 rounded select-none ${className}`}
      style={{ backgroundColor: color, ...style }}
    >
      <span className="text-[9px] sm:text-[11px] text-black/60 text-center leading-tight px-1 font-mono pointer-events-none">
        {label}
        <br />
        {dims} | {format}
      </span>
    </div>
  );
}
