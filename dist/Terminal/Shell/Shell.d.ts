import React from "react";
interface Props extends React.PropsWithChildren {
    path: string;
    terminalRef: React.RefObject<HTMLDivElement | null>;
    userName: string;
}
export declare const Shell: ({ children, path, terminalRef, userName }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
