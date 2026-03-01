import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { NumberFilterProps } from '@/types/table-types';
import React, { ChangeEvent, useState } from 'react'
import { Input } from './input';
import { X } from 'lucide-react';

const NumberInput = (props: NumberFilterProps) => {
    const [value, setValue] = useState('');
    const debouncedSearch = useDebounce((val) => {
        const num = val === '' || isNaN(Number(val)) ? null : Number(val);
        props.onChange?.(num);
    }, props.delay || 400);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const targetValue = e.target.value;
        const val = targetValue === '' || isNaN(Number(targetValue)) ? 0 : Number(targetValue);
        setValue(val.toString());
        if (props.debounce) {
            debouncedSearch(val.toString());
        } else {
            props.onChange?.(val);
        }
    };

    return (
        <div className="relative max-h-fit w-full">
            <Input
                type="number"
                value={value}
                className={cn("min-w-[220px]", props.className, {
                    "pr-8": props.clearable && value.trim(),
                    "cursor-not-allowed opacity-80": props.disabled,
                })}
                placeholder={props.placeholder || "Search..."}
                onChange={handleChange}
            />
            {props.clearable && value.trim() && (
                <X
                    className="absolute hover:opacity-100 opacity-45 right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground border border-transparent hover:border-gray-200 rounded-sm cursor-pointer"
                    onClick={() => {
                        setValue('')
                        props.onClear?.()
                    }}
                />
            )}
        </div>
    );
};

export default NumberInput