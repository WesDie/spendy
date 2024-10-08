import { CommandMenuProvider } from "@/components/providers/command-menu-provider";
import { DialogProvider } from "@/components/providers/dialogs-provider";
import { TopNavBar } from "@/components/navigation/topNav/top-nav-bar";
import { GlobalContextProvider } from "@/components/providers/global-context-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalContextProvider>
      <DialogProvider>
        <CommandMenuProvider>
          <main className="w-full h-full flex flex-col pt-20">
            <TopNavBar />
            {children}
          </main>
        </CommandMenuProvider>
      </DialogProvider>
    </GlobalContextProvider>
  );
}
