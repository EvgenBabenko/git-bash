import React from "react";
import { Minus, Square, X } from "lucide-react";
import logo from "@/assets/img/git-bash.webp";

const Header = ({ userName, path }: { userName: string; path: string }) => {
  const pathHeader = `MINGW64:/c/${userName}${path ? `/${path}` : ""}`;

  return (
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
  );
};

interface Props extends React.PropsWithChildren {
  path: string;
  terminalRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
}

export const Shell = ({ children, path, terminalRef, userName }: Props) => {
  return (
    <div className="text-left border border-white bg-black mx-auto text-sm w-full h-full flex flex-col">
      <Header userName={userName} path={path} />

      <div
        className="flex-1 overflow-y-auto p-1 text-xs font-mono break-all"
        ref={terminalRef}
      >
        {children}
      </div>
    </div>
  );
};
