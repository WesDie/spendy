import Link from "next/link";

export function Links() {
  return (
    <nav className="hidden flex-col gap-2 text-lg font-medium md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4">
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
