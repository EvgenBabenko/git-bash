import { it } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "./parse-args";

it("parses single flags with values", () => {
  const args = ["-f", "test"];
  const result = parseArgs(args);
  assert.deepEqual(Object.fromEntries(result), {
    "-f": "test",
    test: "",
  });
});

it("parses standalone flags without values", () => {
  const args = ["-r"];
  const result = parseArgs(args);
  assert.deepEqual(Object.fromEntries(result), {
    "-r": "",
  });
});

it("parses a mixture of combined, single, and standalone values", () => {
  const args = ["-r", "-f", "test", "-p", "folder"];
  const result = parseArgs(args);
  assert.deepEqual(Object.fromEntries(result), {
    "-r": "",
    "-f": "test",
    test: "",
    "-p": "folder",
    folder: "",
  });
});

it("parses repeated flags", () => {
  const args = ["-a", "1", "-a", "2"];
  const result = parseArgs(args);
  assert.deepEqual(Object.fromEntries(result), {
    "1": "",
    "-a": "2",
    "2": "",
  });
});

it("handles flag followed by another flag (no value)", () => {
  const args = ["-x", "-y"];
  const result = parseArgs(args);
  assert.deepEqual(Object.fromEntries(result), {
    "-x": "",
    "-y": "",
  });
});

it("parses standalone values not associated with a flag", () => {
  const args = ["file.txt"];
  const result = parseArgs(args);
  assert.deepEqual(Object.fromEntries(result), {
    "file.txt": "",
  });
});
