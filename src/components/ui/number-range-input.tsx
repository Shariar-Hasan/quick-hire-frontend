"use client";

import { cn } from "@/lib/utils"; // optional if you use cn helper
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { NumberRangeFilterProps } from "@/types/table-types";
import { useEffect, useState } from "react";
import { X } from "lucide-react";


export function NumberRangeInput({
    value,
    defaultValue,
    onChange,
    label,
    placeholder = "Select range",
    className,
    selectedRender,
    disabled,
    onClear,
}: NumberRangeFilterProps) {
    const [open, setOpen] = useState(false);
    const [start, setStart] = useState<string>(defaultValue?.from?.toString() || "");
    const [end, setEnd] = useState<string>(defaultValue?.to?.toString() || "");

    // Update local state if parent value changes
    useEffect(() => {
        if (value) {
            setStart(value.from?.toString() || "");
            setEnd(value.to?.toString() || "");
        }
    }, [value]);

    const handleApply = () => {
        console.log({ start, end });
        const startNum = start ? Number(start) : undefined;
        const endNum = end ? Number(end) : undefined;
        onChange({ from: startNum, to: endNum });
        setOpen(false);
    };

    const handleReset = () => {
        setStart("");
        setEnd("");
        onClear?.();
        // onChange({ from: undefined, to: undefined });
        setOpen(false);
    };

    const displayLabel =
        value?.from || value?.to
            ? `${value?.from ?? ""}${value?.to ? " - " + value?.to : ""}`
            : placeholder;
    const hasValue = !!(value?.from || value?.to);
    return (
        <div className={cn("w-full", className)}>
            {label && <div className="mb-1 text-sm font-medium">{label}</div>}

            <Popover open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-between text-left font-normal",
                                {
                                    "text-muted-foreground": !value?.from && !value?.to,
                                    "pr-8": hasValue,
                                    "cursor-not-allowed opacity-80": disabled,
                                },
                                className
                            )}
                            disabled={open}
                        >
                            {selectedRender
                                ? hasValue
                                    ? selectedRender({ from: value?.from, to: value?.to } as { from?: number; to?: number })
                                    : placeholder
                                : displayLabel}
                        </Button>
                    </PopoverTrigger>
                    {hasValue && (
                        <X
                            className="absolute top-1/2 -translate-y-1/2 right-2 h-4.5 w-4.5 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-gray-500/10 rounded"
                            onClick={(e: React.MouseEvent<SVGElement>) => {
                                e.stopPropagation();
                                handleReset();
                            }}
                        />
                    )}
                </div>

                <PopoverContent className="w-65 p-4" align="start">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="From"
                                value={start}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStart(e.target.value)}
                            />
                            <Input
                                type="number"
                                placeholder="To"
                                value={end}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)}
                            />
                        </div>

                        <Separator className="my-2" />

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleApply}
                                disabled={!start && !end}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
