import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { normalizeTags } from "@/lib/utils";
import type { TagOption } from "@/options/TagOptions";

const palette = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#60a5fa",
  "#7c3aed",
  "#f43f5e",
];

export const colorFor = (tag: string, options: TagOption[]) => {
  const found = options.find(
    (t) => t.value.toLowerCase() === tag.toLowerCase(),
  );
  if (found?.color) return found.color;
  // deterministic pick from palette based on hash
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h << 5) - h + tag.charCodeAt(i);
  const idx = Math.abs(h) % palette.length;
  return palette[idx];
};

interface TagInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  options: TagOption[];
  placeholder?: string;
}

export function TagInput({
  selectedTags,
  onChange,
  options,
  placeholder = "Add tags...",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const addTag = (tag: string) => {
    const normalized = normalizeTags(tag);
    if (normalized.length === 0) return;

    const newTags = Array.from(new Set([...selectedTags, ...normalized]));
    onChange(newTags);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedTags.length > 0
    ) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === "ArrowDown") {
      setIsOpen(true);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter(
      (opt) =>
        opt.label?.toLowerCase().includes(inputValue.toLowerCase()) ||
        opt.value.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue]);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex min-h-12 w-full flex-wrap items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm transition-colors cursor-text ${isOpen ? "border-slate-400 ring-4 ring-slate-100" : "border-slate-300 hover:border-slate-400"}`}
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 pl-2 pr-1 py-1 text-xs font-medium text-slate-700"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: colorFor(tag, options) }}
            />
            {tag}
            <button
              type="button"
              className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none min-w-30 py-1"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none rounded-full hover:bg-slate-100 transition-colors ml-auto"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
          <div className="max-h-60 overflow-y-auto p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const tag = opt.value;
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        removeTag(tag);
                      } else {
                        addTag(tag);
                      }
                      inputRef.current?.focus();
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span>{opt.label ?? opt.value}</span>
                    </span>
                    {isSelected && (
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-slate-500">
                {inputValue ? (
                  <>
                    Press{" "}
                    <kbd className="rounded border bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                      Enter
                    </kbd>{" "}
                    to add <strong>&quot;{inputValue}&quot;</strong>
                  </>
                ) : (
                  "No tags found"
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
