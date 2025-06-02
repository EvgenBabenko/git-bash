import { Tree } from "../cli";

export const fs: Tree = {
  name: "root",
  type: "folder",
  path: "/",
  children: [
    {
      name: "hello.sh",
      type: "file",
      path: "/hello.sh",
      content: () => <div>Hello World</div>,
      children: [],
    },
    {
      name: "hello",
      type: "file",
      path: "/hello",
      content: "Hello World!",
      children: [],
    },
    {
      name: "projects",
      type: "folder",
      path: "/projects",
      children: [
        {
          name: "index.html",
          type: "file",
          path: "/projects/index.html",
          children: [],
          content: "",
        },
      ],
    },
  ],
};
