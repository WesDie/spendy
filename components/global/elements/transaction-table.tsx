"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Transaction, Category } from "@/types/database-types";
import { useDialogs } from "@/components/providers/dialogs-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransactionSheet from "@/components/navigation/sheet/edit/transaction-sheet";
import { DeleteTransactionDialog } from "@/components/navigation/dialogs/alert/delete-transaction-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { motion } from "framer-motion";

export const getColumns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div>
        {row.getValue("category")
          ? `${(row.getValue("category") as Category).icon} ${
              (row.getValue("category") as Category).title
            }`
          : "---"}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="w-4 h-4 ml-2" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="w-4 h-4 ml-2" />
          ) : (
            <ArrowUpDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="w-4 h-4 ml-2" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="w-4 h-4 ml-2" />
          ) : (
            <ArrowUpDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{new Date(row.getValue("date")).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="flex flex-row justify-end">
          <Button
            variant="ghost"
            className="ml-auto -mr-4"
            onClick={() => {
              if (column.getIsSorted() === "asc") {
                column.toggleSorting(true);
              } else if (column.getIsSorted() === "desc") {
                column.toggleSorting(false, true);
              } else {
                column.toggleSorting(true);
              }
            }}
          >
            Amount
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="w-4 h-4 ml-2" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="w-4 h-4 ml-2" />
            ) : (
              <ArrowUpDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      const color = amount > 0 ? "text-green-500" : "text-red-500";

      return <div className={`text-right ${color}`}>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Cell({ row }) {
      const transaction = row.original;
      const [isTransactionSheetOpen, setIsTransactionSheetOpen] =
        React.useState(false);
      const [isDeleteTransactionDialogOpen, setIsDeleteTransactionDialogOpen] =
        React.useState(false);

      return (
        <>
          <TransactionSheet
            open={isTransactionSheetOpen}
            onClose={() => setIsTransactionSheetOpen(false)}
            transaction={transaction}
          />
          <DeleteTransactionDialog
            open={isDeleteTransactionDialogOpen}
            onClose={() => setIsDeleteTransactionDialogOpen(false)}
            transactions={[transaction]}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-8 h-8 p-0 data-[state=open]:bg-muted"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTransactionSheetOpen(true)}>
                Edit transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteTransactionDialogOpen(true)}
              >
                Delete transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    size: 40,
  },
];

export default function TransactionTable() {
  const {
    currentGroupTransactions: transactions,
    isTransactionsLoading: isLoading,
    currentPage,
    pageSize,
    setPageNumber,
    totalTransactions,
    currentGroup,
  } = useGlobalContext();

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { openDialog } = useDialogs();
  let ready = transactions.length && !isLoading && currentGroup;

  const columns = React.useMemo(() => getColumns(), []);

  const table = useReactTable({
    data: transactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: Math.ceil(totalTransactions / pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All transactions</CardTitle>
        <CardDescription>View of all your transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.2 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full ${isLoading ? "animate-pulse" : ""}`}
        >
          {ready ? (
            <div className="flex items-center gap-2 py-4">
              {/* <Input
              placeholder="Filter transactions..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                /> */}
              <div className="flex flex-row gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => openDialog("transactionDialog")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add transaction
                </Button>
              </div>
            </div>
          ) : null}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {ready ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <>
                    {Array.from({ length: pageSize }, (_, index) => (
                      <TableRow key={index}>
                        <TableCell
                          colSpan={columns.length}
                          className="h-[49px] text-center"
                        >
                          <Skeleton className="w-full h-4" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end py-4 space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {totalTransactions} total rows
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.previousPage();
                  if (table.getCanPreviousPage()) {
                    setPageNumber(currentPage - 1);
                  }
                }}
                disabled={!table.getCanPreviousPage() || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (table.getCanNextPage()) {
                    setPageNumber(currentPage + 1);
                  }
                }}
                disabled={!table.getCanNextPage() || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
