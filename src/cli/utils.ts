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
  CLI_INITIALIZATION: boolean;
  CLI_PROCESSING_STATUS: boolean;
  CLI_CLEAR: void;
  CLI_PATH: string;
  CLI_EXIT: void;
  CLI_UPDATE_ITEM: Item;
  CLI_ADD_ITEM: Item;
  CLI_PROMPT: PromtItem;
};

export const emitter = mitt<Events>();

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
