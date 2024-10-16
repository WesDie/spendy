"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addMonths,
  subMonths,
  format,
  isAfter,
  startOfMonth,
  startOfYear,
  endOfYear,
  endOfMonth,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/database-types";

type Group = {
  id: number;
  name: string;
  icon: string;
  type: "Personal" | "External";
};

type DateOption = "month" | "halfyear" | "year" | "total";

type GlobalContextType = {
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  activeDateOption: DateOption;
  setActiveDateOption: (option: DateOption) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  handleDatePrev: () => void;
  handleDateNext: () => void;
  getDisplayDate: () => string;
  getDateRange: () => { startDate: Date; endDate: Date };
  isNextDateDisabled: () => boolean;
  isPrevDateDisabled: () => boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
}

export function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [activeDateOption, setActiveDateOption] = useState<DateOption>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);

  const { data: userData, error: userError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetch(`/api/auth/getUser`).then((res) => res.json()),
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const handleDatePrev = () => {
    switch (activeDateOption) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "halfyear":
        setCurrentDate(subMonths(currentDate, 6));
        break;
      case "year":
        setCurrentDate(subMonths(currentDate, 12));
        break;
      default:
        break;
    }
  };

  const handleDateNext = () => {
    switch (activeDateOption) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "halfyear":
        setCurrentDate(addMonths(currentDate, 6));
        break;
      case "year":
        setCurrentDate(addMonths(currentDate, 12));
        break;
      default:
        break;
    }
  };

  const getDisplayDate = () => {
    switch (activeDateOption) {
      case "month":
        return format(currentDate, "MMM yyyy");
      case "halfyear":
        return `${format(subMonths(currentDate, 5), "MMM yyyy")} - ${format(
          currentDate,
          "MMM yyyy"
        )}`;
      case "year":
        return format(currentDate, "yyyy");
      case "total":
        return "All Time";
      default:
        return "";
    }
  };

  const isNextDateDisabled = () => {
    switch (activeDateOption) {
      case "month":
        return isAfter(addMonths(currentDate, 1), new Date());
      case "halfyear":
        return isAfter(addMonths(currentDate, 6), new Date());
      case "year":
        return isAfter(addMonths(currentDate, 12), new Date());
      case "total":
        return true;
      default:
        return false;
    }
  };

  const isPrevDateDisabled = () => {
    return activeDateOption === "total";
  };

  const getDateRange = () => {
    switch (activeDateOption) {
      case "month":
        return {
          startDate: startOfMonth(currentDate),
          endDate: endOfMonth(currentDate),
        };
      case "halfyear":
        return {
          startDate: startOfMonth(subMonths(currentDate, 5)),
          endDate: endOfMonth(currentDate),
        };
      case "year":
        return {
          startDate: startOfYear(currentDate),
          endDate: endOfYear(currentDate),
        };
      case "total":
        return { startDate: new Date(0), endDate: new Date() };
      default:
        return { startDate: new Date(), endDate: new Date() };
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        currentGroup,
        setCurrentGroup,
        activeDateOption,
        setActiveDateOption,
        currentDate,
        setCurrentDate,
        handleDatePrev,
        handleDateNext,
        getDisplayDate,
        getDateRange,
        isNextDateDisabled,
        isPrevDateDisabled,
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
