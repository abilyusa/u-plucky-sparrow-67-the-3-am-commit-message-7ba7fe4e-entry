// The 3 AM Commit Message — writes one commit message to entry.txt.
//
// Gate (kit RULES.txt): /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Deterministic, no network, no reads
// outside this repository.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "fix(prod): at 3 AM I shipped a one-line improvement with high confidence; prod is down, CI is green, and the rollback button is now my manager";

function main(): void {
  // Gate: 1 to 200 characters, not only white space, single line.
  if (!(LINE.length >= 1 && LINE.length <= 200)) {
    throw new Error(`line must be 1-200 characters, got ${LINE.length}`);
  }
  if (!LINE.trim()) {
    throw new Error("line must not be only white space");
  }
  if (LINE.includes("\n")) {
    throw new Error("line must be a single line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, "entry.txt");
  writeFileSync(path, LINE, "utf8");
  // Read back and verify the file holds exactly the line, nothing else.
  const written = readFileSync(path, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the line");
  }
}

main();
