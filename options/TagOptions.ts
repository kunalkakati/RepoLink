export type TagOption = {
  id?: string;
  value: string;
  label?: string;
  color?: string;
};

// Default fallback values used when the database has no tags yet.
export const defaultTagOptions: TagOption[] = [
  { value: "javascript", label: "JavaScript", color: "#f7df1e" },
  { value: "typescript", label: "TypeScript", color: "#3178c6" },
  { value: "react", label: "React", color: "#61dafb" },
  { value: "nextjs", label: "Next.js", color: "#000000" },
  { value: "design", label: "Design", color: "#ff6b6b" },
  { value: "tool", label: "Tool", color: "#7c3aed" },
  { value: "library", label: "Library", color: "#06b6d4" },
  { value: "tutorial", label: "Tutorial", color: "#10b981" },
];

export const findFallbackTagOption = (value: string) =>
  defaultTagOptions.find((t) => t.value.toLowerCase() === value.toLowerCase());

export const suggestionList = () => defaultTagOptions.slice();
