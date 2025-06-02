import React from "react";
import { Minus, Square, X } from "lucide-react";
import logo from "./git-bash.png";

interface Props extends React.PropsWithChildren {
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
  path: string;
  terminalRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
}

export const Shell = ({
  children,
  onClose,
  onMinimize,
  onExpand,
  path,
  terminalRef,
  userName,
}: Props) => {
  const pathArr = path.split("/").filter(Boolean).join("/");
  const pathHeader = `MINGW64:/c/${userName}${
    pathArr.length > 0 ? `/${pathArr}` : ""
  }`;

  return (
    <div className="text-left border border-white bg-black mx-auto text-sm">
      <div className="bg-white p-[6px_4px] flex items-center justify-between text-black">
        <div className="flex items-center justify-center gap-x-1">
          <img src={logo} width="16" height="16" />
          {pathHeader}
        </div>
        <div className="flex items-center justify-center gap-x-3">
          <Minus
            strokeWidth={1}
            size={16}
            onClick={onMinimize}
            className="cursor-pointer"
          />
          <Square
            strokeWidth={1}
            size={16}
            onClick={onExpand}
            className="cursor-pointer"
          />
          <X
            strokeWidth={1}
            size={16}
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div
        className="overflow-y-auto h-[200px] p-1 text-sm font-[Roboto_Mono]"
        ref={terminalRef}
      >
        {children}
      </div>
    </div>
  );
};
