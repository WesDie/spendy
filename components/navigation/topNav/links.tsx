import Link from "next/link";

export function Links({ type }: { type: "mobile" | "desktop" }) {
  return (
    <nav
      className={`${
        type === "mobile"
          ? "flex gap-2 text-sm"
          : "hidden md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4"
      }`}
    >
      <Link
        href="/"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Overview
      </Link>
      <Link
        href="/"
        className="text-muted-foreground pointer-events-none opacity-50 transition-colors hover:text-foreground"
      >
        Projects
      </Link>
      <Link
        href="/"
        className="text-muted-foreground pointer-events-none opacity-50 transition-colors hover:text-foreground"
      >
        Settings
      </Link>
    </nav>
  );
}
