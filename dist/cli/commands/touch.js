import { extractValues } from "../utils/extract-values.js";
const touch = {
    name: "touch",
    description: "Create the FILE(s).",
    help: "Usage: touch [OPTION]... FILE...",
    run: ({ cli, args })=>{
        const toCreate = extractValues(args, []);
        const children = cli.getChildren();
        if (!children) return "unexpected error";
        toCreate.forEach((el)=>{
            const item = children.find((item)=>item.name === el);
            if (item) return "";
            children.push({
                type: "file",
                name: el,
                path: `${cli.path}"/"${el}`,
                createdAt: new Date().toISOString(),
                content: ""
            });
        });
        return "";
    }
};
export { touch };
