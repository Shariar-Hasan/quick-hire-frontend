// import React, { useState, useEffect } from 'react';
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectItem,
//     SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { COUNTRY_CODES, CountryCodeType } from '@/content/country-list';
// import { SearchableSelect } from './searchable-select';
// import { ChevronDown } from 'lucide-react';

// export interface PhoneInputValue {
//     countryCode: string;
//     phone: string;
//     fullPhone: string;
// }

// interface PhoneInputProps {
//     value?: string;
//     onChange: (value: PhoneInputValue) => void;
//     placeholder?: string;
//     className?: string;
//     disabled?: boolean;
//     defaultCountryCode?: CountryCodeType;
// }

// export const PhoneInput: React.FC<PhoneInputProps> = ({ value = '', onChange, placeholder, className, disabled, defaultCountryCode }) => {
//     // Parse initial value
//     const initialCode = COUNTRY_CODES.find(c => value.startsWith(c.cc))?.cc
//         || COUNTRY_CODES.find(c => c.cc === defaultCountryCode)?.cc
//         || '+1';
//     const initialPhone = value.replace(initialCode, '').replace(/\D/g, '');

//     const [countryCode, setCountryCode] = useState(initialCode);
//     const [phone, setPhone] = useState(initialPhone);
//     const [search, setSearch] = useState('');

//     useEffect(() => {
//         onChange({ countryCode, phone, fullPhone: countryCode + phone });
//     }, [countryCode, phone, onChange]);

//     // Filter country codes for search
//     const filteredCodes = search
//         ? COUNTRY_CODES.filter(c =>
//             c.label.toLowerCase().includes(search.toLowerCase()) ||
//             c.cc.includes(search)
//         )
//         : COUNTRY_CODES;

//     return (
//         <div className={`flex items-center gap-2 relative ${className || ''}`}>
//             <SearchableSelect
//                 className='max-w-max absolute left-[1px] top-[1px] h-[33px] border-0 outline-0 border-r rounded-r-none'
//                 value={countryCode}
//                 onSelect={(code: string) => setCountryCode(code)}
//                 disabled={disabled}
//                 list={COUNTRY_CODES?.map(c => ({ value: c.cc, label: `${c.label} (${c.cc})` }))}
//                 selectedRender={(item) => (
//                     item?.value
//                 )}
//             />
//             <Input
//                 type="tel"
//                 className="flex-1 pl-[55px]"
//                 value={phone}
//                 onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
//                 placeholder={placeholder || 'Phone number'}
//                 disabled={disabled}
//             />
//         </div>
//     );
// };


import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/common/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/common/command";
import { Input } from "@/components/common/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/common/popover";
import { ScrollArea } from "@/components/common/scroll-area";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
    React.ComponentProps<"input">,
    "onChange" | "value" | "ref"
> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
    };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
    React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
        ({ className, onChange, value, ...props }, ref) => {
            return (
                <RPNInput.default
                    ref={ref}
                    className={cn("flex", className)}
                    flagComponent={FlagComponent}
                    countrySelectComponent={CountrySelect}
                    inputComponent={InputComponent}
                    smartCaret={false}
                    value={value || undefined}
                    /**
                     * Handles the onChange event.
                     *
                     * react-phone-number-input might trigger the onChange event as undefined
                     * when a valid phone number is not entered. To prevent this,
                     * the value is coerced to an empty string.
                     *
                     * @param {E164Number | undefined} value - The entered value
                     */
                    onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
                    {...props}
                />
            );
        },
    );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
    <Input
        className={cn("rounded-e-lg rounded-s-none", className)}
        {...props}
        ref={ref}
    />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    options: CountryEntry[];
    onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
    disabled,
    value: selectedCountry,
    options: countryList,
    onChange,
}: CountrySelectProps) => {
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Popover
            open={isOpen}
            modal
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) setSearchValue("");
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
                    disabled={disabled}
                >
                    <FlagComponent
                        country={selectedCountry}
                        countryName={selectedCountry}
                    />
                    <ChevronsUpDown
                        className={cn(
                            "-mr-2 size-4 opacity-50",
                            disabled ? "hidden" : "opacity-100",
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        value={searchValue}
                        onValueChange={(value) => {
                            setSearchValue(value);
                            setTimeout(() => {
                                if (scrollAreaRef.current) {
                                    const viewportElement = scrollAreaRef.current.querySelector(
                                        "[data-radix-scroll-area-viewport]",
                                    );
                                    if (viewportElement) {
                                        viewportElement.scrollTop = 0;
                                    }
                                }
                            }, 0);
                        }}
                        placeholder="Search country..."
                    />
                    <CommandList>
                        <ScrollArea ref={scrollAreaRef} className="h-72">
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countryList.map(({ value, label }) =>
                                    value ? (
                                        <CountrySelectOption
                                            key={value}
                                            country={value}
                                            countryName={label}
                                            selectedCountry={selectedCountry}
                                            onChange={onChange}
                                            onSelectComplete={() => setIsOpen(false)}
                                        />
                                    ) : null,
                                )}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
    selectedCountry: RPNInput.Country;
    onChange: (country: RPNInput.Country) => void;
    onSelectComplete: () => void;
}

const CountrySelectOption = ({
    country,
    countryName,
    selectedCountry,
    onChange,
    onSelectComplete,
}: CountrySelectOptionProps) => {
    const handleSelect = () => {
        onChange(country);
        onSelectComplete();
    };

    return (
        <CommandItem className="gap-2" onSelect={handleSelect}>
            <FlagComponent country={country} countryName={countryName} />
            <span className="flex-1 text-sm">{countryName}</span>
            <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
            <CheckIcon
                className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
            />
        </CommandItem>
    );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
        <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};

export { PhoneInput };
