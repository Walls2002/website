import type { Icon } from "@phosphor-icons/react";
import {
  FacebookLogo,
  GoogleLogo,
  InstagramLogo,
  MessengerLogo,
  PinterestLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { site, type SocialNetwork } from "@/lib/site";

/**
 * Social links are the one place brand logos replace words: an icon-only link
 * per network in `site.socials`, named for screen readers. Logos come from
 * Phosphor (one weight for all); control icons stay in components/icons.tsx.
 * Add a network by adding it to `SocialNetwork` in lib/site.ts and to this map.
 *
 * Each logo is 20px, centred in a 40px hit area, so the row is pulled left by
 * the 10px inset (`-ml-2.5`): the first logo lines up with the text above it.
 */
const logos: Record<SocialNetwork, Icon> = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  messenger: MessengerLogo,
  pinterest: PinterestLogo,
  youtube: YoutubeLogo,
  tiktok: TiktokLogo,
  x: XLogo,
  google: GoogleLogo,
};

export function SocialLinks({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "oat" }) {
  const colors =
    tone === "ink"
      ? "text-ink hover:bg-oat hover:text-brand focus-visible:outline-brand"
      : "text-oat hover:bg-white/10 hover:text-white focus-visible:outline-oat";
  return (
    <ul className={`-ml-2.5 flex flex-wrap gap-1 ${className}`}>
      {site.socials.map((s) => {
        const Logo = logos[s.network];
        return (
          <li key={s.network} data-f-social>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`grid size-10 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${colors}`}
            >
              <Logo weight="fill" aria-hidden="true" data-icon={s.network} className="size-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
