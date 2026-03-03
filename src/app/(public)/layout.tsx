'use client'

import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import { usePathname } from 'next/navigation'
import React from 'react'

const AUTH_ROUTES = ['/login', '/register']

const layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const isAuth = AUTH_ROUTES.includes(pathname)

    if (isAuth) return <>{children}</>

    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    )
}

export default layout
