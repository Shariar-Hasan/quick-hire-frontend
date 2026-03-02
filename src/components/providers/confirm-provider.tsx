'use client'
import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";

interface ConfirmDialogOptions {
    title?: string;
    description?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;

}

type ConfirmDialogContextType = (options?: ConfirmDialogOptions) => Promise<boolean>;


const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirm = () => {
    const ctx = useContext(ConfirmDialogContext);
    if (!ctx) throw new Error("useConfirm must be used within ConfirmDialogProvider");
    return ctx;
};

export const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmDialogOptions>({});
    const resolver = useRef<(result: boolean) => void>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const confirm = (opts?: ConfirmDialogOptions) => {
        setOptions(opts || {});
        clearTimeout(timeoutRef.current as NodeJS.Timeout);
        timeoutRef.current = setTimeout(() => {
            setOpen(true);
        }, 1);
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    };

    const handleClose = (result: boolean) => {
        setOpen(false);
        resolver.current?.(result);
    };

    return (
        <ConfirmDialogContext.Provider value={confirm}>
            {children}
            {typeof window !== "undefined" && createPortal(
                <Dialog open={open} onOpenChange={() => handleClose(false)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{options.title || "Are you sure?"}</DialogTitle>
                            {options.description && <div className="text-muted-foreground mt-2">{options.description}</div>}
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => handleClose(false)}>
                                {options.cancelText || "Cancel"}
                            </Button>
                            <Button variant="destructive" onClick={() => handleClose(true)}>
                                {options.confirmText || "Confirm"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>,
                document.body
            )}
        </ConfirmDialogContext.Provider>
    );
};
