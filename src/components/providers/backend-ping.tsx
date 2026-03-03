'use client'

import { useEffect } from 'react'
import { Env } from '@/constants/env.constant'

/**
 * Silently pings the backend health endpoint on app load.
 * This wakes up the Render free-tier instance before users
 * start making real API requests.
 */
export function BackendPing() {
    useEffect(() => {
        const baseUrl = Env.API_URL.replace(/\/api$/, '')
        fetch(`${baseUrl}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {
            // Silently ignore — backend may take a moment to wake up
        })
    }, [])

    return null
}
