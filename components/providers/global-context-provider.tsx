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
import { User, Group, Transaction } from "@/types/database-types";

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
  currentGroupTransactions: Transaction[];
  loadMoreTransactions: () => void;
  totalBalance: number;
  totalTransactions: number;
  currentPage: number;
  pageSize: number;
  isTransactionsLoading: boolean;
  balanceBeforePeriod: number;
  recentTransactions: Transaction[];
  setRecentTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setBalanceBeforePeriod: React.Dispatch<React.SetStateAction<number>>;
  setPageNumber: (pageNumber: number) => void;
  usePageSize: boolean;
  setUsePageSize: (usePageSize: boolean) => void;
  isRecentTransactionsLoading: boolean;
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const [currentGroupTransactions, setCurrentGroupTransactions] = useState<
    Transaction[]
  >([]);
  const [balanceBeforePeriod, setBalanceBeforePeriod] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [usePageSize, setUsePageSize] = useState(false);
  const [isRecentTransactionsLoading, setIsRecentTransactionsLoading] =
    useState(true);

  const { data: userData, error: userError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetch(`/api/auth/getUser`).then((res) => res.json()),
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const {
    data: recentTransactionsData,
    isLoading: isRecentTransactionsQueryLoading,
  } = useQuery({
    queryKey: ["recentTransactions", currentGroup?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/transactions/get?groupId=${currentGroup?.id}&type=recent`
      );
      const data = await response.json();
      return data.recentTransactions;
    },
    enabled: !!currentGroup?.id,
  });

  useEffect(() => {
    if (recentTransactionsData) {
      setRecentTransactions(recentTransactionsData);
      setIsRecentTransactionsLoading(false);
    }
  }, [recentTransactionsData]);

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    {
      queryKey: [
        "transactions",
        currentGroup?.id,
        activeDateOption,
        currentDate,
        currentPage,
      ],
      queryFn: async () => {
        const { startDate, endDate } = getDateRange();
        const response = await fetch(
          `/api/transactions/get?groupId=${
            currentGroup?.id
          }&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}${
            usePageSize ? `&page=${currentPage}&pageSize=${pageSize}` : ""
          }&type=all`
        );
        const data = await response.json();
        setBalanceBeforePeriod(data.balanceBeforePeriod);
        return data;
      },
      enabled: !!currentGroup?.id,
    }
  );

  useEffect(() => {
    if (transactionsData) {
      setCurrentGroupTransactions(transactionsData.transactions);
    }
  }, [transactionsData]);

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

  const loadMoreTransactions = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const setPageNumber = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
        currentGroupTransactions: currentGroupTransactions,
        loadMoreTransactions,
        totalBalance: transactionsData?.totalBalance || 0,
        totalTransactions: transactionsData?.totalCount || 0,
        currentPage,
        pageSize,
        isTransactionsLoading,
        isRecentTransactionsLoading,
        balanceBeforePeriod,
        setBalanceBeforePeriod,
        recentTransactions,
        setRecentTransactions,
        setPageNumber,
        usePageSize,
        setUsePageSize,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
