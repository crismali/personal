import { watch } from "fs";
import path from "path";

const SRC = path.resolve(import.meta.dir, "src");
const PORT = 3000;

async function buildJS() {
  const result = await Bun.build({
    entrypoints: [`${SRC}/main.ts`],
    outdir: `${SRC}/_dist`,
    naming: "main.js",
  });
  if (!result.success) {
    for (const msg of result.logs) console.error(msg);
  }
}

await buildJS();

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname === "/" ? "/index.html" : url.pathname;

    // Rewrite TS script references to compiled JS
    if (pathname === "/main.ts") pathname = "/_dist/main.js";

    const file = Bun.file(`${SRC}${pathname}`);
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Dev server: http://localhost:${PORT}`);

watch(SRC, { recursive: true }, async (_, filename) => {
  if (filename?.endsWith(".ts") && !filename.startsWith("_dist")) {
    await buildJS();
    console.log("Rebuilt JS");
  }
});
