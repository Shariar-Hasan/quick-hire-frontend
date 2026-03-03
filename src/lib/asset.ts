import { Env } from "@/constants/env.constant"

export abstract class Asset {
    private static assetUrl = Env.ASSET_URL;

    static logoUrl(url?: string | null) {
        if (!url) return ''
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url
        return this.combineUrls('', url)
    }

    static resumeUrl(url?: string | null) {
        if (!url) return ''
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url
        return this.combineUrls('', url)
    }

    private static combineUrls(base: string, path: string): string {
        if (base.endsWith('/')) base = base.slice(0, -1);
        if (!path.startsWith('/')) path = '/' + path;
        return this.assetUrl + base + path;
    }
}