import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CommandMenuProvider } from "@/components/providers/command-menu-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spendy",
  description: "A simple budgeting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex h-dvh w-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandMenuProvider>{children}</CommandMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
