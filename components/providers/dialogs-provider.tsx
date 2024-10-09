"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { GroupDialog } from "../navigation/dialogs/create/group-dialog";
import { TransactionDialog } from "../navigation/dialogs/create/transaction-dialog";

type DialogState = {
  [key: string]: boolean;
};

type DialogContextType = {
  dialogState: DialogState;
  openDialog: (dialogName: string) => void;
  closeDialog: (dialogName: string) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialogs = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogs must be used within a DialogProvider");
  }
  return context;
};

type DialogProviderProps = {
  children: ReactNode;
};

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    groupDialog: false,
    transactionDialog: false,
  });

  const openDialog = (dialogName: string) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: true }));
  };

  const closeDialog = (dialogName: string) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: false }));
  };

  return (
    <DialogContext.Provider value={{ dialogState, openDialog, closeDialog }}>
      {children}
      <GroupDialog
        open={dialogState.groupDialog}
        onClose={() => closeDialog("groupDialog")}
      />
      <TransactionDialog
        open={dialogState.transactionDialog}
        onClose={() => closeDialog("transactionDialog")}
      />
    </DialogContext.Provider>
  );
};
