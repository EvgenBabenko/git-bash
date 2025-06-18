import { Tree } from "@lib/cli/core";
import { Hello } from "./Hello/Hello";

export const tree: Tree = {
  name: "root",
  type: "folder",
  path: "",
  createdAt: "2023-08-11T12:34:56Z",
  children: [
    {
      name: "file1.sh",
      type: "file",
      path: "file1.sh",
      createdAt: "2023-08-22T12:34:56Z",
      content: () => <div>Hello World</div>,
    },
    {
      name: "hello.sh",
      type: "file",
      path: "hello.sh",
      createdAt: "2023-08-15T12:34:56Z",
      content: Hello,
    },
    {
      name: "file2.sh",
      type: "file",
      path: "file2.sh",
      createdAt: "2023-08-11T12:34:56Z",
      content: "Hello World!",
    },
    {
      name: "folder",
      type: "folder",
      path: "folder",
      createdAt: "2023-08-11T12:34:56Z",
      children: [
        {
          name: "index.html",
          type: "file",
          path: "folder/index.html",
          createdAt: "2023-08-11T12:34:56Z",
          content: "",
        },
        {
          name: "folder2",
          type: "folder",
          path: "folder/folder2",
          createdAt: "2023-08-11T12:34:56Z",
          children: [
            {
              name: "index.html",
              type: "file",
              path: "folder/folder2/index.html",
              content: "",
              createdAt: "2023-08-11T12:34:56Z",
            },
          ],
        },
      ],
    },
  ],
};
