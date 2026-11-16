import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "white" | "caramel";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-md shadow-brand/25 hover:bg-brand-dark",
  outline: "border border-brand/40 bg-white text-ink hover:border-brand hover:text-brand",
  white: "bg-white text-ink hover:bg-oat",
  caramel: "bg-caramel text-white shadow-md shadow-caramel/30 hover:bg-caramel-dark",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-5 text-sm",
  md: "min-h-12 px-7 text-[15px]",
  lg: "min-h-13 px-9 text-base",
};

type Common = {
  variant?: Variant;
  size?: Size;
  /** Full-width on phones, natural width from `sm` up. */
  fluid?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({ variant = "primary", size = "md", fluid, className = "" }: Omit<Common, "children">) {
  return [
    "inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70",
    variants[variant],
    sizes[size],
    fluid ? "w-full sm:w-auto" : "",
    className,
  ].join(" ");
}

export function ButtonLink({
  variant,
  size,
  fluid,
  className,
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses({ variant, size, fluid, className })} {...props}>
      {children}
    </Link>
  );
}

export function Button({ variant, size, fluid, className, children, ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClasses({ variant, size, fluid, className })} {...props}>
      {children}
    </button>
  );
}
