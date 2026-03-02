import { Env } from '@/constants/env.constant'

const API_BASE = Env.API_URL.replace('/api', '')

/**
 * Converts a stored logo_url (which may be a relative server path like
 * "/uploads/logos/file.jpg") into a fully-qualified URL that a browser can load.
 * Absolute URLs (http/https) are returned unchanged.
 */
export function logoUrl(url?: string | null): string {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url
    return `${API_BASE}${url}`
}
