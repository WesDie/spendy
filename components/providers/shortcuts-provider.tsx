"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommandMenu } from "./command-menu-provider";
import { useDialogs } from "./dialogs-provider";

interface ShortcutsContextType {
  // Add any methods or properties if needed
}

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(
  undefined
);

export function useShortcuts() {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error("useShortcuts must be used within a ShortcutsProvider");
  }
  return context;
}

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { openDialog } = useCommandMenu();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command + S: Navigate to settings
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/settings");
      }

      // Shift + Command + Q: Logout
      if (e.key === "Q" && e.shiftKey) {
        e.preventDefault();
        handleLogout();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, openDialog]);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/login");
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <ShortcutsContext.Provider value={{}}>{children}</ShortcutsContext.Provider>
  );
}
