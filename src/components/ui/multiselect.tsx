import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover";
import { Button } from "@/components/common/button";
import { ChevronDown, Search, X } from "lucide-react";
import Checkbox from "./checkbox";
import { cn, formatMultiValues } from "@/lib/utils";
import React, { useMemo, useRef, useState } from "react";
import { Parser } from "@/lib/htmlParser";

export type MultiSelectProps = {
    options: { value: string; label: string | React.ReactNode; disabled?: boolean; }[];
    value?: string[];
    onValueChange?: (value: string[]) => void;
    label?: string;
    placeholder?: string;
    maxView?: number;
    disabled?: boolean;
    single?: boolean;
    searchable?: boolean;
    hideCheckbox?: boolean;
    clearable?: boolean;
    onClear?: () => void;
    onSearchChange?: (searchTerm: string) => void;
    containerClassName?: string;
    className?: string;
    emptyMessage?: string;
};


export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value = [],
    onValueChange,
    label,
    placeholder = "Select...",
    maxView = 2,
    disabled,
    single = false,
    searchable = true,
    hideCheckbox = false,
    clearable = true,
    onClear,
    onSearchChange,
    className,
    containerClassName,
    emptyMessage = "No options found"
}) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [values, setValues] = useState<string[]>(value || []);
    const searchTermTimeRef = useRef<NodeJS.Timeout | null>(null);

    const handleToggle = (optionValue: string, event?: React.MouseEvent) => {
        // Prevent the event from bubbling up to close the popover
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];

        onValueChange?.(newValue);
        if (single) {
            onValueChange?.([optionValue]);
            setOpen(false);
            setValues([optionValue]);
        } else {
            const newValue = value.includes(optionValue)
                ? value.filter((v) => v !== optionValue)
                : [...value, optionValue];
            onValueChange?.(newValue);
            setValues(newValue);
        }
    };
    const handleClear = () => {
        setValues([]);
        onValueChange?.([]);
        onClear?.();
    };
    const filteredOptions = useMemo(() => {
        return options.filter(option => {
            const labelText =
                typeof option.label === "string"
                    ? option.label
                    : Parser.extractTextFromReactNode(option.label);

            return labelText.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [options, searchTerm]);


    return (
        <div className={cn("w-full", containerClassName)}>
            {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
            <Popover open={open} onOpenChange={setOpen} modal>
                <div className="relative">
                    <PopoverTrigger asChild className="" >
                        <Button variant="outline" disabled={disabled} className={cn("w-full flex justify-between shrink! relative pr-10 group text-ellipsis", className, {
                            "bg-gray-100 cursor-not-allowed opacity-80 ": disabled,
                            "pr-8": clearable
                        },)}>
                            <span className="text-ellipsis">
                                {value.length === 0 ? <span className="text-muted-foreground group-hover:text-gray-700">{placeholder}</span> : (formatMultiValues({
                                    values: options.filter(o => value.includes(o.value)).map(o => o.label),
                                    maxVisible: maxView,
                                    separator: ", ",
                                    operator: "+",
                                }))}
                            </span>
                            {
                            value.length === 0
                                &&
                                <ChevronDown className={cn("inline-block h-4 w-4 ml-2", {
                                    'opacity-50': disabled,
                                    'mr-4': clearable && values.length > 0,

                                })} />
                            }
                        </Button>
                    </PopoverTrigger>

                    {clearable && values.length > 0 && (
                        <X
                            className="absolute hover:opacity-100 opacity-45 right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground border border-transparent hover:border-gray-200 rounded-sm cursor-pointer"
                            onClick={() => {
                                handleClear();
                                onClear?.()
                            }}
                        />
                    )}
                </div>
                <PopoverContent
                    className="w-56 p-2 z-99999 bg-white border shadow-lg rounded-md"
                    sideOffset={4}
                    align="center"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    style={{ zIndex: 99999 }}

                >
                    {searchable && <div className="relative">
                        {/* make a searchable options */}
                        <Search className="absolute left-2 top-[17px] -translate-y-1/2 text-xs w-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search label..."
                            className="w-full caret-gray-400 placeholder:text-xs placeholder:pl-1 mb-2 pl-6 px-2 py-1 border rounded"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                onSearchChange?.(e.target.value);
                            }}
                        />
                    </div>}
                    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" data-multiselect-content>
                        {filteredOptions.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                return <label
                                    key={option.value}
                                    htmlFor={`multi-${option.value}`}
                                    className={cn("flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded text-sm", {
                                        "bg-gray-200 hover:bg-gray-300": value.includes(option.value),
                                        "opacity-50 cursor-not-allowed": option.disabled,
                                    })}
                                    onClick={() => {
                                        if (option.disabled) return;
                                        if (searchTermTimeRef.current) {
                                            clearTimeout(searchTermTimeRef.current);
                                        }
                                        searchTermTimeRef.current = setTimeout(() => {
                                            setSearchTerm("");
                                        }, 200);
                                    }}
                                >
                                    <Checkbox
                                        checked={value.includes(option.value)}
                                        id={`multi-${option.value}`}
                                        onCheckedChange={() => {
                                            if (option.disabled) return;
                                            handleToggle(option.value);
                                        }}
                                        disabled={option.disabled}
                                        className={cn("cursor-pointer", {
                                            "hidden": hideCheckbox
                                        })}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            })
                        )}
                    </div>
                    {
                        !single &&
                        <>
                            <hr />
                            <div className="flex gap-2 mt-2 justify-end flex-wrap">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setOpen(false);
                                        handleClear();
                                    }}
                                >
                                    Clear
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Done
                                </Button>
                            </div>

                        </>
                    }
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default MultiSelect;
