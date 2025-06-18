import React from "react";

interface Props extends React.ComponentProps<"textarea"> {}

export const Input = ({ ref, onKeyDown }: Props) => {
  return (
    <textarea
      ref={ref}
      className="bg-transparent border-none outline-none pl-3 w-full resize-none"
      style={{
        caretColor: "white",
        minHeight: "1.5em",
        lineHeight: "1.5",
      }}
      rows={1}
      onKeyDown={onKeyDown}
      onInput={(e) => {
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
      }}
    />
  );
};
