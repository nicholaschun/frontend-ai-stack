import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/nav";

/**
 * Wordmark + signature keystone glyph — a trapezoidal "keystone" block, the
 * literal load-bearing stone the product is named for. Kept simple so it reads
 * at any size and in either theme.
 */
export function Brand({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* keystone block */}
        <path
          d="M7 5.5h10l2.2 6.4a1 1 0 0 1 0 .66L17 18.5H7L4.8 12.56a1 1 0 0 1 0-.66L7 5.5Z"
          className="fill-primary"
        />
        <path
          d="M12 8.75v6.5"
          className="stroke-primary-foreground"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      {showWordmark ? (
        <span className="font-display text-foreground text-[0.95rem] font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );
}
