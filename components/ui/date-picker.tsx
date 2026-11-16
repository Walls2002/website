"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronIcon } from "@/components/icons";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/lib/site";

type Props = {
  label: string;
  name?: string;
  /** Selected day as "YYYY-MM-DD" (local), or "" for none. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest pickable day, counted from today (0 = today). */
  minDaysAhead?: number;
  /** Latest pickable month, counted from the current one. */
  maxMonthsAhead?: number;
  placeholder?: string;
  /** One line under the calendar, e.g. the notice the business needs. */
  note?: string;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();
/** Same day of the month, n months on, clamped to the month's length (31 Jan + 1 = 28/29 Feb). */
const addMonths = (d: Date, n: number) => {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
};
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};

const fmtFull = new Intl.DateTimeFormat(site.locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtField = new Intl.DateTimeFormat(site.locale, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const fmtMonth = new Intl.DateTimeFormat(site.locale, { month: "long", year: "numeric" });
const fmtWeekday = new Intl.DateTimeFormat(site.locale, { weekday: "short" });
const fmtWeekdayLong = new Intl.DateTimeFormat(site.locale, { weekday: "long" });
const fmtDayNumber = new Intl.DateTimeFormat(site.locale, { day: "numeric" });

/** Six rows, always, so the popover never changes height between months. */
function monthGrid(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const lead = (first.getDay() - site.weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  return Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => addDays(start, r * 7 + c)));
}

/**
 * Date picker matching the site's custom select: a field that shows the chosen
 * day and a calendar popover. Follows the WAI-ARIA date picker dialog pattern:
 * focus moves to the selected (or first available) day on open, arrow keys move
 * by day and week, PageUp/PageDown by month (with Shift, by year), Home/End to
 * the week's start and end, Enter/Space picks, Escape closes and focus returns
 * to the field. Days before `minDaysAhead` stay focusable but are marked
 * unavailable, so keyboard users can still move through them.
 */
export function DatePicker({
  label,
  name,
  value,
  onChange,
  minDaysAhead = 0,
  maxMonthsAhead = 12,
  placeholder = "Choose a date",
  note,
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [view, setView] = useState(() => new Date());
  const [focusDay, setFocusDay] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const closing = useRef<gsap.core.Tween | null>(null);
  const moveFocus = useRef(false);

  const selected = value ? fromKey(value) : null;
  // Computed on render: the picker only renders the calendar after a click, so there's no SSR mismatch.
  const today = startOfDay(new Date());
  const minDay = addDays(today, minDaysAhead);
  const maxDay = new Date(today.getFullYear(), today.getMonth() + maxMonthsAhead + 1, 0);
  const available = (d: Date) => d >= minDay && d <= maxDay;
  // Focus may rest on unavailable days (they are announced as such), but never outside the months shown.
  const minMonth = new Date(minDay.getFullYear(), minDay.getMonth(), 1);
  const maxMonth = new Date(maxDay.getFullYear(), maxDay.getMonth(), 1);
  const clamp = (d: Date) => (d < minMonth ? minMonth : d > maxDay ? maxDay : d);

  const show = () => {
    // Reopened mid-close: stop the exit and bring the popover straight back.
    if (closing.current) {
      closing.current.kill();
      closing.current = null;
      gsap.to(popRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.15 });
    }
    const start = selected && available(selected) ? selected : minDay;
    setView(new Date(start.getFullYear(), start.getMonth(), 1));
    setFocusDay(start);
    moveFocus.current = true;
    setOpen(true);
  };

  /** Animate out, then unmount. `refocus` returns focus to the field (Escape, picking a day). */
  const hide = (refocus: boolean) => {
    if (refocus) triggerRef.current?.focus();
    const el = popRef.current;
    if (!el || prefersReducedMotion()) return setOpen(false);
    if (closing.current) return;
    gsap.killTweensOf(el);
    closing.current = gsap.to(el, {
      autoAlpha: 0,
      y: up ? 6 : -6,
      scale: 0.97,
      duration: 0.16,
      ease: "power2.in",
      onComplete: () => {
        closing.current = null;
        setOpen(false);
      },
    });
  };

  // Open upward when there isn't room below the field but there is above it.
  useLayoutEffect(() => {
    if (!open || !popRef.current || !triggerRef.current) return;
    const field = triggerRef.current.getBoundingClientRect();
    const need = popRef.current.offsetHeight + 8;
    setUp(window.innerHeight - field.bottom < need && field.top > need);
  }, [open]);

  // Entrance, after placement is known so the lift comes from the right side.
  useLayoutEffect(() => {
    if (!open || !popRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      popRef.current,
      // Opacity, not autoAlpha: a visibility:hidden popover could not take focus on the first frame.
      { opacity: 0, y: up ? 6 : -6, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" },
    );
  }, [open, up]);

  // Keyboard moves and the opening move focus to the active day once it is rendered.
  useEffect(() => {
    if (!open || !focusDay || !moveFocus.current) return;
    moveFocus.current = false;
    popRef.current?.querySelector<HTMLButtonElement>(`[data-day="${toKey(focusDay)}"]`)?.focus();
  }, [open, focusDay, view]);

  // Outside click closes without stealing focus from whatever was clicked.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) hide(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hide reads refs only
  }, [open]);

  const goTo = (d: Date) => {
    const next = clamp(d);
    setFocusDay(next);
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
    moveFocus.current = true;
  };

  const shiftView = (months: number) => {
    const next = new Date(view.getFullYear(), view.getMonth() + months, 1);
    setView(next);
    if (focusDay) setFocusDay(clamp(addMonths(focusDay, months)));
  };

  const pick = (d: Date) => {
    if (!available(d)) return;
    onChange(toKey(d));
    hide(true);
  };

  const onGridKey = (e: KeyboardEvent) => {
    if (!focusDay) return;
    const dow = (focusDay.getDay() - site.weekStartsOn + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDay, -1),
      ArrowRight: () => addDays(focusDay, 1),
      ArrowUp: () => addDays(focusDay, -7),
      ArrowDown: () => addDays(focusDay, 7),
      Home: () => addDays(focusDay, -dow),
      End: () => addDays(focusDay, 6 - dow),
      PageUp: () => addMonths(focusDay, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focusDay, e.shiftKey ? 12 : 1),
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    goTo(move());
  };

  const onPopKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      hide(true);
    }
  };

  const canPrev = view > minMonth;
  const canNext = view < maxMonth;
  const weeks = monthGrid(view);
  const fieldText = selected ? fmtField.format(selected) : placeholder;

  return (
    <div
      ref={rootRef}
      className={`relative ${open ? "z-40" : "z-0"}`}
      onBlur={(e) => {
        // Tabbing out of the calendar closes it.
        if (open && !rootRef.current?.contains(e.relatedTarget as Node | null) && e.relatedTarget) hide(false);
      }}
    >
      <span id={`${id}-label`} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </span>
      {name && <input type="hidden" name={name} value={value} />}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? `${id}-dialog` : undefined}
          aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => (open && !closing.current ? hide(false) : show())}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              show();
            }
          }}
          className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left text-[15px] transition-colors ${
            open ? "border-brand ring-4 ring-brand/10" : "border-oat-line hover:border-brand-soft"
          }`}
        >
          <span id={`${id}-value`} className={`truncate ${selected ? "text-ink" : "text-muted"}`}>
            {fieldText}
          </span>
          <ChevronIcon className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div
            ref={popRef}
            id={`${id}-dialog`}
            role="dialog"
            aria-modal="false"
            aria-label={`${label}: choose a day`}
            onKeyDown={onPopKey}
            className={`absolute left-0 z-50 w-full min-w-72 rounded-2xl border border-oat-line bg-white p-3 shadow-xl shadow-ink/10 sm:w-80 ${
              up ? "bottom-[calc(100%+6px)] origin-bottom-left" : "top-[calc(100%+6px)] origin-top-left"
            }`}
          >
            <div className="flex items-center justify-between gap-2 pb-2">
              <button
                type="button"
                aria-label="Previous month"
                disabled={!canPrev}
                onClick={() => shiftView(-1)}
                className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-oat hover:text-brand disabled:text-muted/40 disabled:hover:bg-transparent"
              >
                <ChevronIcon className="size-4 rotate-90" />
              </button>
              <p id={`${id}-month`} aria-live="polite" className="font-serif text-lg text-ink">
                {fmtMonth.format(view)}
              </p>
              <button
                type="button"
                aria-label="Next month"
                disabled={!canNext}
                onClick={() => shiftView(1)}
                className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-oat hover:text-brand disabled:text-muted/40 disabled:hover:bg-transparent"
              >
                <ChevronIcon className="size-4 -rotate-90" />
              </button>
            </div>

            <div role="grid" aria-labelledby={`${id}-month`} data-allow-number onKeyDown={onGridKey}>
              <div role="row" className="grid grid-cols-7">
                {weeks[0].map((d) => (
                  <span
                    key={d.getDay()}
                    role="columnheader"
                    aria-label={fmtWeekdayLong.format(d)}
                    className="grid h-8 place-items-center text-xs font-medium text-muted"
                  >
                    {fmtWeekday.format(d)}
                  </span>
                ))}
              </div>
              {weeks.map((week) => (
                <div key={toKey(week[0])} role="row" className="grid grid-cols-7">
                  {week.map((d) => {
                    const inMonth = d.getMonth() === view.getMonth();
                    const key = toKey(d);
                    const isSelected = !!selected && sameDay(d, selected);
                    const isToday = sameDay(d, today);
                    const ok = available(d);
                    const isFocus = !!focusDay && sameDay(d, focusDay);
                    return (
                      <span key={key} role="gridcell" aria-selected={isSelected} className="grid place-items-center">
                        <button
                          type="button"
                          data-day={key}
                          tabIndex={isFocus ? 0 : -1}
                          aria-label={`${fmtFull.format(d)}${isToday ? ", today" : ""}${ok ? "" : ", unavailable"}`}
                          aria-current={isToday ? "date" : undefined}
                          aria-disabled={!ok || undefined}
                          onClick={() => pick(d)}
                          onFocus={() => setFocusDay(d)}
                          className={`relative grid size-10 place-items-center rounded-full text-[15px] transition-colors ${
                            isSelected
                              ? "bg-brand font-semibold text-white"
                              : ok
                                ? `${inMonth ? "text-ink" : "text-muted"} hover:bg-oat hover:text-brand`
                                : "cursor-not-allowed text-muted/40"
                          } ${isToday && !isSelected ? "font-semibold ring-1 ring-brand-soft ring-inset" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
                        >
                          {fmtDayNumber.format(d)}
                        </button>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            {note && <p className="mt-2 border-t border-oat-line px-1 pt-2.5 text-[13px] text-muted">{note}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

