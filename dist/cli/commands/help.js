import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function help(regisrty) {
    return {
        name: "help",
        description: "Display information about built-in commands",
        run: ()=>{
            const commands = regisrty.getAll();
            return /*#__PURE__*/ jsxs(Fragment, {
                children: [
                    "Git Bash React, written by EvgenBabenko ",
                    /*#__PURE__*/ jsx("br", {}),
                    "These shell commands are defined internally. ",
                    /*#__PURE__*/ jsx("br", {}),
                    "Type `name --help` to find out more about the function `name`. ",
                    /*#__PURE__*/ jsx("br", {}),
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
