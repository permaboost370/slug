import { useState, useCallback } from "react";
import config from "../config";
import ScenePanel from "./ScenePanel";
import Sidebar from "./Sidebar";
import Placeholder from "./Placeholder";

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
      {/* Scene backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        {config.assets.sky ? (
          <img src={config.assets.sky} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #B8D4E3 50%, #D4C5A0 100%)" }} />
        )}
        {config.assets.hillsBackground && (
          <img src={config.assets.hillsBackground} alt="" className="absolute bottom-0 left-0 w-full" style={{ opacity: 0.5 }} draggable={false} />
        )}
        {config.assets.hillMain && (
          <img src={config.assets.hillMain} alt="" className="absolute bottom-0 left-0 w-full" style={{ opacity: 0.35 }} draggable={false} />
        )}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(40,25,10,0.85)" }} />
      </div>

      {/* Decorative sunflowers */}
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
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139,115,85,0.06) 28px, rgba(139,115,85,0.06) 29px)",
          mixBlendMode: "multiply",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: "inset 0 0 40px rgba(139,115,85,0.15), inset 0 0 80px rgba(139,115,85,0.08)",
        }} />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold leading-none cursor-pointer transition-all"
          style={{ color: "#F5E6C8", backgroundColor: "#8B7355", border: "2px solid #6B5340", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#6B5340"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#8B7355"; }}
        >
          &#x2715;
        </button>

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
   LORE MODAL
   ═══════════════════════════════════════════════════════════════════ */
function LoreModal({ onClose }) {
  return (
    <ModalOverlay onClose={onClose}>
      <h2
        className="w-full text-xl sm:text-2xl font-bold text-center mb-5"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
      >
        The Legend of Sluglord
      </h2>

      {config.assets.sluglordBadge && (
        <div className="w-full flex justify-center mb-6">
          <div className="relative">
            <img
              src={config.assets.sluglordBadge}
              alt="Sluglord"
              className="h-44 sm:h-56 w-auto max-w-[80vw] object-contain relative z-[1]"
              style={{ filter: "drop-shadow(0 4px 12px rgba(80,50,30,0.35))" }}
              draggable={false}
            />
            <div className="absolute inset-0 -m-6 rounded-full pointer-events-none" style={{
              background: "radial-gradient(ellipse at center, rgba(212,160,23,0.15) 0%, transparent 65%)",
            }} />
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
        {config.assets.sunflower ? (
          <img src={config.assets.sunflower} alt="" className="w-7 h-7 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B7355" }} />
        )}
        <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
      </div>

      <div
        className="w-full max-w-xl space-y-5 text-[15px] sm:text-base leading-[1.85] text-center"
        style={{ fontFamily: "'Baloo 2', sans-serif", color: "#4A3728" }}
      >
        <p>{config.content.loreText}</p>
      </div>

      <div
        className="w-full max-w-xl mt-7 mb-1 rounded-xl px-5 py-5 text-center"
        style={{ backgroundColor: "rgba(139,115,85,0.1)", border: "1.5px solid rgba(139,115,85,0.2)" }}
      >
        <p
          className="text-base sm:text-lg italic leading-relaxed whitespace-pre-wrap"
          style={{ color: "#6B5340", fontFamily: "'Baloo 2', sans-serif" }}
        >
          {config.content.loreAttribution}
        </p>
      </div>
    </ModalOverlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROOF LIGHTBOX
   ═══════════════════════════════════════════════════════════════════ */
function ProofLightbox({ items, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const item = items[index];

  const prev = useCallback(() => setIndex(i => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIndex(i => (i + 1) % items.length), [items.length]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.9)", animation: "modal-fade 0.25s ease-out" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer"
        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
      >
        &#x2715;
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono">
        {index + 1} / {items.length}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white text-2xl cursor-pointer transition-colors"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
      >
        &#x2039;
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white text-2xl cursor-pointer transition-colors"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
      >
        &#x203A;
      </button>

      <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {item.type === "video" ? (
          <video
            key={item.url}
            src={item.url}
            poster={item.poster}
            className="max-w-full max-h-[85vh] rounded-lg"
            style={{ objectFit: "contain" }}
            controls autoPlay playsInline
          />
        ) : (
          <img src={item.url} alt="" className="max-w-full max-h-[85vh] rounded-lg" style={{ objectFit: "contain" }} draggable={false} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROOF GALLERY
   ═══════════════════════════════════════════════════════════════════ */
function ProofGallery({ onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const proofs = config.content?.proof || [];
  const featured = proofs.filter(p => p.featured);
  const grid = proofs.filter(p => !p.featured);
  const allItems = [...featured, ...grid];

  const openLightbox = (item) => {
    const idx = allItems.findIndex(a => a.url === item.url);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  return (
    <>
      <ModalOverlay onClose={onClose}>
        <h2
          className="w-full text-xl sm:text-2xl font-bold text-center mb-1"
          style={{ fontFamily: "'Baloo 2', sans-serif", color: "#5A3E2B" }}
        >
          Proof
        </h2>
        <p className="w-full text-center text-xs sm:text-sm mb-6" style={{ color: "#8B7355", fontFamily: "'Baloo 2', sans-serif" }}>
          Receipts from the Sluglord
        </p>

        <div className="w-full flex items-center justify-center gap-3 mb-6">
          <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #8B7355)" }} />
          {config.assets.sunflower ? (
            <img src={config.assets.sunflower} alt="" className="w-7 h-7 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} draggable={false} />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B7355" }} />
          )}
          <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #8B7355)" }} />
        </div>

        {featured.length > 0 && (
          <div className="w-full max-w-xl flex justify-center gap-3 sm:gap-4 mb-6">
            {featured.map((item, i) => (
              <div
                key={`featured-${i}`}
                className="flex-1 max-w-[48%] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.03]"
                style={{ border: "2px solid rgba(139,115,85,0.2)", boxShadow: "0 2px 8px rgba(80,50,30,0.15)", aspectRatio: "1" }}
                onClick={() => openLightbox(item)}
              >
                {item.type === "video" ? (
                  <div className="relative w-full h-full group">
                    <img src={item.poster || ""} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 58%" }} draggable={false} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                        <span className="text-white text-2xl ml-1">&#x25B6;</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt="" className="w-full h-full object-cover" draggable={false} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {grid.map((item, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-transform hover:scale-[1.03]"
              style={{ border: "2px solid rgba(139,115,85,0.2)", boxShadow: "0 2px 8px rgba(80,50,30,0.15)" }}
              onClick={() => openLightbox(item)}
            >
              <img src={item.url} alt={item.alt || `Proof ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
            </div>
          ))}
        </div>
        <div className="h-4" />
      </ModalOverlay>

      {lightboxIndex !== null && (
        <ProofLightbox items={allItems} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Two-panel layout
   ═══════════════════════════════════════════════════════════════════ */
export default function Scene() {
  const [modalOpen, setModalOpen] = useState(null);
  const [toast, setToast] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(config.contractAddress).then(() => {
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full h-full">
        {/* Left panel — visual scene */}
        <div className="w-full h-[50vh] sm:h-full sm:w-2/3 relative overflow-hidden">
          <ScenePanel />
        </div>

        {/* Right panel — parchment sidebar */}
        <div className="w-full flex-1 sm:h-full sm:w-1/3 overflow-y-auto relative">
          <Sidebar
            onOpenModal={setModalOpen}
            copy={copy}
            toast={toast}
          />
        </div>
      </div>

      {/* Modals — fixed z-50, viewport-level */}
      {modalOpen === "lore" && <LoreModal onClose={() => setModalOpen(null)} />}
      {modalOpen === "proof" && <ProofGallery onClose={() => setModalOpen(null)} />}
    </>
  );
}
