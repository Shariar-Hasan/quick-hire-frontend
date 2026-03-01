import { useCallback, useEffect, useRef } from "react";

// Debounce hook
export default function useDebounce(callback: (value: string) => void, delay: number = 400) {
    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    return useCallback((value: string) => {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => savedCallback.current(value), delay);
    }, [delay]);
}