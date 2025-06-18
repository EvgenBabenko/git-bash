import mitt from "mitt";
import { Item, PromtItem } from "./core";

export function scrollToBottom(ref: React.RefObject<HTMLDivElement | null>) {
  requestAnimationFrame(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  });
}

type Events = {
  INITIALIZATION: boolean;
  PROCESSING_STATUS: boolean;
  CLEAR: void;
  PATH: string;
  EXIT: void;
  UPDATE_ITEM: Item;
  ADD_ITEM: Item;
  PROMPT: PromtItem;
};

export const emitter = mitt<Events>();

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve();
    }, ms);

    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new Error("stopped"));
      });
    }
  });
}
