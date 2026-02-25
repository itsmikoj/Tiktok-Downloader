import { cpSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "extension");
const dest = join(root, "dist");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

console.log(" - extension/ assets copied to dist/");
