import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
    checked = false, 
    indeterminate = false, 
    onCheckedChange, 
    ...props 
}) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <input
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            onChange={e => onCheckedChange?.(e.target.checked)}
            className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:border-blue-500 focus:bg-blue-500 focus-within:bg-blue-500 focus:border-2 cursor-pointer"
            {...props}
        />
    );
};

export default Checkbox;
