import React from "react";
import { Minus, Square, X } from "lucide-react";
import logo from "./git-bash.png";

interface Props extends React.PropsWithChildren {
  path: string;
  terminalRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
}

export const Shell = ({ children, path, terminalRef, userName }: Props) => {
  const pathHeader = `MINGW64:/c/${userName}${path ? `/${path}` : ""}`;

  return (
    <div className="text-left border border-white bg-black mx-auto text-sm w-full max-w-[600px]">
      <div className="bg-white p-[6px_4px] flex items-center justify-between text-black">
        <div className="flex items-center justify-center gap-x-1">
          <img src={logo} width="16" height="16" />
          {pathHeader}
        </div>
        <div className="flex items-center justify-center gap-x-3">
          <Minus strokeWidth={1} size={16} />
          <Square strokeWidth={1} size={16} />
          <X strokeWidth={1} size={16} />
        </div>
      </div>
      <div
        className="overflow-y-auto h-[250px] p-1 text-sm font-[Roboto_Mono]"
        ref={terminalRef}
      >
        {children}
      </div>
    </div>
  );
};
