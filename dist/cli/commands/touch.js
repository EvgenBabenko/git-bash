import { parseArgs } from "../utils/parse-args.js";
const touch = {
    name: "touch",
    description: "Create the FILE(s).",
    help: "Usage: touch [OPTION]... FILE...",
    run: ({ cli, args: [, ...rest] })=>{
        const argv = parseArgs(rest);
        const toCreate = [
            ...argv
        ].map((el)=>el[0]).filter((el)=>!el.includes("-"));
        const children = cli.getChildren();
        if (!children) return "unexpected error";
        toCreate.forEach((el)=>{
            const item = children.find((item)=>item.name === el);
            if (item) return "";
            children.push({
                name: el,
                type: "file",
                path: `${cli.path}"/"${el}`,
                children: []
            });
        });
        return "";
    }
};
export { touch };
