import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CommandMenuProvider } from "@/components/providers/command-menu-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { DialogProvider } from "@/components/providers/dialogs-provider";
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
          <ReactQueryProvider>
            <DialogProvider>
              <CommandMenuProvider>{children}</CommandMenuProvider>
            </DialogProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
