import { jsx, jsxs } from "react/jsx-runtime";
function help(regisrty) {
    return {
        name: "help",
        description: "Display information about built-in commands",
        run: ({ args: [, commandInput] })=>{
            const commands = regisrty.getAll();
            if (commandInput) {
                const command = commands.find((c)=>c.name === commandInput);
                return command?.help ?? `bash: help: no help topics match "${commandInput}".`;
            }
            return /*#__PURE__*/ jsxs("div", {
                children: [
                    /*#__PURE__*/ jsx("div", {
                        children: "GNU bash, version 5.1.16(1)-release (x86_64-pc-msys)"
                    }),
                    /*#__PURE__*/ jsx("div", {
                        children: "These shell commands are defined internally. Type `help' to see this list."
                    }),
                    /*#__PURE__*/ jsx("br", {}),
                    commands.map((c)=>/*#__PURE__*/ jsxs("div", {
                            children: [
                                c.name,
                                ": ",
                                c.description
                            ]
                        }, c.name))
                ]
            });
        }
    };
}
export { help };
