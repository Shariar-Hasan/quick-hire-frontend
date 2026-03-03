import { PaginationTypes } from "@/types/table-types";
import { useMemo, useState } from "react";

/**
 * useQueryParams
 *
 * Transforms options into flat query params:
 * - Removes empty/nullish values and empty arrays
 * - Spreads nested `filters` object as flat keys (instead of JSON-stringifying)
 * - JSON-stringifies any other nested objects
 */
export function useQueryParams<T extends Record<string, any>>(options: PaginationTypes<T>): {
    queryParams: Record<string, any>;
    options: PaginationTypes<T>;
    setOptions: React.Dispatch<React.SetStateAction<PaginationTypes<T>>>;
} {
    const [optionsState, setOptionsState] = useState(options);
    const queryParams: Record<string, any> = useMemo(() => {
        const result: Record<string, any> = {};
        for (const [k, v] of Object.entries(optionsState)) {
            if (v === "" || v === undefined || v === null) continue;
            if (Array.isArray(v) && v.length === 0) continue;

            if (k === 'filters' && v !== null && typeof v === 'object' && !Array.isArray(v)) {
                // Spread filter fields as flat query params
                for (const [fk, fv] of Object.entries(v as Record<string, any>)) {
                    if (fv === "" || fv === undefined || fv === null) continue;
                    if (Array.isArray(fv) && fv.length === 0) continue;
                    result[fk] = Array.isArray(fv) ? fv.join(',') : fv;
                }
            } else if (typeof v === 'object' && !Array.isArray(v)) {
                result[k] = JSON.stringify(v);
            } else if (Array.isArray(v)) {
                result[k] = v.join(',');
            } else {
                result[k] = v;
            }
        }
        return result;
    }, [optionsState]);

    return {
        queryParams,
        options: optionsState,
        setOptions: setOptionsState,
    };
}
