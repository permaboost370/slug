/* ═══════════════════════════════════════════════════════════════════
   SLUGLORD — Configuration
   Edit URLs and text here. Placeholder divs render when asset is null.
   ═══════════════════════════════════════════════════════════════════ */

const config = {
  tokenName: "SLUGLORD",
  contractAddress: "0x5791254f5d7a4d7ce4dda0391ce15812b65ac2a2",
  ticker: "$SLUG",

  socials: {
    x: "https://x.com/sluglord_owner",
    telegram: "https://t.me/SluglordOwner",
    dexscreener:
      "https://dexscreener.com/ethereum/0x5791254f5d7a4d7ce4dda0391ce15812b65ac2a2",
  },

  content: {
    memes: [],  // Future meme image URLs go here
    proof: [
      { url: "/assets/proof/photo_2026-02-05_21-13-58.jpg" },
      { url: "/assets/proof/photo_2026-02-05_21-13-59.jpg" },
      { url: "/assets/proof/photo_2026-02-05_21-14-03.jpg" },
      { url: "/assets/proof/photo_2026-02-05_21-14-03 (2).jpg" },
      { url: "/assets/proof/photo_2026-02-05_21-14-29.jpg" },
      { url: "/assets/proof/photo_2026-02-05_21-14-44.jpg" },
      { url: "/assets/proof/photo_2026-02-05_23-39-32.jpg" },
      { url: "/assets/proof/photo_2026-02-05_23-39-34.jpg" },
      { url: "/assets/proof/photo_2026-02-07_19-47-04.jpg" },
      { url: "/assets/proof/photo_2026-02-09_17-00-33.jpg", featured: true },
      { url: "/assets/proof/IMG_1818.MP4", type: "video", poster: "/assets/proof/IMG_1818-poster.jpg", featured: true },
    ],
  },

  assets: {
    // Title logo
    titleLogo: "/assets/Sluglord Assets – Refined Versions_Sluglord Text2.webp",

    // Scene layers — optimized WebP
    sky: "/assets/sky-clouds.webp",
    hillsBackground: "/assets/hills-background.webp",
    hillMain: "/assets/Sluglord Assets ΓÇô Refined Versions_Main Hill Sunflower Field (Open Eyes, Holding Sunflower).webp",  // Fallback
    hillMainOpen: "/assets/Sluglord Assets ΓÇô Refined Versions_Main Hill Sunflower Field (Open Eyes, Holding Sunflower).webp",   // Eyes open
    hillMainBlink: "/assets/Sluglord Assets ΓÇô Refined Versions_Main Hill Sunflower Field (close Eyes, Holding Sunflower).webp",  // Eyes closed
    grassForeground: null,  // Removed to show paved road
    godRays: "/assets/Sluglord  website Assets_god-rays copy.webp",

    // Sunrise additions
    sunGlow: "/assets/Sun, Sky_Sun.webp",
    sluglordShadow: null,            // "/assets/sluglord-shadow.webp"
    pollen: null,                     // "/assets/pollen.webp" (sprite)

    // Characters — WebP with transparency
    sluglordOpen: "/assets/sluglord-open.webp",
    sluglordBlink: "/assets/sluglord-blink.webp",
    sunflower: "/assets/sunflower.webp",

    // UI assets
    woodenSign: "/assets/sign-wood.webp",
    iconX: "/assets/icon-x.webp",
    iconTelegram: "/assets/icon-telegram.webp",
    iconDex: "/assets/icon-dex.webp",

    // Lore modal badge
    sluglordBadge: "/assets/sluglord-badge.webp",

    // Meta assets (not rendered in scene)
    ogCard: null,                     // "/assets/og-card.webp"
    favicon: null,                    // "/assets/favicon.png"
  },

  audio: {
    ambient: null,                    // "/assets/ambient-morning.mp3"
  },
};

export default config;
