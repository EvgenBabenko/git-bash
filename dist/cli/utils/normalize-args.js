function normalizeArgs(args) {
    const result = [];
    for (const arg of args)if (arg.startsWith("-") && !arg.startsWith("--") && arg.length > 2) for(let i = 1; i < arg.length; i++)result.push(`-${arg[i]}`);
    else result.push(arg);
    return result;
}
export { normalizeArgs };
