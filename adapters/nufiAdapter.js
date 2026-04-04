// ─────────────────────────────────────────────
// Adapter: Nufi
// Lógica: si hay base64 → bypass, si no → normalizar JSON
// ─────────────────────────────────────────────

const { normalizeNufi } = require("../normalizers/nufi");

function resolveNufiPayload(payload) {
  const base64 = payload?.data?.base64_semanas_cotizadas_nss;

  if (base64 && base64.trim().length > 0) {
    return {
      mode: "base64",
      provider: "nufi",
      base64Pdf: base64,
      normalized: null
    };
  }

  return {
    mode: "json",
    provider: "nufi",
    base64Pdf: null,
    normalized: normalizeNufi(payload)
  };
}

module.exports = { resolveNufiPayload };