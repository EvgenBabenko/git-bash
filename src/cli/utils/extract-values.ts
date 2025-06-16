export const extractValues = (args: string[], flagsWithValues: string[]) => {
  const values: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const current = args[i];

    if (current.startsWith("-")) {
      if (flagsWithValues.includes(current)) {
        i++;
      }

      continue;
    }

    values.push(current);
  }

  return values;
};
