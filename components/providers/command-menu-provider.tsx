"use client";

import React, { createContext, useContext, useState } from "react";
import { CommandMenu } from "@/components/navigation/dialogs/command/command-menu";

export type DialogType = "command" | "project" | "group" | null;

interface CommandMenuContextType {
  openDialog: (type: DialogType | null) => void;
  closeDialog: () => void;
}

const CommandMenuContext = createContext<CommandMenuContextType | undefined>(
  undefined
);

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) {
    throw new Error("useCommandMenu must be used within a CommandMenuProvider");
  }
  return context;
}

export function CommandMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType | null) => {
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
  };

  return (
    <CommandMenuContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <CommandMenu
        dialogType={openDialogType}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />
    </CommandMenuContext.Provider>
  );
}
