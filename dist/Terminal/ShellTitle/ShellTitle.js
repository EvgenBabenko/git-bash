import { jsx, jsxs } from "react/jsx-runtime";
const ShellTitle = ({ path, userName })=>/*#__PURE__*/ jsxs("span", {
        children: [
            /*#__PURE__*/ jsxs("span", {
                style: {
                    color: "#00cc00"
                },
                children: [
                    userName,
                    "@",
                    window.navigator.platform
                ]
            }),
            " ",
            /*#__PURE__*/ jsx("span", {
                style: {
                    color: "#cc00cc"
                },
                children: "MINGW64"
            }),
            " ",
            /*#__PURE__*/ jsxs("span", {
                style: {
                    color: "#cccc00"
                },
                children: [
                    "~",
                    path ? `/${path}` : ""
                ]
            })
        ]
    });
export { ShellTitle };
