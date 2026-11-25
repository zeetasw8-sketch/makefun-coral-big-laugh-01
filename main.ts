import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ONE_LINE_LIMIT = 200;
const END_MARKS = /[.!?]/;

function abort(reason: string): never {
  throw new Error(reason);
}

function ensureNotBlank(text: string): void {
  if (text.length === 0) {
    abort("line must not be empty");
  }
}

function ensureWithinLimit(text: string): void {
  ensureNotBlank(text);
  if (text.length > ONE_LINE_LIMIT) {
    abort("line must be 1-200 characters");
  }
}

function sentenceFragments(text: string): string[] {
  return text.split(END_MARKS).filter((fragment) => fragment.length > 0);
}

function isSingleSentence(text: string): boolean {
  return sentenceFragments(text).length === 1;
}

function ensureSingleSentence(text: string): void {
  if (!isSingleSentence(text)) {
    abort("line must be a single sentence");
  }
}

const LINE_CHECKS: Array<(text: string) => void> = [
  ensureWithinLimit,
  ensureSingleSentence,
];

function readLineFrom(rootDir: string): string {
  const raw = readFileSync(join(rootDir, "entry.txt"), "utf8");
  const line = raw.trim();
  for (const check of LINE_CHECKS) {
    check(line);
  }
  return line;
}

function emitLine(line: string, outputDir: string): void {
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "entry.txt"), line);
}

function main(): void {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const line = readLineFrom(rootDir);
  emitLine(line, outputDir);
  console.log(line);
}

main();
