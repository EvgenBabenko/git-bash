import { it } from "node:test";
import assert from "node:assert/strict";
import { extractValues } from "./extract-values";

it("extracts values not associated with flags", () => {
  const args: string[] = ["-p", "value", "-r", "value1", "-f", "value2"];
  const flagsWithValues: string[] = ["-p"];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, ["value1", "value2"]);
});

it("handles no flags with values", () => {
  const args: string[] = ["-a", "-b", "pos1", "-c", "pos2"];
  const flagsWithValues: string[] = [];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, ["pos1", "pos2"]);
});

it("handles multiple flags with values", () => {
  const args: string[] = ["-x", "1", "extra", "-y", "2", "file.txt"];
  const flagsWithValues: string[] = ["-x", "-y"];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, ["extra", "file.txt"]);
});

it("ignores flag values from being treated as positional", () => {
  const args: string[] = ["-o", "out.txt", "-f", "config.json"];
  const flagsWithValues: string[] = ["-o", "-f"];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, []);
});

it("handles standalone values only", () => {
  const args: string[] = ["file1.txt", "file2.txt"];
  const flagsWithValues: string[] = [];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, ["file1.txt", "file2.txt"]);
});

it("handles empty input", () => {
  const args: string[] = [];
  const flagsWithValues: string[] = [];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, []);
});

it("handles consecutive flags with values", () => {
  const args: string[] = ["-a", "val1", "-b", "val2", "-c"];
  const flagsWithValues: string[] = ["-a", "-b"];
  const result = extractValues(args, flagsWithValues);
  assert.deepEqual(result, []);
});
