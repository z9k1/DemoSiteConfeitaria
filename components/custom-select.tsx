"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
};

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  className = ""
}: CustomSelectProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(() => {
    const idx = options.findIndex((opt) => opt.value === value);
    return idx >= 0 ? idx : 0;
  });

  const selected = useMemo(() => options.find((opt) => opt.value === value), [options, value]);

  useEffect(() => {
    const idx = options.findIndex((opt) => opt.value === value);
    if (idx >= 0) setHighlightedIndex(idx);
  }, [options, value]);

  useEffect(() => {
    if (!open) return;

    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If there's not enough room for the dropdown + a little breathing space, open upward.
      setOpenUp(spaceBelow < 280);
    }

    // Focus list so arrow key nav feels immediate.
    queueMicrotask(() => listRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onDocPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (!wrapperRef.current?.contains(target)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const opt = options[highlightedIndex];
        if (!opt) return;
        onChange(opt.value);
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onDocPointerDown);
    document.addEventListener("touchstart", onDocPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("touchstart", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [highlightedIndex, onChange, open, options]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-idx="${highlightedIndex}"]`);
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-rose-200 bg-white px-6 !text-lg text-cocoa-900 outline-none ring-cocoa-700/30 transition focus:ring"
      >
        <span className={`${selected ? "text-cocoa-900" : "text-cocoa-500"}`}>{selected?.label ?? placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 flex-none text-cocoa-700 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          ref={listRef}
          tabIndex={-1}
          role="listbox"
          aria-label="Opções"
          className={`absolute z-50 w-full overflow-auto rounded-lg border border-rose-100 bg-white shadow-soft focus:outline-none max-h-60 ${
            openUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.map((opt, idx) => {
            const active = idx === highlightedIndex;
            const selectedOpt = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selectedOpt}
                data-idx={idx}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-base transition ${
                  active ? "bg-rose-50 text-cocoa-900" : "text-cocoa-800 hover:bg-rose-50"
                }`}
              >
                <span>{opt.label}</span>
                {selectedOpt ? (
                  <span className="text-cocoa-700" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

