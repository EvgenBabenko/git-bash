export declare class CommandHistory {
    private commands;
    private index;
    add(command: string): void;
    prev(): string;
    next(): string;
    reset(): void;
}
