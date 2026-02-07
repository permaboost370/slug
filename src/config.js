/* ═══════════════════════════════════════════════════════════════════
   SLUGLORD — Configuration
   Edit URLs and text here. Placeholder divs render when asset is null.
   ═══════════════════════════════════════════════════════════════════ */

const config = {
  tokenName: "SLUGLORD",
  contractAddress: "0x5791254f5d7a4d7ce4dda0391ce15812b65ac2a2",
  ticker: "$SLUG",

  socials: {
    x: "https://x.com/SlugLord_ERC",
    telegram: "https://t.me/sluglordOG",
    dexscreener:
      "https://dexscreener.com/ethereum/0x5791254f5d7a4d7ce4dda0391ce15812b65ac2a2",
  },

  content: {
    memes: [],  // Future meme image URLs go here
  },

  assets: {
    // Title logo
    titleLogo: "/assets/Sluglord Assets – Refined Versions_Sluglord Text2.png",

    // Scene layers — full-width PNGs
    sky: "/assets/sky-clouds.png",
    hillsBackground: "/assets/hills-background.png",
    hillMain: "/assets/Sluglord Assets ΓÇô Refined Versions_Main Hill Sunflower Field (Open Eyes, Holding Sunflower).png",  // Fallback
    hillMainOpen: "/assets/Sluglord Assets ΓÇô Refined Versions_Main Hill Sunflower Field (Open Eyes, Holding Sunflower).png",   // Eyes open
    hillMainBlink: "/assets/Sluglord Assets ΓÇô Refined Versions_Main Hill Sunflower Field (close Eyes, Holding Sunflower).png",  // Eyes closed
    grassForeground: null,  // Removed to show paved road
    godRays: "/assets/Sluglord  website Assets_god-rays copy.png",

    // Sunrise additions
    sunGlow: "/assets/Sun, Sky_Sun.png",
    sluglordShadow: null,            // "/assets/sluglord-shadow.png"
    pollen: null,                     // "/assets/pollen.png" (sprite)

    // Characters — PNGs with transparency
    sluglordOpen: "/assets/sluglord-open.png",
    sluglordBlink: "/assets/sluglord-blink.png",
    sunflower: "/assets/sunflower.png",

    // UI assets
    woodenSign: "/assets/sign-wood.png",
    iconX: "/assets/icon-x.png",
    iconTelegram: "/assets/icon-telegram.png",
    iconDex: "/assets/icon-dex.png",

    // Meta assets (not rendered in scene)
    ogCard: null,                     // "/assets/og-card.png"
    favicon: null,                    // "/assets/favicon.png"
  },

  audio: {
    ambient: null,                    // "/assets/ambient-morning.mp3"
  },
};

export default config;
