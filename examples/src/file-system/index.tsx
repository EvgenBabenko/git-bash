import { Tree } from "@lib/cli/core";
import { Hello } from "./Hello/Hello";

export const tree: Tree = {
  name: "root",
  type: "folder",
  path: "",
  children: [
    {
      name: "file1.sh",
      type: "file",
      path: "file1.sh",
      content: () => <div>Hello World</div>,
    },
    {
      name: "hello.sh",
      type: "file",
      path: "hello.sh",
      content: Hello,
    },
    {
      name: "file2.sh",
      type: "file",
      path: "file2.sh",
      content: "Hello World!",
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
          content: "",
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
              content: "",
            },
          ],
        },
      ],
    },
  ],
};
