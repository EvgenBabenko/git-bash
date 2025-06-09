import { jsx } from "react/jsx-runtime";
const fs = {
    name: "root",
    type: "folder",
    path: "",
    children: [
        {
            name: "file1.sh",
            type: "file",
            path: "file1.sh",
            content: ()=>/*#__PURE__*/ jsx("div", {
                    children: "Hello World"
                }),
            children: []
        },
        {
            name: "file2.sh",
            type: "file",
            path: "file2.sh",
            content: "Hello World!",
            children: []
        },
        {
            name: "folder",
            type: "folder",
            path: "folder",
            children: [
                {
                    name: "index.html",
                    type: "file",
                    path: "folder/index.html",
                    children: [],
                    content: ""
                },
                {
                    name: "folder2",
                    type: "folder",
                    path: "folder/folder2",
                    children: [
                        {
                            name: "index.html",
                            type: "file",
                            path: "folder/folder2/index.html",
                            children: [],
                            content: ""
                        }
                    ]
                }
            ]
        }
    ]
};
export { fs };
