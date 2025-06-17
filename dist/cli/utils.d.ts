import { Item, PromtItem } from "./core";
export declare function scrollToBottom(ref: React.RefObject<HTMLDivElement | null>): void;
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
export declare const emitter: import("mitt").Emitter<Events>;
export declare function delay(ms: number): Promise<unknown>;
export {};
