"use client";

import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { AppTableRange, DateRangeFilterProps } from "@/types/table-types";
import { DateRange } from "react-day-picker";


const PRESETS: { name: string; label: string }[] = [
    { name: "today", label: "Today" },
    { name: "yesterday", label: "Yesterday" },
    { name: "last7", label: "Last 7 days" },
    { name: "last30", label: "Last 30 days" },
    { name: "thisMonth", label: "This Month" },
    { name: "lastMonth", label: "Last Month" },
    { name: "lastYear", label: "Last Year" },
];

export function DateRangePickerInput(props: DateRangeFilterProps) {
    const {
        value,
        defaultValue,
        onChange,
        clearable = true,
        onClear,
        placeholder = "Select date range",
        selectedRender,
        className,
        onApply,
        type,
        disabled,
        label,
        onBlur,
        onFocus,
        disableDates
    } = props;
    const [open, setOpen] = useState(false);

    const [range, setRange] = useState<AppTableRange<Date> | null>(
        value ?? defaultValue ?? null
    );
    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
        undefined
    );

    const openedRangeRef = useRef<AppTableRange<Date> | undefined>(undefined);

    // sync controlled value
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (value !== undefined) setRange(value);
    }, [value]);

    // preserve initial state when popover opens
    useEffect(() => {
        openedRangeRef.current = range ?? undefined;
    }, [range]);

    const handleSelect = (r: { from?: Date; to?: Date } | undefined) => {
        const normalized = r ? { from: r.from ?? new Date(), to: r.to } : null;
        setRange(normalized);
        if (normalized?.from && normalized?.to) {
            onChange(normalized);
        } else {
            onChange({ from: undefined, to: undefined });
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRange(null);
        // onChange({ from: undefined, to: undefined });
        onClear?.();
        setSelectedPreset(undefined);
    };

    const renderLabel = () => {
        if (selectedRender && range) return selectedRender(range);
        if (!range || (!range.from && !range.to)) return placeholder;
        if (range.from && !range.to) return `${dayjs(range.from).format("DD MMM YYYY")} —`;
        if (!range.from && range.to) return `— ${dayjs(range.to).format("DD MMM YYYY")}`;
        return `${dayjs(range.from).format("DD MMM YYYY")} — ${dayjs(range.to).format(
            "DD MMM YYYY"
        )}`;
    };

    const selectPreset = (presetName: string) => {
        let from = new Date();
        let to = new Date();
        switch (presetName) {
            case "today":
                from = new Date();
                to = new Date();
                break;
            case "yesterday":
                from.setDate(from.getDate() - 1);
                to.setDate(to.getDate() - 1);
                break;
            case "last7":
                from.setDate(from.getDate() - 6);
                break;
            case "last30":
                from.setDate(from.getDate() - 29);
                break;
            case "thisMonth":
                from.setDate(1);
                break;
            case "lastMonth":
                from.setMonth(from.getMonth() - 1, 1);
                to.setDate(to.getDate());
                break;
            case "lastYear":
                from.setFullYear(from.getFullYear() - 1, to.getMonth(), to.getDate());
                to.setDate(to.getDate());
                break;
        }
        const newRange: AppTableRange<Date> = { from, to };
        setRange(newRange);
        setSelectedPreset(presetName);
        onChange(newRange);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="relative">
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full max-w-fit text-left font-normal",
                            (!range || (!range.from && !range.to)) && "text-muted-foreground",
                            className,
                            {
                                "pr-6": clearable && range && (range.from || range.to) && !disabled,
                                "cursor-not-allowed opacity-80": disabled,
                            }
                        )}
                    >
                        <div className="flex items-center justify-start gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="truncate">{renderLabel()} </span>
                        </div>
                    </Button>
                </PopoverTrigger>

                {range && (range.from || range.to) && clearable && (
                    <X
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer opacity-60 hover:opacity-100"
                        onClick={handleClear}
                    />
                )}
            </div>

            <PopoverContent className="w-auto p-4" align="center">
                <div className="flex gap-2">
                    <div className="flex gap-2 flex-wrap flex-col">
                        {PRESETS.map((preset) => (
                            <span
                                key={preset.name}
                                className="cursor-pointer rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-gray-800 hover:underline hover:bg-accent/20 select-none"
                                onClick={() => selectPreset(preset.name)}
                            >
                                {preset.label}
                            </span>
                        ))}
                    </div>

                    <Calendar
                        mode="range"
                        showWeekNumber
                        weekStartsOn={1}
                        selected={range as DateRange ?? undefined}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        disabled={(date) => !!disableDates?.(date) || !!disabled}
                    />
                </div>
                <hr />
                <div className="flex gap-2 justify-end mt-4">
                    <Button
                        variant="outline"
                        className="w-25"
                        onClick={() => {
                            handleSelect(undefined);
                            setSelectedPreset(undefined);
                            setOpen(false);

                            onClear?.();
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        className="w-25"
                        onClick={() => {
                            // if both dates are selected, close the popover
                            if (range && range.from && range.to) {
                                setSelectedPreset(undefined);
                                setOpen(false);
                                onApply?.(range);
                            }
                        }}
                        disabled={!range || !range.from || !range.to || disabled}
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
