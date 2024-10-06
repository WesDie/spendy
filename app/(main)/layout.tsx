import { CommandMenuProvider } from "@/components/providers/command-menu-provider";
import { DialogProvider } from "@/components/providers/dialogs-provider";
import { TopNavBar } from "@/components/navigation/topNav/top-nav-bar";
import { GroupContextProvider } from "@/components/providers/group-context-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GroupContextProvider>
      <DialogProvider>
        <CommandMenuProvider>
          <main className="w-full flex flex-col">
            <TopNavBar />
            {children}
          </main>
        </CommandMenuProvider>
      </DialogProvider>
    </GroupContextProvider>
  );
}
