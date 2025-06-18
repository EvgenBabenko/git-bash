# Git Bash but written on React

A fully interactive terminal emulator component for React apps, powered by a custom CLI engine. Designed to simulate real command-line interactions in the browser with command processing, history tracking, dynamic prompts, and customizable initialization.

## Demo

https://evgenbabenko.github.io/git-bash/

## ⚙️ Features

- Parses and handles user input like a real terminal
- Displays command output history
- Accepts prompt inputs (e.g. questions like "Continue? [y/n]")
- Focus management (auto-focus input on click)
- Custom initialization support (e.g. show help or onboarding message)
- External CLI tree injection (command structure)

## 📦 Installation

Sorry don't have npm registry yet, so you can install this package via tag, please check latest tag version before installation, update also only work via manual install with latest tag

```bash
npm i github:EvgenBabenko/git-bash#v[LATEST_TAG]
```

add styles to index.ts

```typescript
import "git-bash/dist/index.css";
```

## 🧱 Usage

```typescript
import { Terminal, type Tree } from "git-bash";
import "git-bash/dist/index.css";

const tree: Tree = {
  name: "root",
  type: "folder",
  path: "",
  children: [
    {
      name: "hello",
      type: "file",
      path: "hello",
      content: "Hello World!",
      children: [],
    },
  ],
};

function App() {
  return <Terminal tree={tree} />;
}
```

Type `./hello` in terminal, it returns `Hello World!`

## 🧩 Props

| Prop     | Type                                                                | Required | Description                                                              |
| -------- | ------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `tree`   | `Tree`                                                              | ✅       | CLI command tree that defines available structure                        |
| `onInit` | `(props: { path: string, userName: string }) => Promise<ReactNode>` | ❌       | Optional async init logic. Can return a React element shown during setup |

## 📤 Emits Events

The terminal listens to global events via an internal emitter:

| Event Name          | Description                                   |
| ------------------- | --------------------------------------------- |
| `EXIT`              | Exit the shell                                |
| `PATH`              | Updates current working path                  |
| `CLEAR`             | Clears the terminal history                   |
| `PROCESSING_STATUS` | Enables/disables user input                   |
| `INITIALIZATION`    | Toggles initialization UI state               |
| `UPDATE_ITEM`       | Updates an individual command output          |
| `ADD_ITEM`          | Appends a new command to the terminal history |
| `PROMPT`            | Displays an interactive input prompt          |

```typescript
import { emitter } from "git-bash";

useEffect(() => {
  emitter.on("PATH", console.log);

  return () => {
    emitter.off("PATH");
  };
}, []);
```
