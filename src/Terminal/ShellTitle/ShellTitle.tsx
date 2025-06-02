interface Props {
  path: string;
  userName: string;
}

export const ShellTitle = ({ path, userName }: Props) => {
  const pathSegments = path.split("/").filter(Boolean).join("/");

  return (
    <span>
      <span style={{ color: "#00cc00" }}>
        {userName}@{window.navigator.platform}
      </span>{" "}
      <span style={{ color: "#cc00cc" }}>MINGW64</span>{" "}
      <span style={{ color: "#cccc00" }}>
        ~{pathSegments.length > 0 ? `/${pathSegments}` : ""}
      </span>
    </span>
  );
};
