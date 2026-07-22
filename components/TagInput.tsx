import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
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
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !(dropdownRef.current && dropdownRef.current.contains(target))
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

  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updateDropdownRect = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDropdownRect({
          left: rect.left,
          top: rect.bottom,
          width: rect.width,
        });
      }
    };

    updateDropdownRect();
    window.addEventListener("resize", updateDropdownRect);
    window.addEventListener("scroll", updateDropdownRect, true);

    return () => {
      window.removeEventListener("resize", updateDropdownRect);
      window.removeEventListener("scroll", updateDropdownRect, true);
    };
  }, [isOpen]);

  return (
    <div className="relative z-60" ref={containerRef}>
      <div
        className={`flex min-h-12 w-full flex-wrap items-center gap-2 rounded-2xl border bg-slate-900/90 px-3 py-2 text-sm text-slate-100 transition-colors cursor-text ${isOpen ? "border-slate-500 ring-4 ring-slate-700/40" : "border-white/10 hover:border-slate-500"}`}
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-800/80 pl-2 pr-1 py-1 text-xs font-medium text-slate-200"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: colorFor(tag, options) }}
            />
            {tag}
            <button
              type="button"
              className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors focus:outline-none"
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
          className="min-w-30 flex-1 bg-transparent py-1 outline-none text-slate-100 placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="ml-auto rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 focus:outline-none"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen &&
        dropdownRect &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              left: dropdownRect.left,
              top: dropdownRect.top,
              width: dropdownRect.width,
            }}
            className="z-70 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_18px_45px_-15px_rgba(0,0,0,0.7)] backdrop-blur"
          >
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
                          ? "bg-slate-800 text-slate-100"
                          : "text-slate-300 hover:bg-slate-800/70"
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
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-400">
                  {inputValue ? (
                    <>
                      Press{" "}
                      <kbd className="rounded border border-white/10 bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-200">
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
          </div>,
          document.body,
        )}
    </div>
  );
}
