import React from 'react'
import { SidebarProvider } from '../ui/sidebar'
import { ConfirmDialogProvider } from './confirm-provider'
import { TooltipProvider } from '../ui/tooltip'
import { BackendPing } from './backend-ping'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <TooltipProvider>
            <ConfirmDialogProvider>
                <BackendPing />
                {children}
            </ConfirmDialogProvider>
        </TooltipProvider>
    )
}

export default AllProviders