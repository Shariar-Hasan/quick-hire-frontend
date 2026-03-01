"use client";

import * as React from "react";
import { ChevronDown, X, GripVertical, Search } from "lucide-react";
import { cn, formatMultiValues } from "@/lib/utils";

export interface SimpleMultiSelectProps {
    options: { value: string; label: string | React.ReactNode; [key: string]: any }[];
    value?: string[];
    onValueChange?: (value: string[]) => void;
    placeholder?: string;
    label?: string | React.ReactNode;
    disabled?: boolean;
    className?: string;
    maxView?: number;
    allowReorder?: boolean;
    showSelectedItems?: boolean;
    onAddNew?: () => void;
    addNewLabel?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: string[];
    onSearch?: (option: any, query: string) => boolean;
    gridCols?: 1 | 2 | 3 | 4;
    alwaysOpen?: boolean;
}

export const SimpleMultiSelect: React.FC<SimpleMultiSelectProps> = ({
    options,
    value = [],
    onValueChange,
    placeholder = "Select options...",
    label,
    disabled = false,
    className,
    maxView = 100,
    allowReorder = false,
    showSelectedItems = true,
    onAddNew,
    addNewLabel = "Add New Item",
    searchable = false,
    searchPlaceholder = "Search...",
    searchKeys = ["label", "value"],
    onSearch,
    gridCols = 1,
    alwaysOpen = false,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");

    // Default search function
    const defaultSearch = (option: any, query: string): boolean => {
        if (!query.trim()) return true;
        
        const lowerQuery = query.toLowerCase();
        
        // Search through specified keys
        for (const key of searchKeys) {
            const value = option[key];
            if (typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
                return true;
            }
        }
        
        return false;
    };

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
        if (!searchable || !searchQuery.trim()) {
            return options;
        }
        
        const searchFn = onSearch || defaultSearch;
        return options.filter(option => searchFn(option, searchQuery));
    }, [options, searchQuery, searchable, searchKeys, onSearch]);

    const toggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onValueChange?.(newValue);
    };

    const removeOption = (optionValue: string) => {
        const newValue = value.filter(v => v !== optionValue);
        onValueChange?.(newValue);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newValue = [...value];
        const draggedItem = newValue[draggedIndex];
        newValue.splice(draggedIndex, 1);
        newValue.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        onValueChange?.(newValue);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSearchQuery(""); // Reset search when closing
        }
    };

    const getSelectedLabels = () => {
        return value.map(v => options.find(opt => opt.value === v)?.label || v);
    };

    const getDisplayText = () => {
        if (value.length === 0) {
            return <span className="text-gray-500">{placeholder}</span>;
        }

        const selectedLabels = getSelectedLabels().map((label, index) => <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
        >
            {label}
            {!disabled && (
                <X
                    className="w-3 h-3 cursor-pointer hover:text-blue-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeOption(value[index]);
                    }}
                />
            )}
        </span>); // Ensure no undefined labels
        const displayText = formatMultiValues({
            values: selectedLabels,
            maxVisible: maxView,
            separator: <span className="pr-1"></span>,
            operator: "+",
        });

        return displayText;
    };

    return (
        <div className={cn("relative w-full", className)}>
            {label && <label className="block mb-1 text-sm font-medium">{label}</label>}

            {/* Selected Items Display (outside popup) */}
            {showSelectedItems && value.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                    {value.map((v, index) => {
                        const option = options.find(opt => opt.value === v);
                        return (
                            <div
                                key={v}
                                draggable={allowReorder && !disabled}
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded",
                                    allowReorder && !disabled && "cursor-grab hover:bg-blue-200",
                                    draggedIndex === index && "opacity-50 cursor-grabbing"
                                )}
                            >
                                {allowReorder && !disabled && (
                                    <GripVertical className="w-3 h-3 text-blue-600" />
                                )}
                                <span>{option?.label || v}</span>
                                {!disabled && (
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeOption(v);
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Trigger Button */}
            {!alwaysOpen && (
                <button
                    type="button"
                    onClick={() => !disabled && handleOpenChange(!isOpen)}
                    disabled={disabled}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex flex-1 gap-y-1 flex-wrap items-center">
                        {!showSelectedItems ? getDisplayText() : (
                            value.length === 0 ? (
                                <span className="text-gray-500">{placeholder}</span>
                            ) : (
                                <span className="text-sm text-gray-700">{value.length} selected</span>
                            )
                        )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            )}

            {/* Dropdown */}
            {(isOpen || alwaysOpen) && (
                <>
                    {/* Backdrop */}
                    {!alwaysOpen && (
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => handleOpenChange(false)}
                        />
                    )}

                    {/* Options */}
                    <div className={cn(
                        "w-full bg-white border border-gray-300 rounded-md  overflow-hidden flex flex-col",
                        alwaysOpen ? "relative mt-2 max-h-96" : "absolute z-20 mt-1 max-h-60 shadow-lg"
                    )}>
                        {/* Search Input */}
                        {searchable && (
                            <div className="p-2 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={searchPlaceholder}
                                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Add New Button (Top) */}
                        {onAddNew && (
                            <div className="border-b border-gray-200 p-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddNew();
                                    }}
                                    className="w-full px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded font-medium"
                                >
                                    + {addNewLabel}
                                </button>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded scrollbar-track-rounded flex-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-8 text-sm text-gray-500 text-center">
                                    No options found
                                </div>
                            ) : (
                                <div className={cn(
                                    "grid gap-0",
                                    gridCols === 1 && "grid-cols-1",
                                    gridCols === 2 && "grid-cols-2",
                                    gridCols === 3 && "grid-cols-3",
                                    gridCols === 4 && "grid-cols-4",
                                    gridCols!== 1 && "p-2 gap-2"
                                )}>
                                    {filteredOptions.map((option) => {
                                        const isSelected = value.includes(option.value);
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => toggleOption(option.value)}
                                                className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => { }} // Handled by parent onClick
                                                    className="mr-2"
                                                />
                                                <span>{option.label}</span>
                                                {isSelected && (
                                                    <span className="ml-auto text-blue-600">✓</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        {(value.length > 0) && (!alwaysOpen || onAddNew) && (
                            <div className="border-t border-gray-200 p-2 space-y-2">
                                {onAddNew && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddNew();
                                        }}
                                        className="w-full px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded font-medium"
                                    >
                                        + {addNewLabel}
                                    </button>
                                )}
                                {value.length > 0 && !alwaysOpen && (
                                    <button
                                        type="button"
                                        onClick={() => handleOpenChange(false)}
                                        className="w-full px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                    >
                                        Done ({value.length} selected)
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SimpleMultiSelect;
