"use client";

import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  ariaLabel?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-blue-600" : "bg-slate-200"}`}
        aria-label={ariaLabel || label || "Toggle"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
      {label ? (
        <span className="text-sm font-medium text-muted-foreground select-none">
          {label}
        </span>
      ) : null}
    </div>
  );
}
