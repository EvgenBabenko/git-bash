/** @description converts ["-tg", "-r", "-f", test, -p folder] to { "-t": '', "-g": '', "-r": '', "-f": 'test', "test": '', "-p": 'folder', "folder": '' } */
export const parseArgs = (args: string[]) => {
  const map = new Map<string, string>();

  for (let i = 0; i < args.length; i++) {
    const current = args[i];

    if (current.startsWith("-") && current.length > 2) {
      // Handle combined flags like "-rf"
      const splitFlags = current
        .slice(1)
        .split("")
        .map((f) => `-${f}`);
      for (const flag of splitFlags) {
        map.set(flag, "");
      }
    } else if (current.startsWith("-")) {
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
