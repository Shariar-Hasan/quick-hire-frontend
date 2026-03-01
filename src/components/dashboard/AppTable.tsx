"use client";

import React, {
    useMemo,
    useRef, ReactNode
} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, RefreshCcw, X, GripVertical, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AppTableBodyProps,
    AppTableBulkActionPopupProps,
    AppTableButtonKey, AppTableFilterItemProps, PaginationDetailProps, TableLimitProps,
    TablePaginationProps,
    TableRowMenuPropsType
} from "@/types/table-types";
import { cn } from "@/lib/utils";
import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Pagination,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DebouncedInput from "@/components/ui/debounce-input";
import NumberInput from "@/components/ui/number-input";
import { NumberRangeInput } from "@/components/ui/number-range-input";
import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import SelectListInput from "@/components/ui/select-list-input";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import CheckboxFilter from "@/components/ui/checkbox-filter";
import { Parser } from "@/lib/htmlParser";
import { DatePickerInput } from "../ui/date-picker-input";

// Loader animation
const loaderStyle = `

@keyframes leftToRight {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

`;

export function AppTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("", className)}>
      <style>{loaderStyle}</style>
      {children}
    </Card>
  );
}


// Filter (pass your own filter component here)
AppTable.FilterItem = function TableFilterItem(props: AppTableFilterItemProps) {
  switch (props.type) {
    case "text":
      return <DebouncedInput {...props} />;
    case "number":
      return <NumberInput {...props} />;
    case "number-range":
      return <NumberRangeInput {...props} />;
    case "date":
      return <DatePickerInput {...props} />;
    case "date-range":
      return <DateRangePickerInput {...props} />;
    case "select":
      return <SelectListInput {...props} />;
    case "multi-select":
      return <SelectListInput {...props} />;
    case "checkbox":
      return <CheckboxFilter {...props} />;
    default:
      return null;
  }
};

// Pagination
AppTable.Pagination = function TablePagination(props: TablePaginationProps) {
  const { total, limit, page, onPageChange, disabled } = props;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const renderPageButtons = () => {
    const pageButtons = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationLink
              size={"sm"}
              onClick={() => !disabled && onPageChange(i)}
              isActive={page === i}
              className={cn({ "pointer-events-none opacity-50": page === i || disabled })}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageButtons.push(
        <PaginationItem key={1}>
          <PaginationLink
            size={"sm"}
            onClick={() => !disabled && onPageChange(1)}
            isActive={page === 1}
            className={cn({ "pointer-events-none opacity-50": page === 1 || disabled })}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (page > 3) {
        pageButtons.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis
              onClick={() => !disabled && onPageChange(Math.max(page - 2, 1))}
              className={cn("cursor-pointer", { "pointer-events-none opacity-50": disabled })}
            />
          </PaginationItem>
        );
      }
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationLink
              size={"sm"}
              onClick={() => !disabled && onPageChange(i)}
              isActive={page === i}
              className={cn({ "pointer-events-none opacity-50": page === i || disabled })}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      if (page < totalPages - 2) {
        pageButtons.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis
              onClick={() => !disabled && onPageChange(Math.min(page + 2, totalPages))}
              className={cn("cursor-pointer", { "pointer-events-none opacity-50": disabled })}
            />
          </PaginationItem>
        );
      }
      pageButtons.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            size={"sm"}
            onClick={() => !disabled && onPageChange(totalPages)}
            isActive={page === totalPages}
            className={cn({
              "pointer-events-none opacity-50": page === totalPages || disabled,
            })}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageButtons;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            hideText
            onClick={() => !disabled && onPageChange(Math.max(page - 1, 1))}
            className={cn({
              "pointer-events-none opacity-50": page === 1 || disabled,
            })}
          />
        </PaginationItem>
        {renderPageButtons()}
        <PaginationItem>
          <PaginationNext
            hideText
            onClick={() => !disabled && onPageChange(Math.min(page + 1, totalPages))}
            className={cn({
              "pointer-events-none opacity-50": page === totalPages || disabled,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

AppTable.Limit = function TableLimit(props: TableLimitProps) {
  const { limit, onLimitChange, limitOptions, disabled } = props;

  return (
    <Select
      value={String(limit)}
      onValueChange={(value) => onLimitChange(Number(value))}
      disabled={disabled}
    >
      <SelectTrigger className="min-w-fit w-auto mr-2 bg-white">
        <SelectValue placeholder="Rows" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {limitOptions?.map((opt) => {
            const label = typeof opt === "number" ? opt.toString() : opt.label;
            const id = typeof opt === "number" ? opt.toString() : opt.value;
            return (
              <SelectItem key={JSON.stringify(opt)} value={id?.toString()}>
                {label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

AppTable.PaginationDetail = function PaginationDetail(
  props: PaginationDetailProps
) {
  const { page, limit, total, children } = props;

  const itemStart = (page - 1) * limit + 1;
  const itemCount = Math.min(total, page * limit);

  return children ? children({ itemStart, itemEnd: itemCount, total }) : null;
};

// Body (uses context)
AppTable.RowAction = function RowAction({
  menuItems,
  title,
  icon,
  type = "dropdown",
  variant,
  size,
  className,
  loading,
  disabled
}: TableRowMenuPropsType) {
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const handleClick = (clickFn: () => void) => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(clickFn, 0);
  };
  if (type === "inline") {
    return (
      <div className={cn("flex flex-row justify-end gap-2", className)}>
        {menuItems?.length > 0 &&
          menuItems.map(
            (item, index) =>
              item.isVisible !== false && (
                <Button
                  key={index}
                  variant={variant || "ghost"}
                  size={size || "icon"}
                  title={Parser.extractTextFromReactNode(item.label)}
                  disabled={item.disabled || disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(item?.onClick || (() => { }));
                  }}
                  className={cn(
                    "p-0 rounded-full flex items-center justify-center relative",
                    className
                  )}
                  loading={item.loading}
                  loadingText={item.loadingText}
                >
                  {item.icon || item.label}{" "}
                  {item.sup && (
                    <sup className="absolute top-1.75 right-1.75">
                      {item.sup}
                    </sup>
                  )}
                </Button>
              )
          )}
      </div>
    );
  }
  return (
    menuItems?.length > 0 && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            title={title}
            variant={variant || "ghost"}
            size={size || "icon"}
            onClick={(e) => e.stopPropagation()}
            className={cn("h-8 w-8 p-0 rounded-full", className)}
            disabled={disabled}
            loading={loading}
            loadingText=""
          >
            {icon || <MoreVertical className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => e.stopPropagation()}
          className="min-w-40 z-999999"
        >
          {menuItems.map(
            (item, index) =>
              item.isVisible !== false && (
                <DropdownMenuItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(item?.onClick || (() => { }));
                  }}
                  className={item.className}
                  disabled={item.disabled}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <span className="w-4 h-4 flex items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </div>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};


// Body (uses context)
AppTable.Header = function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <CardHeader className={cn("mb-3", className)}>{children}</CardHeader>;
};

AppTable.Title = function Title({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <CardTitle className={className}>{children}</CardTitle>;
};

AppTable.Description = function Description({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <CardDescription className={className}>{children}</CardDescription>;
};

AppTable.Body = function Body<T extends object>(
  props: AppTableBodyProps<T>
) {
  const {
    columns,
    datalist,
    loading,
    sortOptions,
    selectOptions,
    draggableOptions,
    notFoundContent,
    onRowClick,
  } = props;

  const sortBy = sortOptions?.sortBy;
  const sortOrder = sortOptions?.sortOrder;
  const onSortChange = sortOptions?.onSortChange;

  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const isRowSelected = React.useCallback(
    (row: T) =>
      selectOptions?.selectedRows.some(
        (r) => (r as any).id === (row as any).id
      ),
    [selectOptions?.selectedRows]
  );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      if (!selectOptions?.onRowSelect) return;
      selectOptions.onRowSelect(checked ? datalist : []);
    },
    [datalist, selectOptions]
  );

  const handleSelectRow = React.useCallback(
    (row: T, checked: boolean) => {
      if (!selectOptions?.onRowSelect) return;

      if (checked) {
        selectOptions.onRowSelect([...selectOptions.selectedRows, row]);
      } else {
        selectOptions.onRowSelect(
          selectOptions.selectedRows.filter(
            (r) => (r as any).id !== (row as any).id
          )
        );
      }
    },
    [selectOptions]
  );

  const isAllSelected = React.useMemo(
    () =>
      datalist.length > 0 &&
      datalist.every((row) => isRowSelected(row)),
    [datalist, isRowSelected]
  );

  const isSomeSelected = React.useMemo(
    () =>
      selectOptions &&
      selectOptions.selectedRows.length > 0 &&
      selectOptions.selectedRows.length < datalist.length,
    [selectOptions, datalist.length]
  );

  /* ---------- DND (unchanged logic from old code) ---------- */

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (
      draggedIndex === null ||
      draggedIndex === dropIndex ||
      !draggableOptions
    )
      return;

    draggableOptions.onRowReorder(draggedIndex, dropIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!columns || !datalist) return null;

  return (
    <CardContent>
      <div className="w-full overflow-x-auto">
        <div className="min-w-full">
          <Table className="table-auto lg:table-fixed w-full">
            <TableHeader>
              <TableRow>
                {draggableOptions && (
                  <TableHead className="w-8.75!" />
                )}

                {selectOptions && (
                  <TableHead className="w-12.5!">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isAllSelected}
                        disabled={datalist.length === 0}
                        indeterminate={isSomeSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                  </TableHead>
                )}

                {columns.map((column, colIndex) => {
                  const visibleColumns = columns.filter(c => c.isVisible !== false);
                  const visibleIndex = visibleColumns.findIndex(c => c === column);
                  const isFirst = visibleIndex === 0;
                  const isLast = visibleIndex === visibleColumns.length - 1;

                  const isSortable = column.isSortable && column.sortKey;
                  const isActiveSort = sortBy === column.sortKey;

                  return column.isVisible !== false ? (
                    <TableHead
                      key={column.label}
                      className={cn(
                        column.labelClass,
                        "px-2 py-3 sm:px-4 sm:py-3 text-center!",
                        {
                          "hover:bg-gray-100 rounded-xs":
                            column.isSortable,
                          "cursor-pointer select-none":
                            column.isSortable,
                          "text-start!": isFirst,
                          "text-end!": isLast,
                        },
                        ""
                      )}
                      onClick={
                        isSortable
                          ? () =>
                            onSortChange?.(
                              column.sortKey as keyof T,
                              sortBy === column.sortKey
                                ? sortOrder === "ASC"
                                  ? "DESC"
                                  : "ASC"
                                : "ASC"
                            )
                          : undefined
                      }
                    >
                      {isSortable && sortOptions ? (
                        <span className={cn("flex items-center justify-center gap-1", {
                          "justify-start": isFirst,
                          "justify-end": isLast,
                        })}>
                          <span>{column.label} </span>
                          <span>
                            {!isActiveSort ? (
                              <ArrowUpDown className="w-4 h-4 opacity-30" />
                            ) : sortOrder === "ASC" ? (
                              <ArrowUp className="w-4 h-4 text-primary" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-primary" />
                            )}
                          </span>
                        </span>

                      ) : column.label}
                    </TableHead>
                  ) : null;
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow className="animate-pulse border-none">
                  <TableCell
                    colSpan={
                      columns.length +
                      (selectOptions ? 1 : 0) +
                      (draggableOptions ? 1 : 0)
                    }
                    className="p-0"
                  >
                    <div className="w-full bg-gray-200 relative">
                      <div className="h-0.5 bg-primary absolute left-0 w-full animate-[leftToRight_0.7s_linear_infinite]" />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {datalist.length > 0 ? (
                datalist.map((item, rowIndex) => {
                  const isSelected = isRowSelected(item);

                  return (
                    <React.Fragment
                      key={((item as any).id as number) || rowIndex}
                    >
                      {dragOverIndex === rowIndex &&
                        draggedIndex !== null &&
                        draggedIndex !== rowIndex && (
                          <tr className="h-0.5">
                            <td
                              colSpan={
                                columns.length +
                                (selectOptions ? 1 : 0) +
                                (draggableOptions ? 1 : 0)
                              }
                              className="p-0"
                            >
                              <div className="h-0.5 bg-blue-500" />
                            </td>
                          </tr>
                        )}

                      <TableRow
                        draggable={!!draggableOptions}
                        onDragStart={(e) =>
                          draggableOptions &&
                          handleDragStart(e, rowIndex)
                        }
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) =>
                          draggableOptions &&
                          handleDragOver(e, rowIndex)
                        }
                        onDrop={(e) =>
                          draggableOptions &&
                          handleDrop(e, rowIndex)
                        }
                        onClick={(e) =>
                          onRowClick?.(item, e)
                        }
                        className={cn("hover:bg-gray-50", {
                          "bg-blue-50 hover:bg-blue-100":
                            selectOptions && isSelected,
                          "cursor-pointer": Boolean(onRowClick),
                          "cursor-grab": Boolean(draggableOptions),
                          "opacity-50":
                            draggedIndex !== null &&
                            draggedIndex === rowIndex,
                          "cursor-grabbing":
                            draggedIndex !== null,

                        })}
                      >
                        {draggableOptions && (
                          <TableCell
                            className="w-8.75!"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >
                            <div className="flex justify-center cursor-grab">
                              <GripVertical className="h-4 w-4" />
                            </div>
                          </TableCell>
                        )}

                        {selectOptions && (
                          <TableCell className="w-12.5!">
                            <div
                              className="flex justify-center"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleSelectRow(
                                    item,
                                    checked
                                  )
                                }
                              />
                            </div>
                          </TableCell>
                        )}

                        {columns.map((column, colIndex) => {
                          const visibleColumns = columns.filter(c => c.isVisible !== false);
                          const visibleIndex = visibleColumns.findIndex(c => c === column);
                          const isFirst = visibleIndex === 0;
                          const isLast = visibleIndex === visibleColumns.length - 1;

                          return column.isVisible !== false ? (
                            <TableCell
                              key={`${rowIndex}-${colIndex}`}
                              className={cn(
                                column.cellClass,
                                "px-2 py-2 sm:px-4 sm:py-3 text-center! text-ellipsis overflow-hidden max-w-50",
                                {
                                  "text-start!": isFirst,
                                  "text-end!": isLast,
                                }
                              )}
                            >
                              {typeof column.render ===
                                "function"
                                ? column.render(
                                  item,
                                  rowIndex
                                )
                                : item[column.render]?.toString()}
                            </TableCell>
                          ) : null;
                        })}
                      </TableRow>
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (selectOptions ? 1 : 0) +
                      (draggableOptions ? 1 : 0)
                    }
                    className="text-center h-50"
                  >
                    {notFoundContent || "No data found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </CardContent>
  );
};


AppTable.Button = function AppTableButton({
  type,
  onClick,
  title,
  children,
  className,
  disabled,
  loading,
  loadingText,
}: {
  type: AppTableButtonKey;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}) {
  let icon = null;
  switch (type) {
    case "add":
      icon = <Plus className="h-4 w-4" />;
      break;
    case "refresh":
      icon = <RefreshCcw className="h-4 w-4" />;
      break;
    case "custom":
      icon = null;
      break;
    default:
      icon = null;
  }
  return (
    <Button
      title={title}
      variant="outline"
      size="sm"
      className={cn("flex items-center gap-2", className)}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      loading={loading}
      loadingText={loadingText}
    >
      {icon} {children}
    </Button>
  );
};

AppTable.Link = function AppTableLink(
  props: React.ComponentProps<typeof Link>
) {
  return (
    <Link
      {...props}
      className={cn("text-gray-700 underline", props.className)}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
    >
      {props.children}
    </Link>
  );
};

AppTable.BulkActionPopup = function AppTableBulkActionPopup(
  props: AppTableBulkActionPopupProps
) {
  const {
    buttonList,
    onClose,
    open,
    selectedCount,
    totalCount,
    customMessage,
    containerClassName,
  } = props;
  return (
    <div
      className={cn(
        "duration-300 flex items-center justify-between flex-wrap gap-4 bg-white border border-gray-700/30 shadow-[5px_5px_40px_rgba(0,0,0,0.5)] rounded-lg px-2 py-2 text-sm min-w-[45%]",
        containerClassName,
        "fixed left-1/2 transform -translate-x-1/2 bottom-2.5 z-50 ",
        {
          "invisible -bottom-10 opacity-0": !open,
          "visible bottom-2.5 opacity-100": open,
        }
      )}
    >
      <div className="flex items-center gap-1 md:border rounded-sm py-1 md:pr-2 pl-2">
        {customMessage ? (
          <>{customMessage}</>
        ) : (
          <span className="font-medium">
            {selectedCount} of {totalCount} selected
          </span>
        )}{" "}
        <X
          className="cursor-pointer w-4 h-4 p-0.5 hover:border"
          onClick={onClose}
        />
      </div>
      <div className="flex items-center gap-2">
        {buttonList.map((btn, idx) => (
          <Button
            key={idx}
            size="sm"
            variant={btn.variant || "outline"}
            onClick={btn.onClick}
          >
            {btn.icon && (
              <span className="w-4 h-4 flex items-center justify-center">
                {btn.icon}
              </span>
            )}
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AppTable;
