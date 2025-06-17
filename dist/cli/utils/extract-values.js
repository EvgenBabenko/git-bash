const extractValues = (args, flagsWithValues)=>{
    const values = [];
    for(let i = 0; i < args.length; i++){
        const current = args[i];
        if (current.startsWith("-")) {
            if (flagsWithValues.includes(current)) i++;
            continue;
        }
        values.push(current);
    }
    return values;
};
export { extractValues };
