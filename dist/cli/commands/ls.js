import { jsx } from "react/jsx-runtime";
const ls = {
    name: "ls",
    description: "List information about the FILEs (the current directory by default).",
    run: ({ cli })=>{
        const children = cli.getChildren();
        if (!children) return /*#__PURE__*/ jsx("div", {
            children: "no such files or directories"
        });
        return children.map((item)=>/*#__PURE__*/ jsx("div", {
                children: "folder" === item.type ? `${item.name}/` : item.name
            }, item.name));
    }
};
export { ls };
