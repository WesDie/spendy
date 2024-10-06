"use client";

import React, { createContext, useContext, useState } from "react";

type Group = {
  id: number;
  name: string;
  icon: string;
  type: "Personal" | "External";
};

type GroupContextType = {
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error(
      "useGroupContext must be used within a GroupContextProvider"
    );
  }
  return context;
}

export function GroupContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  return (
    <GroupContext.Provider value={{ currentGroup, setCurrentGroup }}>
      {children}
    </GroupContext.Provider>
  );
}
