import { CheckboxFilterProps } from '@/types/table-types'
import React from 'react'
import Checkbox from './checkbox';
import { cn } from '@/lib/utils';

const CheckboxFilter = (props: CheckboxFilterProps) => {

    const { value, defaultValue, disabled, children, onChange, className, checkboxClassName } = props;


    const isChecked = value ?? defaultValue ?? false;
    const resolvedClassName =
        typeof className === 'function'
            ? className(isChecked)
            : className ?? '';
    const resolvedCheckboxClassName =
        typeof checkboxClassName === 'function'
            ? checkboxClassName(isChecked)
            : checkboxClassName ?? '';

    const CheckboxComponent = <Checkbox
        className={cn('cursor-pointer', resolvedCheckboxClassName)}
        checked={value}
        defaultChecked={value === undefined ? defaultValue : undefined}
        disabled={disabled}
        onCheckedChange={onChange}

    />
    return (
        <div
            className={cn('inline-flex items-center space-x-2', resolvedClassName)}
            onClick={(e) => {
                e.stopPropagation();
                onChange(!isChecked)
            }}
        >
            {
                typeof children === 'function'
                    ? children({ CheckboxComponent, isChecked })
                    : children
            }
        </div>
    )

}

export default CheckboxFilter