import { it } from "node:test";
import assert from "node:assert/strict";
import { normalizeArgs } from "./normalize-args";

it("normalizes combined short flags", () => {
  const input = [
    "git",
    "-rf",
    "-t",
    "value1",
    "-g",
    "value2",
    "--help",
    "--g=value",
  ];
  const expected = [
    "git",
    "-r",
    "-f",
    "-t",
    "value1",
    "-g",
    "value2",
    "--help",
    "--g=value",
  ];
  const result = normalizeArgs(input);
  assert.deepEqual(result, expected);
});

it("does not split long flags", () => {
  const input = ["--help", "--verbose", "--g=value"];
  const expected = ["--help", "--verbose", "--g=value"];
  const result = normalizeArgs(input);
  assert.deepEqual(result, expected);
});

it("does not split single short flags", () => {
  const input = ["-a", "-b", "file.txt"];
  const expected = ["-a", "-b", "file.txt"];
  const result = normalizeArgs(input);
  assert.deepEqual(result, expected);
});

it("handles empty input", () => {
  const input: string[] = [];
  const expected: string[] = [];
  const result = normalizeArgs(input);
  assert.deepEqual(result, expected);
});

it("handles positional arguments untouched", () => {
  const input = ["file1.txt", "file2.txt", "script.js"];
  const expected = ["file1.txt", "file2.txt", "script.js"];
  const result = normalizeArgs(input);
  assert.deepEqual(result, expected);
});

it("handles mixed combined and single flags", () => {
  const input = ["-abc", "-d", "--long", "value", "-ef"];
  const expected = ["-a", "-b", "-c", "-d", "--long", "value", "-e", "-f"];
  const result = normalizeArgs(input);
  assert.deepEqual(result, expected);
});
