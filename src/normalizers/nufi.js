// ─────────────────────────────────────────────
// Normalizer: Nufi NSS v2
// Produce el mismo shape que normalizeNubariumPremium()
// ─────────────────────────────────────────────

function normalizeNufi(payload) {
  const data = payload?.data ?? {};
  const ocr = data?.ocr ?? {};
  const datos = ocr?.datos ?? {};

  return {
    provider: "nufi",
    transactionId: cleanText(payload?.uuid ?? data?.uuid ?? null),
    status: String(payload?.status || "").toLowerCase() === "success" ? "ok" : "error",
    messageCode: null,
    message: cleanText(payload?.message),

    person: {
      fullName: cleanText(datos?.nombre),
      curp: cleanText(data?.curp),
      nss: cleanText(data?.numero_seguridad_social)
    },

    summary: {
      totalWeeks: toInt(datos?.semanas_cotizadas),
      discountedWeeks: toInt(datos?.semanas_descontadas),
      reinstatedWeeks: toInt(datos?.semanas_reintegradas)
    },

    jobs: ensureArray(ocr?.empleos).map(normalizeJob),

    // Nufi no provee datos enriquecidos — se dejan en cero/null
    enriched: {
      currentStatus: null,
      lastBaseSalary: 0,
      lastJobDurationWeeks: 0,
      currentSituationWeeks: 0,
      totalWorkedWeeks: 0,
      uniqueEmployers: 0,
      employersPerYear: 0,
      unemployedWeeks: 0,
      maxUnemploymentWeeks: 0
    },

    // Nufi no provee historial de cambios salariales
    salaryChanges: []
  };
}

function normalizeJob(job) {
  const endDateRaw = cleanText(job?.fecha_baja);

  return {
    employerName: cleanText(job?.patron),
    employerRegistration: cleanText(job?.registro_patronal),
    state: cleanText(job?.entidda_federativa ?? job?.entidad_federativa),
    startDate: toIsoDate(job?.fecha_alta),
    endDate: isVigente(endDateRaw) ? null : toIsoDate(endDateRaw),
    current: isVigente(endDateRaw),
    baseSalaryDaily: toMoneyNumber(job?.salario_base),
    workedWeeks: 0,       // Nufi no lo provee por empleo
    monthlySalary: 0      // Nufi no lo provee por empleo
  };
}

// ─── Helpers (mismos que en nubariumPremium) ───────────────────────────────

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  return str.length ? str : null;
}

function toInt(value) {
  if (value === undefined || value === null || value === "") return 0;
  const n = parseInt(String(value).replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function toMoneyNumber(value) {
  if (value === undefined || value === null || value === "") return 0;
  const normalized = String(value)
    .replace(/\$/g, "")
    .replace(/\s+/g, "")
    .replace(/,/g, "");
  const n = Number(normalized);
  return Number.isNaN(n) ? 0 : n;
}

function isVigente(value) {
  if (!value) return false;
  return String(value).trim().toLowerCase() === "vigente";
}

function toIsoDate(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

module.exports = { normalizeNufi };