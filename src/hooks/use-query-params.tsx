import { PaginationTypes } from "@/types/table-types";
import { useMemo, useState } from "react";

/**
 * useQueryParams
 * 
 * Filters an object to remove empty or nullish values
 * and stringifies nested objects for safe URL use.
 *
 * @param options The raw options object to transform
 * @returns A memoized object of valid query parameters
 */
export function useQueryParams<T extends Record<string, any>>(options: PaginationTypes<T>): {
    queryParams: Record<string, any>;
    options: PaginationTypes<T>;
    setOptions: React.Dispatch<React.SetStateAction<PaginationTypes<T>>>;
} {
    const [optionsState, setOptionsState] = useState(options);
    const queryParams: Record<string, any> = useMemo(() => {
        return Object.fromEntries(
            Object.entries(optionsState)
                .filter(([, v]) => v !== "" && v !== undefined && v !== null)
                .map(([k, v]) => [
                    k,
                    typeof v === "object"  ? JSON.stringify(v) : v
                ])
        );
    }, [optionsState]);

    return {
        queryParams,
        options: optionsState,
        setOptions: setOptionsState,
    };
}
