import sharp from "sharp";
import { readFile, writeFile, stat } from "node:fs/promises";
import { globSync } from "node:fs";
import path from "node:path";

const kb = (n) => (n / 1024).toFixed(0) + "KB";

// SVG icons render at ~50px. Shrink embedded raster to 360px + quantize,
// preserving alpha (keep PNG) so masked/clipped shapes stay intact.
for (const file of globSync("public/kaeruryugaku/home-assets/[1-6].svg")) {
  const orig = await readFile(file, "utf8");
  const b0 = Buffer.byteLength(orig);
  const re = /data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+?)(?=["')])/g;
  let out = orig, m;
  while ((m = re.exec(orig))) {
    const fmt = m[1].startsWith("jp") ? "jpeg" : "png";
    const raw = Buffer.from(m[2].replace(/\s+/g, ""), "base64");
    let img = sharp(raw).resize({ width: 360, height: 360, fit: "inside", withoutEnlargement: true });
    img = fmt === "jpeg" ? img.jpeg({ quality: 72 }) : img.png({ quality: 60, compressionLevel: 9 });
    const small = await img.toBuffer();
    out = out.replace(m[2], small.toString("base64"));
  }
  await writeFile(file, out);
  console.log(`svg  ${path.basename(file)}  ${kb(b0)} -> ${kb(Buffer.byteLength(out))}`);
}

// Standalone PNG photos > 1MB: quantize (preserves alpha), cap 1400px.
for (const file of globSync("public/**/*.png")) {
  const b0 = (await stat(file)).size;
  if (b0 < 1024 * 1024) continue;
  const buf = await sharp(file)
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .png({ quality: 76, compressionLevel: 9 })
    .toBuffer();
  if (buf.length < b0) {
    await writeFile(file, buf);
    console.log(`img  ${path.relative("public", file)}  ${kb(b0)} -> ${kb(buf.length)}`);
  }
}
