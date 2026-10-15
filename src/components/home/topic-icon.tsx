const paths: Record<string, string> = {
  Characters: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6m-3-3h6",
  Maps: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15",
  Challenges: "M8 3h8v5a4 4 0 0 1-8 0V3ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v6m-4 3h8m-6-3h4",
  "Michael Myers": "M12 3 4 7v6c0 4 8 8 8 8s8-4 8-8V7l-8-4ZM8 10l2 1m4 0 2-1m-7 6h6",
  Perks: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z",
  "How to Play": "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4Zm9 3a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3"
};
export function TopicIcon({ name }: { name: string }) {
  return <span className="topic-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] ?? paths["How to Play"]} /></svg></span>;
}
