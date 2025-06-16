/**
 *  @description doesn't work with combined flags like "-rf", please use normalizeArgs before
 */
export const parseArgs = (args: string[]) => {
  const map = new Map<string, string>();

  for (let i = 0; i < args.length; i++) {
    const current = args[i];

    if (current.startsWith("-")) {
      // Single flag
      const next = args[i + 1];

      if (next && !next.startsWith("-")) {
        map.set(current, next);
        map.set(next, "");
        i++; // Skip next since it's used as a value
      } else {
        map.set(current, "");
      }
    } else {
      // Standalone value
      map.set(current, "");
    }
  }

  return map;
};
