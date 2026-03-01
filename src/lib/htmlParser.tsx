
import React from "react";
import { cn } from "./utils";

// i want to make parser that can parse html string and return text content with line breaks where <br> or block elements are present
interface HtmlToTextConfigType {
    preserveLineBreaks?: boolean;
    wordCount?: number;
}
interface TextToHtmlConfigType {
    fallbackText?: string;
    extendedStyles?: string;
    className?: string;
}

type HtmlToTextHandler = (html: string, config?: HtmlToTextConfigType) => string;
type TextToHtmlHandler = (html: string, config?: TextToHtmlConfigType) => React.ReactNode;

export const parseTextToHtml: TextToHtmlHandler = (html, config) => {
    const style = config?.extendedStyles ? <style>{config.extendedStyles}</style> : null;
    return <>
        {style}
        <div
            className={cn("prose dark:prose-invert max-w-full", config?.className)}
            dangerouslySetInnerHTML={{ __html: html || config?.fallbackText || "Not available." }}
        />
    </>;
}

export abstract class Parser {
    // Parse HTML to Text with line breaks
    public static html2text: HtmlToTextHandler = (html, config) => {
        if (!html || typeof html !== "string") return "";

        // tags that should insert a newline before + after
        const blockTags = new Set([
            "p", "div", "li", "ul", "ol",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "blockquote", "section", "article"
        ]);

        let result = "";
        let i = 0;

        function eatTagName(s: string, pos: number) {
            let name = "";
            while (pos < s.length && /[a-zA-Z0-9]/.test(s[pos])) {
                name += s[pos];
                pos++;
            }
            return name.toLowerCase();
        }

        while (i < html.length) {
            const ch = html[i];

            if (ch === "<") {
                // tag
                const close = html.indexOf(">", i);
                if (close === -1) break;

                const inside = html.slice(i + 1, close).trim().toLowerCase();
                const isClosing = inside.startsWith("/");

                let tagName = "";

                if (isClosing) {
                    tagName = inside.slice(1).split(/\s+/)[0];
                    if (blockTags.has(tagName)) result += "\n";
                } else {
                    tagName = eatTagName(inside, 0);

                    if (tagName === "br") {
                        result += "\n";
                    } else if (blockTags.has(tagName)) {
                        result += "\n";
                    }
                }

                i = close + 1;
                continue;
            }

            // plain text
            result += ch;
            i++;
        }

        // cleanup
        result = result.replace(/\r+/g, "");
        result = result.replace(/&amp;/g, "&");
        result = result.replace(/[ \t]+/g, " ");

        if (config?.preserveLineBreaks) {
            result = result.replace(/\n{3,}/g, "\n\n");
        } else {
            result = result.replace(/\n+/g, " ");
        }

        result = result.trim();

        if (config?.wordCount) {
            const words = result.split(/\s+/);
            if (words.length > config.wordCount) {
                result = words.slice(0, config.wordCount).join(" ") + "...";
            }
        }

        return result;
    };


    // Parse Text to HTML
    public static text2html: TextToHtmlHandler = (html, config) => {
        const scopeClass = `html-scope-box-${Math.random().toString(36).slice(2)}`;

        const prefixedCss =
            config?.extendedStyles
                ? this.prefixCss(config.extendedStyles, `.${scopeClass}`)
                : "";

        return (
            <>
                {prefixedCss && <style>{prefixedCss}</style>}
                <div className={scopeClass}>
                    <div
                        className={cn("prose dark:prose-invert max-w-full", config?.className)}
                        dangerouslySetInnerHTML={{
                            __html: html || config?.fallbackText || "Not available.",
                        }}
                    />
                </div>
            </>
        );
    };

    private static prefixCss(css: string, scope: string) {
        // very small & safe: does not touch @keyframes or @font-face
        return css
            .split("}")
            .map(rule => {
                const [selectors, body] = rule.split("{");
                if (!body || !selectors.trim()) return "";

                // prefix every selector inside the rule
                const prefixed = selectors
                    .split(",")
                    .map(sel => `${scope} ${sel.trim()}`)
                    .join(", ");

                return `${prefixed}{${body}}`;
            })
            .join("}");
    }

    public static extractTextFromReactNode(node: React.ReactNode): string {
        if (node === null || node === undefined || typeof node === "boolean") {
            return "";
        }

        if (typeof node === "string" || typeof node === "number") {
            return node.toString();
        }

        if (Array.isArray(node)) {
            return node.map(child => this.extractTextFromReactNode(child)).join(" ");
        }

        // React element
        if (typeof node === "object" && "props" in node) {
            return this.extractTextFromReactNode((node as any).props.children);
        }

        return "";
    }

}


