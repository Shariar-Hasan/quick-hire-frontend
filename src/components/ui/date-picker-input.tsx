"use client";

import dayjs from "dayjs";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateFilterProps } from "@/types/table-types";
import { useEffect, useState } from "react";

export function DatePickerInput(props: DateFilterProps) {
    const {
        value,
        defaultValue,
        onChange,
        disabled,
        clearable = true,
        onClear,
        placeholder = "Pick a date",
        className,
        disableDates
    } = props;
    const [open, setOpen] = useState(false);

    const handleChange = (d: Date | undefined) => {
        onChange(d ?? null);
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        onChange(null);
        onClear?.();
    };
    const isClearable = !!value && !disabled && clearable;
    return (
        <Popover open={open} onOpenChange={setOpen} >
            <div className="relative">
                <PopoverTrigger asChild>
                    <div>
                        {props.label && <div className="mb-1 text-sm font-medium">{props.label}</div>}
                        <Button
                            variant="outline"
                            disabled={disabled}
                            className={cn(
                                "w-full justify-start items-center text-left font-normal",
                                !value && "text-muted-foreground",
                                className,
                                disabled && "cursor-not-allowed! opacity-50",
                                { "pr-8!": isClearable }
                            )}
                        >
                            <CalendarIcon className="h-4 w-4" />
                            {
                                props.selectedRender
                                    ? (
                                        !!value
                                            ? props.selectedRender(value)
                                            : <span>{placeholder}</span>
                                    )
                                    : !!value
                                        ? dayjs(value).format("DD MMM YYYY")
                                        : <span>{placeholder}</span>
                            }
                        </Button>

                    {isClearable && (
                        <X
                            className="absolute right-2 bottom-0.5 rounded hover:bg-gray-100 -translate-y-1/2 h-4 w-4 cursor-pointer opacity-60 hover:opacity-100"
                            onClick={handleClear}
                        />
                    )}
                    </div>
                </PopoverTrigger>
            </div>

            <PopoverContent className="w-auto p-0" align="start">
                {!disabled && <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={handleChange}
                    disabled={(date) => !!disableDates?.(date) || !!disabled}
                    initialFocus
                />}
            </PopoverContent>
        </Popover>
    );
}
