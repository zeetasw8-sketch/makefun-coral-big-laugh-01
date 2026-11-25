import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_JOKE_LENGTH = 200;
const SENTENCE_TERMINATORS = /[.!?]/;

function fail(message: string): never {
  throw new Error(message);
}

function checkJokeLength(joke: string): void {
  if (joke.length === 0 || joke.length > MAX_JOKE_LENGTH) {
    fail("line must be 1-200 characters");
  }
}

function countSentences(joke: string): number {
  return joke.split(SENTENCE_TERMINATORS).filter((part) => part.length > 0).length;
}

function checkSingleSentence(joke: string): void {
  if (countSentences(joke) !== 1) {
    fail("line must be a single sentence");
  }
}

function loadJokeLine(sourceDir: string): string {
  const raw = readFileSync(join(sourceDir, "entry.txt"), "utf8");
  const joke = raw.trim();
  checkJokeLength(joke);
  checkSingleSentence(joke);
  return joke;
}

function publishJoke(joke: string, destinationDir: string): void {
  mkdirSync(destinationDir, { recursive: true });
  writeFileSync(join(destinationDir, "entry.txt"), joke);
}

function run(): void {
  const projectDir = dirname(fileURLToPath(import.meta.url));
  const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const joke = loadJokeLine(projectDir);
  publishJoke(joke, destinationDir);
  console.log(joke);
}

run();
