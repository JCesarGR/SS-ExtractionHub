const fs = require("fs");
const path = require("path");

const { normalizeNubariumPremium } = require("./normalizers/nubariumPremium");
const { resolveNufiPayload } = require("./adapters/nufiAdapter");
const { buildImssViewModel } = require("./formatters/imssViewModel");
const { renderImssPdf } = require("./renderers/imssPdfRenderer");

const PROVIDER_ARGS = {
  nubarium: "--nubarium",
  nufi: "--nufi"
};

function main() {
  try {
    const args = process.argv.slice(2);
    const outputPath = path.join(__dirname, "../output/imss_historial_laboral.pdf");

    // ── Nubarium ──────────────────────────────────────────────────────────
    if (args.includes(PROVIDER_ARGS.nubarium)) {
      const inputPath = path.join(__dirname, "../data/sample-premium.json");
      if (!fs.existsSync(inputPath)) throw new Error(`No encontrado: ${inputPath}`);

      const normalized = normalizeNubariumPremium(JSON.parse(fs.readFileSync(inputPath, "utf8")));
      const viewModel = buildImssViewModel(normalized);
      renderImssPdf(viewModel, outputPath);
      logSuccess(viewModel, outputPath);
      return;
    }

    // ── Nufi ──────────────────────────────────────────────────────────────
    if (args.includes(PROVIDER_ARGS.nufi)) {
      const inputPath = path.join(__dirname, "../data/sample-nufi.json");
      if (!fs.existsSync(inputPath)) throw new Error(`No encontrado: ${inputPath}`);

      const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
      const result = resolveNufiPayload(payload);

      if (result.mode === "base64") {
        // PDF ya viene listo de Nufi — solo lo guardamos
        const pdfBuffer = Buffer.from(result.base64Pdf, "base64");
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log("✅ PDF guardado desde base64 de Nufi");
        console.log(`📄 Archivo: ${outputPath}`);
      } else {
        const viewModel = buildImssViewModel(result.normalized);
        renderImssPdf(viewModel, outputPath);
        logSuccess(viewModel, outputPath);
      }
      return;
    }

    throw new Error('Especifica el proveedor: --nubarium o --nufi');

  } catch (error) {
    console.error("❌ Error al generar el PDF:");
    console.error(error.message);
    process.exit(1);
  }
}

function logSuccess(viewModel, outputPath) {
  console.log("✅ PDF generado correctamente");
  console.log(`📄 Archivo: ${outputPath}`);
  console.log(`👤 Nombre: ${viewModel.fullName}`);
  console.log(`📦 Empleos procesados: ${viewModel.jobs.length}`);
}

main();