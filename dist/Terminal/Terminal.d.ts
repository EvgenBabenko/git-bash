import React from "react";
import { Tree } from "../cli/core";
interface Props {
    tree: Tree;
    onInit?: (props: {
        path: string;
        userName: string;
    }) => Promise<void | React.ReactNode>;
}
export declare const Terminal: ({ onInit, tree }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
