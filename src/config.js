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
    loreText:
      "Sluglord is a mix of Pepe the Frog, Jabba the Hutt and an enlightened being. I was walking home up the hill I always walk some sunny morning after dropping my daughter off at school. I said goodbye to a friend, turned to walk away and saw a happy Buddha garden figurine with a happy smile, arms wide open to the sky, soaking up the sun. The moment influenced my idea. I like showing the 'good' side of 'bad' guys. The flower represents cosmic wonder and the beauty of life, the clouds, the rain, the soil, the interconnectedness of everything. There is a good reason flowers are popular in art. The flower compliments the smile of the sluglord and his outstretched arms bask in the sun like the pedals of a flower.",
    loreAttribution: "-Your Truly 2024 this day of our Lord\nMatt Furie",
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
    sfx: {
      signHover: "/assets/sfx/hover.mp3",
      signClick: "/assets/sfx/click.mp3",
    },
  },
};

export default config;
