import Image from "next/image";
import { site } from "@/lib/site";

/**
 * The Kin Kitchen lockup as the brand draws it: the K-heart-K monogram beside
 * "Kin / Kitchen" set in Montserrat, with the motto underneath when there is
 * room. The monogram is the brand's own artwork; the words stay live text.
 */
export function Logo({
  motto = false,
  tone = "ink",
  priority = false,
  className = "",
}: {
  motto?: boolean;
  tone?: "ink" | "oat";
  priority?: boolean;
  className?: string;
}) {
  const color = tone === "ink" ? "text-brand" : "text-oat";
  return (
    <span className={`flex items-center gap-2.5 ${color} ${className}`}>
      <Image
        src={tone === "ink" ? "/images/kin-monogram.png" : "/images/kin-monogram-oat.png"}
        alt=""
        width={628}
        height={480}
        sizes="64px"
        className="h-10 w-auto sm:h-11"
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
      />
      <span className="flex flex-col font-sans leading-none">
        <span className="text-[19px] leading-[1.05] font-medium sm:text-[21px]">Kin</span>
        <span className="text-[19px] leading-[1.05] font-medium sm:text-[21px]">Kitchen</span>
        {motto && (
          <span className="mt-1.5 text-[9px] font-medium tracking-[0.14em] whitespace-nowrap uppercase opacity-80">
            {site.motto.join(" • ")}
          </span>
        )}
      </span>
    </span>
  );
}
