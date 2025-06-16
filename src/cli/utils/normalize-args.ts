export function normalizeArgs(args: string[]) {
  const result: string[] = [];

  for (const arg of args) {
    // If it's a combined short flags (starts with '-' but not '--' and length > 2)
    if (arg.startsWith("-") && !arg.startsWith("--") && arg.length > 2) {
      // split all letters after the first dash into separate flags
      for (let i = 1; i < arg.length; i++) {
        result.push(`-${arg[i]}`);
      }
    } else {
      result.push(arg);
    }
  }

  return result;
}
