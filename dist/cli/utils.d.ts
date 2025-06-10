import { Item } from "./core";
export declare function scrollToBottom(ref: React.RefObject<HTMLDivElement | null>): void;
type Events = {
    CLI_INITIALIZATION: boolean;
    CLI_PROCESSING_STATUS: boolean;
    CLI_CLEAR: void;
    CLI_PATH: string;
    CLI_EXIT: void;
    CLI_ON_UPDATE_ITEM: Item;
    CLI_ON_ADD_ITEM: Item;
};
export declare const emitter: import("mitt").Emitter<Events>;
export declare function delay(ms: number): Promise<unknown>;
export {};
