import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import React from "react";

export type SortByType<T> = keyof T | (string & {})

export interface PaginationTypes<T> {
    search: string;
    page: number;
    limit: number;
    sortBy: SortByType<T>;
    sortOrder: 'ASC' | 'DESC';
    filters?: Record<keyof T | string, any>;
    [key: string]: any;
}
export interface DropDownType {
    label: string;
    id: string | number;
}
/**
 * Represents the sorting order for table columns
 */
export type TableSortOrderType = "ASC" | "DESC";

/**
 * Available button types for the AppTable component
 */
export type AppTableButtonKey = "add" | "refresh" | 'custom';

/**
 * Props for the AppTable.Body component
 * @template T - The type of data objects in the table rows
 */
export interface AppTableBodyProps<T extends object> {
    /** Array of data objects to display in the table */
    datalist: T[];
    /** Column definitions for the table */
    columns: AppTableColumn<T>[];
    /** Whether the table is in a loading state */
    loading?: boolean;
    /** Callback fired when a table row is clicked */
    onRowClick?: (row: T, e?: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
    /** Sorting configuration for the table */
    sortOptions?: {
        sortBy: SortByType<T>;
        sortOrder: TableSortOrderType;
        onSortChange: (sortBy: SortByType<T>, sortOrder: TableSortOrderType) => void;
    };

    selectOptions?: {
        /**
         * Selected rows in the table
         *
         * NOTE: You must provide array of `selected rows(objects containing id field)`.
         * This prop is used to control the selected rows in the table.
         * If not provided, the table row selection will not work.
         */
        selectedRows: T[];
        /** Callback fired when row selection changes */
        onRowSelect: (rows: T[]) => void;
        /** Whether to disable the "select all" checkbox */
        disableSelectAll?: boolean;
        /** Function to determine if a row's selection checkbox should be disabled */
        disableSelects?: (row: T) => boolean;
    }
    /** Drag and drop configuration for reordering rows */
    draggableOptions?: {
        /** Callback fired when rows are reordered with the new data order, fromIndex and toIndex */
        onRowReorder: (fromIndex: number, toIndex: number) => void;
    };
    /** Content to display when no data is found */
    notFoundContent?: React.ReactNode;
}

/**
 * Props for the AppTable.Search component
 */
export interface AppTableSearchProps {
    /** Placeholder text for the search input */
    placeholder: string;
    /** Whether to debounce search input (default: 400ms) */
    debounce?: number;
    /** Additional CSS classes for the search input */
    className?: string;
    /** Whether to show a clear button */
    clearable?: boolean;
    /** Whether to show a search icon */
    showIcon?: boolean;
    /** Whether the search input is disabled */
    disabled?: boolean;
    /** Callback fired when the clear button is clicked */
    onClear?: () => void;
    /** Callback fired when search value changes */
    onSearchChange: (search: string) => void;
}

/**
 * Props for the AppTable.Filter component
 */
export interface AppTableFilterProps {
    /** Title for the filter section */
    title?: string;
    /** Array of filter field configurations */
    fields: FilterFieldConfig[];
    /** Callback fired when filters are applied */
    onApply: (filter: Record<string, any>) => void;
    /** Callback fired when filters are reset */
    onReset?: () => void;
    /** Additional content to render in the filter */
    children?: React.ReactNode;
}

/**
 * Column definition for AppTable
 * @template T - The type of data objects in the table rows
 */
export interface AppTableColumn<T> {
    /** Track down columns uniquely */
    key?: string;
    /** Display label for the column header */
    label: string;
    /** CSS classes for the column header */
    labelClass?: string;
    /** CSS classes for the table cells in this column */
    cellClass?: string;
    /** How to render the cell content - either a key of T or a render function */
    render: keyof T | ((row: T, rowIndex: number) => React.ReactNode);
    /** Whether this column can be sorted */
    isSortable?: boolean;
    /** The key to use for sorting this column */
    sortKey?: keyof T | (string & {});
    /** How to handle long text in this column (default: 'wrap') */
    longText?: 'wrap' | 'ellipsis' | 'hidden';
    /** Whether this column is visible (default: true) */
    isVisible?: boolean;
}


/**
 *  Props for bulk action popup in the table
 */
export interface AppTableBulkActionPopupProps {
    onClose: () => void;
    open: boolean;
    selectedCount?: number;
    totalCount?: number;
    customMessage?: React.ReactNode;
    containerClassName?: string;
    buttonList: {
        label: React.ReactNode;
        icon?: React.ReactNode;
        onClick: () => void;
        className?: string;
        variant?: VariantProps<typeof buttonVariants>['variant'];
    }[]
}

/**
 * Options for table limit selection
 */
export interface TableLimitOptions {
    /** The numeric value for the limit */
    value: number;
    /** Display label for the limit option */
    label: string;
}

/**
 * Props for table pagination controls
 */
export interface TablePaginationProps {
    /** Current page number (1-based) */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Whether pagination controls are disabled */
    disabled?: boolean;
    /** Callback fired when page changes */
    onPageChange: (page: number) => void;
}

/**
 * Props for table limit selector
 */
export interface TableLimitProps {
    /** Current limit value */
    limit: number;
    /** Callback fired when limit changes */
    onLimitChange: (limit: number) => void;
    /** Available limit options */
    limitOptions?: number[] | TableLimitOptions[];
    /** Whether the limit selector is disabled */
    disabled?: boolean;
}




// Context menu item types
/**
 * Props for table row context menu
 */
export interface TableRowMenuPropsType {
    /** Title for the menu */
    title?: string;
    /** Icon to display for the menu trigger */
    icon?: React.ReactNode;
    /** Display type for the menu */
    type?: 'dropdown' | 'inline';
    /** Additional CSS classes */
    className?: string;
    /** Whether the menu is in a loading state */
    loading?: boolean;
    /** Whether the menu is disabled */
    disabled?: boolean;
    /** Button variant */
    variant?: VariantProps<typeof buttonVariants>['variant'];
    /** Button size */
    size?: VariantProps<typeof buttonVariants>['size'];
    /** Array of menu items */
    menuItems: {
        /** Display content for the menu item */
        label: React.ReactNode;
        /** Icon for the menu item */
        icon?: React.ReactNode;
        /** Callback fired when menu item is clicked */
        onClick?: () => void;
        /** CSS classes for the menu item */
        className?: string;
        /** Whether the menu item should be visible */
        isVisible?: boolean;
        /** Whether the menu item is disabled */
        disabled?: boolean;
        /** Additional content to display alongside the label */
        sup?: React.ReactNode;
        /** Loading state for the menu item */
        loading?: boolean;
        /** Loading text for the menu item */
        loadingText?: string;
    }[];
}

// Context menu item types
/**
 * Props for table column context menu
 */
export interface TableColumnMenuPropsType<T> {
    /** Column definitions for the table */
    columnsKeys: ({ label: string, id: string } | string)[];
    /** Callback fired when column visibility changes */
    onColumnToggle: (columnKey: string, isVisible: boolean, column: TableColumnMenuPropsType<T>['columnsKeys'][number]) => void;
    /** Custom trigger element */
    children?: React.ReactNode;
    /** Title for the button */
    title?: string;
    /** Additional CSS classes */
    className?: string;
    /** Button variant */
    variant?: VariantProps<typeof buttonVariants>['variant'];
    /** Button size */
    size?: VariantProps<typeof buttonVariants>['size'];
}


/**
 * Configuration for filter fields in the table
 */
export type FilterFieldConfig =
    | {
        /** Unique key for the filter field */
        key: string;
        /** Display label for the filter field */
        label: string;
        /** Type of filter input */
        type: "text" | "number" | "boolean";
    }
    | {
        /** Unique key for the filter field */
        key: string;
        /** Display label for the filter field */
        label: string;
        /** Type of filter input */
        type: "select";
        /** Options for select dropdown */
        dataList: { value: string; label: string }[];
    }
    | {
        /** Display label for the filter field */
        label: string;
        /** Type of filter input */
        type: "dateRange";
        /** Key for start date field */
        startDateKey: string;
        /** Key for end date field */
        endDateKey: string;
    };

/**
 * Props for pagination detail display
 */
export type PaginationDetailProps = {
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Custom render function for pagination details */
    children?: ({ itemStart, itemEnd, total }: { itemStart: number; itemEnd: number; total: number }) => React.ReactNode;
}

// types.ts
/**
 * Base props for all filter components
 * @template T - The type of value the filter handles
 */
export interface BaseFilterProps<T> {
    /** Display label for the filter */
    label?: string;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Current value of the filter */
    value?: T;
    /** Default value for the filter */
    defaultValue?: T;
    /** Whether the filter is disabled */
    disabled?: boolean;
    /** Callback fired when filter gains focus */
    onFocus?: () => void;
    /** Callback fired when filter loses focus */
    onBlur?: () => void;
    /** Callback fired when filter value changes */
    onChange: (value: T) => void;
    /** Whether to show a clear button */
    clearable?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Callback fired when clear button is clicked */
    onClear?: () => void;
}

/**
 * Props for text filter component
 */
export interface TextFilterProps extends BaseFilterProps<string> {
    /** Filter type identifier */
    type: "text";
    /** Whether to debounce input changes */
    debounce?: boolean;
    /** Debounce delay in milliseconds (default: 400ms) only works if debounce is true */
    delay?: number;
}

/**
 * Props for number filter component
 */
export interface NumberFilterProps extends BaseFilterProps<number | null> {
    /** Filter type identifier */
    type: "number";
    /** Whether to debounce input changes */
    debounce?: boolean;
    /** Debounce delay in milliseconds (default: 400ms) only works if debounce is true */
    delay?: number;
}

/**
 * Props for number range filter component
 */
export interface NumberRangeFilterProps extends BaseFilterProps<AppTableRange<number>> {
    /** Filter type identifier */
    type: "number-range";
    /** Custom render function for selected value display */
    selectedRender?: (item: AppTableRange<number>) => React.ReactNode;
}

/**
 * Props for date filter component
 */
export interface DateFilterProps extends BaseFilterProps<Date | null> {
    /** Filter type identifier */
    type: "date";
    /** Custom render function for selected date display */
    selectedRender?: (date: Date | null) => React.ReactNode;
    /** Function to determine which dates should be disabled */
    disableDates?: (date: Date) => boolean;
}

/**
 * Props for date range filter component
 */
export interface DateRangeFilterProps extends BaseFilterProps<AppTableRange<Date>> {
    /** Filter type identifier */
    type: "date-range";
    /** Custom render function for selected date range display */
    selectedRender?: (item: AppTableRange<Date>) => React.ReactNode;
    /** Callback fired when date range is applied */
    onApply?: (item: AppTableRange<Date>) => void;
    /** Function to determine which dates should be disabled */
    disableDates?: (date: Date) => boolean;
}

/**
 * Props for select filter component
 */
export interface SelectFilterProps extends BaseFilterProps<string> {
    /** Filter type identifier */
    type: "select";
    /** Options for the select dropdown */
    options: Array<string | { label: string | React.ReactNode; value: string }>;
    /** Whether the select is searchable */
    searchable?: boolean;
    /** Whether to hide checkboxes in the dropdown */
    hideCheckbox?: boolean;
}

/**
 * Props for multi-select filter component
 */
export interface MultiSelectFilterProps extends BaseFilterProps<string[]> {
    /** Filter type identifier */
    type: "multi-select";
    /** Options for the multi-select dropdown */
    options: Array<string | { label: string | React.ReactNode; value: string }>;
    /** Whether the select is searchable */
    searchable?: boolean;
    /** Whether to hide checkboxes in the dropdown */
    hideCheckbox?: boolean;
    /** Maximum number of selected items to display */
    maxView?: number;
}
/**
 * Props for checkbox filter component
 */
export interface CheckboxFilterProps extends Omit<BaseFilterProps<boolean>, 'label' | 'onBlur' | 'onFocus' | 'clearable' | 'onClear' | 'className'> {
    /** Filter type identifier */
    type: "checkbox";
    /** CSS classes for the checkbox container */
    className?: string | ((isChecked: boolean) => string);
    /** CSS classes for the checkbox element */
    checkboxClassName?: string | ((isChecked: boolean) => string);
    /** Render function for custom checkbox content */
    children: (args: {
        CheckboxComponent: React.ReactNode;
        isChecked: boolean;
    }) => React.ReactNode;
}

/**
 * Union type for all possible filter item props
 */
export type AppTableFilterItemProps =
    | TextFilterProps
    | NumberFilterProps
    | NumberRangeFilterProps
    | DateFilterProps
    | DateRangeFilterProps
    | SelectFilterProps
    | MultiSelectFilterProps
    | CheckboxFilterProps;

/**
 * Generic range type for filters
 * @template T - The type of values in the range
 */
export interface AppTableRange<T> {
    /** Start value of the range */
    from?: T;
    /** End value of the range */
    to?: T;
}


function example() {
    const rangeExample: AppTableRange<number> = { from: 10, to: 20 };
    if (Math.random() > 0.5) {
        return null
    }
    return rangeExample;
}

