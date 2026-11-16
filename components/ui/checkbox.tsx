"use client";

import { useId, useRef, type ReactNode, type Ref } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  name?: string;
  /** Validation message; when set the box turns caramel and the message is announced. */
  error?: string;
  /** Increment to replay the "nudge" shake, e.g. on every blocked submit. */
  errorPulse?: number;
  inputRef?: Ref<HTMLInputElement>;
};

// Sprinkle burst directions: six sprinkles fanning out around the box.
const SPRINKLES = [
  { angle: -90, color: "#b34f17" },
  { angle: -30, color: "#ead4ae" },
  { angle: 30, color: "#d99a4e" },
  { angle: 90, color: "#543c2a" },
  { angle: 150, color: "#c97b4a" },
  { angle: 210, color: "#a8b38a" },
];

const polar = (i: number, radius: number) => {
  const rad = (SPRINKLES[i].angle * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
};

/**
 * Accessible custom checkbox. A real (visually hidden) input handles focus,
 * keyboard and forms; GSAP animates the visuals:
 * - check: the box squashes and springs back, a purple fill blooms from the centre,
 *   the tick draws itself and a ring of sprinkles bursts outwards;
 * - uncheck: the tick un-draws and the fill shrinks away;
 * - error nudge: the box wiggles side to side.
 */
export function Checkbox({ checked, onChange, children, name, error, errorPulse = 0, inputRef }: Props) {
  const id = useId();
  const boxRef = useRef<HTMLSpanElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const box = boxRef.current;
      if (!box) return;
      const fill = box.querySelector("[data-cb-fill]");
      const tick = box.querySelector("[data-cb-tick]");
      const sprinkles = box.querySelectorAll("[data-cb-sprinkle]");

      // First run: just reflect the initial state, no flourish.
      if (!mounted.current) {
        mounted.current = true;
        gsap.set(fill, { scale: checked ? 1 : 0 });
        gsap.set(tick, { drawSVG: checked ? "100%" : "0%" });
        return;
      }

      const tl = gsap.timeline();
      if (checked) {
        tl.fromTo(box, { scale: 0.78 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.1, 0.35)" })
          .fromTo(fill, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0)
          .fromTo(tick, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35, ease: "power2.out" }, 0.12)
          .fromTo(
            sprinkles,
            // Launch from the box edge (not its centre) so the burst never covers the tick.
            {
              x: (i) => polar(i, 12).x,
              y: (i) => polar(i, 12).y,
              rotate: (i) => SPRINKLES[i].angle + 90,
              scale: 1,
              autoAlpha: 1,
            },
            {
              x: (i) => polar(i, 26).x,
              y: (i) => polar(i, 26).y,
              rotate: (i) => SPRINKLES[i].angle + 90,
              scale: 0.4,
              autoAlpha: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            0.08,
          );
      } else {
        tl.to(tick, { drawSVG: "0%", duration: 0.2, ease: "power2.in" })
          .to(fill, { scale: 0, duration: 0.25, ease: "power2.in" }, 0.08)
          .fromTo(box, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, 0.1);
      }
      if (prefersReducedMotion()) tl.progress(1);
    },
    { dependencies: [checked], scope: boxRef },
  );

  useGSAP(
    () => {
      if (!errorPulse || !boxRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        boxRef.current,
        { x: 0 },
        { keyframes: { x: [0, -6, 6, -4, 4, 0] }, duration: 0.45, ease: "power1.inOut" },
      );
    },
    { dependencies: [errorPulse] },
  );

  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="group -my-2.5 flex cursor-pointer items-start gap-3 py-2.5 text-[14px] leading-relaxed text-muted"
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="peer sr-only"
        />
        <span
          ref={boxRef}
          aria-hidden
          className={`relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 bg-white transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand peer-[[aria-invalid=true]:focus]:outline-2 peer-[[aria-invalid=true]:focus]:outline-offset-2 peer-[[aria-invalid=true]:focus]:outline-brand ${
            error ? "border-caramel" : checked ? "border-brand" : "border-brand-soft group-hover:border-brand"
          }`}
        >
          {/* Fill starts collapsed via inline style so it's correct before hydration. */}
          <span data-cb-fill className="absolute inset-0 rounded-[5px] bg-brand" style={{ transform: "scale(0)" }} />
          <svg viewBox="0 0 24 24" fill="none" data-icon="check" className="relative size-4 text-white">
            <path
              data-cb-tick
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
          {SPRINKLES.map((s) => (
            <span
              key={s.angle}
              data-cb-sprinkle
              className="pointer-events-none absolute top-1/2 left-1/2 -mt-[1.5px] -ml-[4px] h-[3px] w-2 rounded-full opacity-0"
              style={{ backgroundColor: s.color }}
            />
          ))}
        </span>
        <span className="text-pretty">{children}</span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="mt-2 pl-9 text-[13px] font-medium text-caramel-dark">
          {error}
        </p>
      )}
    </div>
  );
}
