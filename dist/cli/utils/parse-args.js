const parseArgs = (args)=>{
    const map = new Map();
    for(let i = 0; i < args.length; i++){
        const current = args[i];
        if (current.startsWith("-")) {
            const next = args[i + 1];
            if (next && !next.startsWith("-")) {
                map.set(current, next);
                map.set(next, "");
                i++;
            } else map.set(current, "");
        } else map.set(current, "");
    }
    return map;
};
export { parseArgs };
