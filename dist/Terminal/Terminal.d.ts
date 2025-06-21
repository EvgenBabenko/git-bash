import React from "react";
import { Tree } from "../cli/core";
interface Props {
    tree: Tree;
    onInit?: (props: {
        path: string;
        userName: string;
    }) => Promise<void | React.ReactNode>;
    userName?: string;
}
export declare const Terminal: ({ onInit, tree, userName }: Props) => import("react/jsx-runtime").JSX.Element | null;
export {};
