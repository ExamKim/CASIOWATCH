const BRAND_COLORS = {
    "G-SHOCK": ["#101820", "#2f3f56", "#d8b15d"],
    EDIFICE: ["#0f1d2e", "#405a76", "#c8d3df"],
    CASIO: ["#1b1e24", "#505867", "#e7dec6"],
    "BABY-G": ["#2d1f32", "#6f4d7e", "#f7d7c8"],
    SHEEN: ["#2a2120", "#74504a", "#f1d0b0"],
    "PRO TREK": ["#1a2b22", "#496957", "#ced9be"],
};

function hashString(value) {
    let hash = 0;
    const input = String(value || "");
    for (let i = 0; i < input.length; i += 1) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function pickBrandColors(brand) {
    const key = String(brand || "").toUpperCase();
    return BRAND_COLORS[key] || ["#1f2229", "#4c5565", "#e1c070"];
}

function normalizeLabel(name) {
    const raw = String(name || "CASIO").trim();
    if (!raw) return "CASIO";
    const parts = raw.split(/\s+/).slice(0, 3);
    return parts.join(" ").slice(0, 24);
}

function buildSvgDataUri(product) {
    const name = normalizeLabel(product?.name);
    const brand = String(product?.brand || "CASIO").toUpperCase();
    const code = String(product?.name || "").split(" ").pop() || "MODEL";
    const seed = hashString(`${name}-${brand}-${product?.id || "x"}`);
    const colors = pickBrandColors(brand);
    const angle = 25 + (seed % 40);

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="55%" stop-color="${colors[1]}" />
      <stop offset="100%" stop-color="${colors[2]}" />
    </linearGradient>
  </defs>
  <rect width="900" height="900" fill="url(#bg)" />
  <circle cx="450" cy="380" r="220" fill="rgba(255,255,255,0.18)" />
  <circle cx="450" cy="380" r="155" fill="rgba(14,14,14,0.55)" />
  <rect x="395" y="160" width="110" height="460" rx="42" fill="rgba(20,20,20,0.40)" />
  <rect x="250" y="640" width="400" height="70" rx="18" fill="rgba(0,0,0,0.30)" />
  <text x="450" y="678" fill="#ffffff" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" letter-spacing="1.5">${brand}</text>
  <text x="450" y="730" fill="#f6e3af" text-anchor="middle" font-size="24" font-family="Arial, sans-serif">${code.slice(0, 16)}</text>
  <text x="450" y="840" fill="rgba(255,255,255,0.90)" text-anchor="middle" font-size="34" font-family="Arial, sans-serif">${name}</text>
</svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getProductImage(product) {
    const rawUrl = String(product?.image_url || "").trim();

    if (rawUrl && !rawUrl.startsWith("/images/")) {
        return rawUrl;
    }

    return buildSvgDataUri(product);
}
