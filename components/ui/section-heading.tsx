import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  underline?: boolean;
  className?: string;
};

export function SectionHeading({ title, intro, align = "left", underline, className = "" }: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      <h2 data-heading-part className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink">
        {title}
      </h2>
      {underline && (
        <span
          data-underline
          className={`mt-4 block h-1 w-10 origin-left rounded bg-brand ${centered ? "mx-auto origin-center" : ""}`}
        />
      )}
      {intro && (
        <p data-heading-part className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}
