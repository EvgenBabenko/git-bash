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

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
