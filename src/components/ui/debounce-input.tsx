import useDebounce from "@/hooks/useDebounce";
import { AppTableSearchProps, TextFilterProps } from "@/types/table.types";
import { ChangeEvent, useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export default function DebouncedInput(props: TextFilterProps) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce((val) => props.onChange?.(val), props.delay || 400);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
        if (props.debounce) {
            debouncedSearch(val);
        } else {
            props.onChange?.(val);
        }
    };

    return (
        <div className={cn("relative max-h-fit w-full", props.className)}>
            <Input
                type="text"
                value={searchValue}
                className={cn("min-w-[220px] w-full", {
                    "pr-8": props.clearable && searchValue.trim(),
                    "cursor-not-allowed opacity-80": props.disabled,
                })}
                placeholder={props.placeholder || "Search..."}
                onChange={handleChange}
                disabled={props.disabled}
            />
            {props.clearable && searchValue.trim() && (
                <X
                    className="absolute hover:opacity-100 opacity-45 right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground border border-transparent hover:border-gray-200 rounded-sm cursor-pointer"
                    onClick={() => {
                        setSearchValue('')
                        props.onClear?.()
                    }}
                />
            )}
        </div>
    );
};