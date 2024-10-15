import Link from "next/link";
import { usePathname } from "next/navigation";

export function Links({ type }: { type: "mobile" | "desktop" }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Overview" },
    { href: "/transactions", label: "Transactions" },
    { href: "/categories", label: "Categories" },
    { href: "/recurring", label: "Recurring", disabled: true },
    { href: "/settings", label: "Settings", disabled: true },
  ];

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
