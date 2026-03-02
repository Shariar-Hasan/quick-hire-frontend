import React from 'react'
import { SidebarProvider } from '../ui/sidebar'
import { ConfirmDialogProvider } from './confirm-provider'
import { TooltipProvider } from '../ui/tooltip'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <TooltipProvider>
            <ConfirmDialogProvider>
                {children}
            </ConfirmDialogProvider>
        </TooltipProvider>
    )
}

export default AllProviders