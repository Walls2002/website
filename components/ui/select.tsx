"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronIcon, CheckIcon } from "@/components/icons";
import { gsap } from "@/lib/gsap";

export type SelectOption = { value: string; label: string };

type Props = {
  label: string;
  name?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  className?: string;
};

/**
 * Accessible custom dropdown. The open wrapper is raised to z-40 and the panel
 * to z-50 so it always paints above neighbouring fields, cards and sections.
 */
export function Select({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select…",
  hideLabel,
  className = "",
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === value),
    ),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: -6, scaleY: 0.96 },
        { autoAlpha: 1, y: 0, scaleY: 1, duration: 0.22, ease: "power2.out", transformOrigin: "top center" },
      );
    }
  }, [open]);

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) e.preventDefault();
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) return setOpen(true);
    if (e.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    if (e.key === "Enter" || e.key === " ") choose(active);
  };

  return (
    <div ref={rootRef} className={`relative ${open ? "z-40" : "z-0"} ${className}`}>
      <span id={`${id}-label`} className={hideLabel ? "sr-only" : "mb-2 block text-sm font-medium text-ink"}>
        {label}
      </span>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left text-[15px] transition-colors ${
          open ? "border-brand ring-4 ring-brand/10" : "border-oat-line hover:border-brand-soft"
        }`}
      >
        <span className={`truncate ${selected ? "text-ink" : "text-muted"}`}>{selected?.label ?? placeholder}</span>
        <ChevronIcon className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          ref={panelRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-auto rounded-xl border border-oat-line bg-white p-1.5 shadow-xl shadow-ink/10"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[15px] ${
                i === active ? "bg-oat text-brand" : "text-ink"
              }`}
            >
              {o.label}
              {o.value === value && <CheckIcon className="size-4 text-brand" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
