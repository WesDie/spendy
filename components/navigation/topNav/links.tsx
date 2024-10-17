import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function Links({ type }: { type: "mobile" | "desktop" }) {
  const pathname = usePathname();
  const { currentGroup } = useGlobalContext();

  let links: { href: string; label: string; disabled?: boolean }[] = [];

  if (currentGroup?.type === "Personal") {
    links = [
      { href: "/", label: "Overview" },
      { href: "/transactions", label: "Transactions" },
      { href: "/categories", label: "Categories" },
      { href: "/recurring", label: "Recurring", disabled: true },
    ];
  } else {
    links = [
      { href: `/groups/${currentGroup?.url}`, label: "Overview" },
      {
        href: `/groups/${currentGroup?.url}/transactions`,
        label: "Transactions",
      },
      {
        href: `/groups/${currentGroup?.url}/categories`,
        label: "Categories",
        disabled: true,
      },
      {
        href: `/groups/${currentGroup?.url}/members`,
        label: "Members",
        disabled: true,
      },
      {
        href: `/groups/${currentGroup?.url}/settings`,
        label: "Settings",
        disabled: true,
      },
    ];
  }

  if (!currentGroup) {
    return (
      <nav
        className={`${
          type === "mobile"
            ? "flex gap-4 text-sm"
            : "hidden md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4"
        }`}
      >
        {links.map((link) => (
          <Skeleton key={link.label} className="h-5 w-20" />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={`${
        type === "mobile"
          ? "flex gap-4 text-sm"
          : "hidden md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4"
      }`}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`
            ${link.disabled ? "pointer-events-none opacity-50" : ""}
            ${
              pathname === link.href
                ? "text-foreground"
                : "text-muted-foreground"
            }
            transition-colors hover:text-foreground
          `}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
