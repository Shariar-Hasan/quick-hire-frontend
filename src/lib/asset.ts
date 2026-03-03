import { Env } from "@/constants/env.constant"

export abstract class Asset {
    private static assetUrl = Env.ASSET_URL;

    static logoUrl(url?: string | null) {
        if (!url) return ''
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url
        // Backend returns full relative paths like /uploads/logos/file.jpg
        if (url.startsWith('/uploads/')) return this.assetUrl + url
        return this.combineUrls('/uploads/logos', url)
    }

    static resumeUrl(url?: string | null) {
        if (!url) return ''
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url
        // Backend returns full relative paths like /uploads/resumes/file.pdf
        if (url.startsWith('/uploads/')) return this.assetUrl + url
        return this.combineUrls('/uploads/resumes', url)
    }

    private static combineUrls(base: string, path: string): string {
        if (base.endsWith('/')) base = base.slice(0, -1);
        if (!path.startsWith('/')) path = '/' + path;
        return this.assetUrl + base + path;
    }
}