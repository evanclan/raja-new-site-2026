import sharp from "sharp";
import { readFile, writeFile, stat } from "node:fs/promises";
import { globSync } from "node:fs";
import path from "node:path";

const PUB = "public";
const kb = (n) => (n / 1024).toFixed(0) + "KB";
let before = 0, after = 0;

// 1) SVGs that wrap a giant embedded photo but render tiny. Downscale the
//    embedded raster, keep the SVG structure/path/viewBox untouched.
const svgs = globSync(`${PUB}/kaeruryugaku/home-assets/[1-6].svg`);
for (const file of svgs) {
  const orig = await readFile(file, "utf8");
  const b0 = Buffer.byteLength(orig);
  const re = /data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+?)(?=["')])/g;
  let out = orig, m, changed = false;
  while ((m = re.exec(orig))) {
    const fmt = m[1].startsWith("jp") ? "jpeg" : "png";
    const raw = Buffer.from(m[2].replace(/\s+/g, ""), "base64");
    let img = sharp(raw).resize({ width: 700, height: 700, fit: "inside", withoutEnlargement: true });
    img = fmt === "jpeg" ? img.jpeg({ quality: 78 }) : img.png({ compressionLevel: 9 });
    const small = await img.toBuffer();
    out = out.replace(m[2], small.toString("base64"));
    changed = true;
  }
  if (changed) {
    await writeFile(file, out);
    const b1 = Buffer.byteLength(out);
    before += b0; after += b1;
    console.log(`svg  ${path.basename(file)}  ${kb(b0)} -> ${kb(b1)}`);
  }
}

// 2) Oversized standalone rasters. Cap longest side; keep format (transparency).
const rasters = globSync(`${PUB}/**/*.{png,jpg,jpeg}`);
for (const file of rasters) {
  const b0 = (await stat(file)).size;
  if (b0 < 1024 * 1024) continue; // only touch files > 1MB
  const meta = await sharp(file).metadata();
  const cap = file.includes("logo") ? 1024 : 2000;
  if (Math.max(meta.width, meta.height) <= cap) continue;
  let img = sharp(file).resize({ width: cap, height: cap, fit: "inside", withoutEnlargement: true });
  const isJpg = /\.jpe?g$/i.test(file);
  img = isJpg ? img.jpeg({ quality: 82, mozjpeg: true }) : img.png({ compressionLevel: 9, quality: 90 });
  const buf = await img.toBuffer();
  if (buf.length < b0) {
    await writeFile(file, buf);
    before += b0; after += buf.length;
    console.log(`img  ${path.relative(PUB, file)}  ${kb(b0)} -> ${kb(buf.length)}`);
  }
}

console.log(`\nTOTAL  ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB`);
