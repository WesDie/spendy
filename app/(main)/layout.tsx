import { CommandMenuProvider } from "@/components/providers/command-menu-provider";
import { DialogProvider } from "@/components/providers/dialogs-provider";
import { TopNavBar } from "@/components/navigation/topNav/top-nav-bar";
import { GlobalContextProvider } from "@/components/providers/global-context-provider";
import { ShortcutsProvider } from "@/components/providers/shortcuts-provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalContextProvider>
      <DialogProvider>
        <CommandMenuProvider>
          <ShortcutsProvider>
            <main className="w-full h-full flex flex-col pt-[69px] overflow-hidden">
              <TopNavBar />
              <main className="flex flex-col h-full w-full p-6 px-4 md:p-8">
                {children}
              </main>
            </main>
            <Toaster />
          </ShortcutsProvider>
        </CommandMenuProvider>
      </DialogProvider>
    </GlobalContextProvider>
  );
}
