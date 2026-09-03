import type { ReactNode } from "react";

type ImportantNoteProps = {
  title?: string;
  children: ReactNode;
};

export const ImportantNote = ({ title = "Important", children }: ImportantNoteProps) => (
  <aside role="note" className="rounded-lg border border-amber-400/40 bg-amber-300/10 p-4 text-amber-50">
    <h3 className="font-semibold">{title}</h3>
    <div className="mt-2">{children}</div>
  </aside>
);
