import type { SVGProps } from "react";

/**
 * Line icons on a 24px grid, drawn inline so there is no icon dependency.
 * Stroke follows currentColor.
 *
 * This set is deliberately small: every icon here does a job inside a control
 * (account, basket and add-to-basket buttons, menu, close, chevrons, button
 * arrows, the accordion and quantity steppers, the selected option tick). Do
 * not add icons to decorate headings, cards, list items, facts, contact lines
 * or form fields; write the words instead. Social brand logos are the one
 * exception and live in components/layout/social-links.tsx (Phosphor).
 * `npm run qa` fails on an icon that is not inside a link, button or form
 * control, so every icon carries `data-icon`. See AGENTS.md, "Keep it human".
 */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ name, children, ...props }: IconProps & { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-icon={name}
      {...props}
    >
      {children}
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Base name="user" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </Base>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Base name="bag" {...props}>
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Base>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Base name="cart" {...props}>
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" />
      <circle cx="9.5" cy="19" r="1.3" />
      <circle cx="17" cy="19" r="1.3" />
      <path d="M11 11h5" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base name="menu" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base name="close" {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Base name="chevron" strokeWidth={2} {...props}>
      <path d="m6 9 6 6 6-6" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base name="check" strokeWidth={2.2} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Base>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Base name="arrow-right" strokeWidth={1.8} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Base name="plus" strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Base name="minus" strokeWidth={2} {...props}>
      <path d="M5 12h14" />
    </Base>
  );
}
