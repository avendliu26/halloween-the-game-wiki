import type { ReactNode } from "react";

type ContentShellProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function ContentShell({ children, className }: ContentShellProps) {
  return <div className={["content-shell", className].filter(Boolean).join(" ")}>{children}</div>;
}
