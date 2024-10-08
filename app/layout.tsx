import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeDataProvider } from "@/components/providers/theme-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
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
      <body className={`${inter.className} flex max-h-dvh min-h-dvh w-full`}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ThemeDataProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
