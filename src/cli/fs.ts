export type InitTree =
  | {
      type: "folder";
      name: string;
      children: InitTree[];
    }
  | {
      type: "file";
      name: string;
      content: React.FC | string;
    };

export type Tree =
  | {
      type: "folder";
      name: string;
      path: string;
      children: Tree[];
      createdAt: string;
      updatedAt?: string;
    }
  | {
      type: "file";
      name: string;
      path: string;
      content: React.FC | string;
      createdAt: string;
      updatedAt?: string;
    };

export class Fs {
  public path = "";
  private children: Tree[] | null = null;
  private tree: Tree = {
    type: "folder",
    name: "root",
    path: "",
    createdAt: new Date().toISOString(),
    children: [],
  };

  constructor() {}

  getChildren(path?: string) {
    const children = this._getChildren(path);
    this.children = children;

    return children;
  }

  private _getChildren(path?: string): Tree[] | null {
    function inner(tree: Tree, targetPath: string): Tree[] | null {
      if (tree.type === "file") return null;

      if (tree.path === targetPath) {
        return tree.children || [];
      }

      if (tree.children.length > 0) {
        for (let item of tree.children) {
          if (item.type === "folder") {
            const result = inner(item, targetPath);

            if (result !== null) {
              return result;
            }
          }
        }
      }

      return null;
    }

    return inner(this.tree, path ?? this.path);
  }

  createFile(name: string, content: React.FC | string) {
    if (!this.children) {
      throw new Error("unexpected error");
    }

    const file = this.find(name);

    if (file) {
      throw new Error("");
    }

    this.children.push({
      type: "file",
      name,
      path: `${this.path}"/"${name}`,
      createdAt: new Date().toISOString(),
      content,
    });
  }

  createFolder(name: string, children: Tree[]) {
    if (!this.children) {
      throw new Error("unexpected error");
    }

    const dir = this.find(name);

    if (dir) {
      throw new Error("cannot create directory '${name}': File exists");
    }

    this.children.push({
      type: "folder",
      name,
      path: `${this.path}"/"${name}`,
      createdAt: new Date().toISOString(),
      children,
    });
  }

  delete(elem: Tree) {
    if (!this.children) {
      throw new Error("unexpected error");
    }

    this.children.splice(this.children.indexOf(elem), 1);
  }

  find(name: string) {
    if (!this.children) {
      throw new Error("unexpected error");
    }

    return this.children?.find((el) => el.name === name);
  }

  add(path: string, item: InitTree[]) {
    function inner(tree: Tree, targetPath: string, items: InitTree[]) {
      if (tree.type === "file") return;

      if (tree.path === targetPath) {
        tree.children = items;
        return;
      }

      if (tree.children.length > 0) {
        for (let item of tree.children) {
          if (item.type === "folder") {
            inner(item, targetPath, items);
          }
        }
      }
    }

    inner(this.tree, path, item);
  }
}
