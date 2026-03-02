"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Extension } from '@tiptap/core';
import { toast } from 'sonner';

// Custom FontSize extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }) => {
                return chain().setMark('textStyle', { fontSize }).run();
            },
            unsetFontSize: () => ({ chain }) => {
                return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
            },
        };
    },
});

interface Props {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    /** CSS length string, e.g. '200px' or '12rem' */
    minHeight?: string;
    disabled?: boolean;
}

export default function TipTapEditor({ value, onChange, placeholder, minHeight = '200px', disabled = false }: Props) {
    const [linkPopoverVisible, setLinkPopoverVisible] = React.useState(false);
    const [showImageInput, setShowImageInput] = React.useState(false);
    const [linkUrl, setLinkUrl] = React.useState('');
    const linkButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const linkPopoverRef = React.useRef<HTMLDivElement | null>(null);
    const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>({});
    const linkInputRef = React.useRef<HTMLInputElement | null>(null);
    const imageInputRef = React.useRef<HTMLInputElement | null>(null);
    const [isUploadingImage, setIsUploadingImage] = React.useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // Disable StarterKit's list-related nodes and register explicit list extensions below.
            StarterKit.configure({
                orderedList: false,
                bulletList: false,
                listItem: false,
            }),
            // ListItem must come before the list node types
            ListItem,
            BulletList,
            OrderedList,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontSize,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Subscript,
            Superscript,
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-md max-w-full h-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                },
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                // ensure ProseMirror editable div has the expected classes and inline styles
                class: 'tiptap ProseMirror tiptap-editor-content',
                style: `outline: none; box-shadow: none; min-height: ${minHeight};`,
                tabIndex: '0',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
    });

    const openLinkPopover = React.useCallback((presetHref?: string) => {
        const btn = linkButtonRef.current;
        if (!btn) {
            // fallback: toggle
            setLinkPopoverVisible((v) => !v);
            return;
        }

        const rect = btn.getBoundingClientRect();
        setPopoverStyle({
            position: 'absolute',
            left: 60,
            top: rect.bottom + window.scrollY + 8,
            zIndex: 60,
            minWidth: 280,
        });

        // Prefill with provided href (when clicking existing link)
        if (presetHref !== undefined) {
            setLinkUrl(presetHref || '');
        } else {
            // Otherwise try to read current selection's link
            try {
                const href = editor?.getAttributes('link')?.href;
                setLinkUrl(href || '');
            } catch (e) {
                // ignore
            }
        }

        setLinkPopoverVisible(true);

        // focus input on next tick
        setTimeout(() => linkInputRef.current?.focus(), 0);
    }, [editor]);

    const closeLinkPopover = React.useCallback(() => {
        setLinkPopoverVisible(false);
    }, []);

    // close on outside click or Escape
    React.useEffect(() => {
        if (!linkPopoverVisible) return;

        const onDocDown = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (
                linkPopoverRef.current &&
                !linkPopoverRef.current.contains(target) &&
                linkButtonRef.current &&
                !linkButtonRef.current.contains(target)
            ) {
                closeLinkPopover();
            }
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLinkPopover();
        };

        document.addEventListener('mousedown', onDocDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [linkPopoverVisible, closeLinkPopover]);
    const [imageUrl, setImageUrl] = React.useState('');
    const [fontSize, setFontSize] = React.useState('16');
    const [textColor, setTextColor] = React.useState('#000000');
    const [bgColor, setBgColor] = React.useState('#ffff00');
    const textColorRef = React.useRef<HTMLInputElement | null>(null);
    const bgColorRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    // Update fontSize state when selection changes
    React.useEffect(() => {
        if (!editor) return;

        const getCurrentFontSize = () => {
            const currentSize = editor.getAttributes('textStyle').fontSize;
            return currentSize ? parseInt(currentSize) : 16;
        };

        const updateFontSize = () => {
            const current = getCurrentFontSize();
            setFontSize(String(current));
        };

        editor.on('selectionUpdate', updateFontSize);
        editor.on('update', updateFontSize);

        const updateColors = () => {
            try {
                const tc = editor.getAttributes('textStyle')?.color;
                const hc = editor.getAttributes('highlight')?.color;
                if (tc) setTextColor(tc);
                if (hc) setBgColor(hc);
            } catch (e) {
                // ignore
            }
        };

        editor.on('selectionUpdate', updateColors);
        editor.on('update', updateColors);

        return () => {
            editor.off('selectionUpdate', updateFontSize);
            editor.off('update', updateFontSize);
            editor.off('selectionUpdate', updateColors);
            editor.off('update', updateColors);
        };
    }, [editor]);

    // Open popover when clicking on a linked text inside the editor
    React.useEffect(() => {
        if (!editor) return;

        const viewDom = editor.view?.dom as HTMLElement | undefined;
        if (!viewDom) return;

        const onAnyClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const a = target.closest('a');
            if (a && viewDom.contains(a)) {
                // Prevent navigation for left/middle/ctrl/meta clicks.
                try {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                } catch (err) {
                    /* ignore */
                }

                const href = a.getAttribute('href') || '';
                openLinkPopover(href);
            }
        };

        // Listen in capture phase for click, auxclick (middle button), and mousedown
        viewDom.addEventListener('click', onAnyClick, true);
        viewDom.addEventListener('auxclick', onAnyClick, true);
        viewDom.addEventListener('mousedown', onAnyClick, true);
        return () => {
            viewDom.removeEventListener('click', onAnyClick, true);
            viewDom.removeEventListener('auxclick', onAnyClick, true);
            viewDom.removeEventListener('mousedown', onAnyClick, true);
        };
    }, [editor, openLinkPopover]);

    if (!editor) {
        return null;
    }

    const getCurrentFontSize = () => {
        const currentSize = editor.getAttributes('textStyle').fontSize;
        return currentSize ? parseInt(currentSize) : 16;
    };

    const increaseFontSize = () => {
        const current = getCurrentFontSize();
        const newSize = Math.min(current + 1, 72);
        editor.chain().focus().setFontSize(`${newSize}px`).run();
        setFontSize(String(newSize));
    };

    const decreaseFontSize = () => {
        const current = getCurrentFontSize();
        const newSize = Math.max(current - 1, 8);
        editor.chain().focus().setFontSize(`${newSize}px`).run();
        setFontSize(String(newSize));
    };

    const handleFontSizeChange = (value: string) => {
        // Allow user to type freely (including empty or partial values)
        setFontSize(value);

        // Only apply to editor if it's a valid number
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 8 && numValue <= 72) {
            editor.chain().focus().setFontSize(`${numValue}px`).run();
        }
    };

    const handleSetLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setLinkPopoverVisible(false);
        }
    };


    return (
        <div className="border rounded-md overflow-hidden bg-white transition">
            <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-100 items-center">
                {/* Font Size Controls - Image UI Style */}
                <div className="flex items-center bg-white border rounded-md overflow-hidden">
                    <button
                        type="button"
                        onClick={decreaseFontSize}
                        title="Decrease Font Size"
                        className="min-w-7 h-7 px-2 bg-gray-100 text-lg font-bold"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        min="8"
                        max="72"
                        className="w-10 h-6 text-center text-sm outline-none bg-white"
                        title="Font Size"
                    />
                    <button
                        type="button"
                        onClick={increaseFontSize}
                        title="Increase Font Size"
                        className="min-w-7 h-7 px-2 bg-gray-100 text-lg font-bold"
                    >
                        +
                    </button>
                </div>

                {/* Bold, Italic, Underline, Strike */}
                <div className="flex gap-2 px-1 border-r border-gray-300">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`${editor.isActive('bold') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`${editor.isActive('italic') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`${editor.isActive('underline') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Underline"
                    >
                        <u>U</u>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`${editor.isActive('strike') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Strikethrough"
                    >
                        <s>S</s>
                    </button>
                </div>

                {/* Color and Background */}
                <div className="flex gap-2 px-1 border-r border-gray-300">
                    {/* Text color: button opens hidden color input */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => textColorRef.current?.click()}
                            title="Text Color"
                            className="min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition border"
                        >
                            {/* Simple A icon with underline */}
                            <span className="font-bold text-sm" style={{ textDecoration: 'underline' }}>
                                A
                            </span>
                            <span
                                aria-hidden
                                className="ml-1 w-3 h-3 rounded-sm border"
                                style={{ backgroundColor: textColor }}
                            />
                        </button>
                        <input
                            ref={textColorRef}
                            type="color"
                            value={textColor}
                            onChange={(e) => {
                                const v = (e.target as HTMLInputElement).value;
                                setTextColor(v);
                                editor?.chain().focus().setColor(v).run();
                            }}
                            className="opacity-0 absolute left-0 top-0 w-0 h-0"
                        />
                    </div>

                    {/* Background color (highlight): button opens hidden color input */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => bgColorRef.current?.click()}
                            title="Background Color"
                            className="min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition border"
                        >
                            {/* simple striped square icon approximation */}
                            <svg width="14" height="14" viewBox="0 0 14 14" className="block">
                                <rect x="0" y="0" width="14" height="14" fill={bgColor} stroke="rgba(0,0,0,0.15)" />
                                <path d="M0 11 L11 0 M-1 12 L12 -1" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                            </svg>
                            <span
                                aria-hidden
                                className="ml-1 w-3 h-3 rounded-sm border"
                                style={{ backgroundColor: bgColor }}
                            />
                        </button>
                        <input
                            ref={bgColorRef}
                            type="color"
                            value={bgColor}
                            onChange={(e) => {
                                const v = (e.target as HTMLInputElement).value;
                                setBgColor(v);
                                editor?.chain().focus().toggleHighlight({ color: v }).run();
                            }}
                            className="opacity-0 absolute left-0 top-0 w-0 h-0"
                        />
                    </div>
                </div>

                {/* Subscript and Superscript */}
                <div className="flex gap-2 px-1 border-r border-gray-300">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={`${editor.isActive('subscript') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Subscript"
                    >
                        X<sub>2</sub>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={`${editor.isActive('superscript') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Superscript"
                    >
                        X<sup>2</sup>
                    </button>
                </div>

                {/* Lists and Indentation */}
                <div className="flex gap-2 px-1 border-r border-gray-300">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`${editor.isActive('orderedList') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Ordered List"
                    >
                        1.
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`${editor.isActive('bulletList') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Bullet List"
                    >
                        •
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex gap-2 px-1 border-r border-gray-300">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Align Left"
                    >
                        ⫷
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Align Center"
                    >
                        ≡
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Align Right"
                    >
                        ⫸
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={`${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                        title="Justify"
                    >
                        ≣
                    </button>
                </div>

                {/* Link, Image */}
                <div className="flex gap-2 px-1">
                    <button
                        ref={linkButtonRef}
                        type="button"
                        onClick={() => openLinkPopover()}
                        title="Insert Link"
                        className={`${editor.isActive('link') ? 'bg-gray-300 border-gray-400' : ''} min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition`}
                    >
                        🔗
                    </button>
                </div>

                {/* Clear Formatting */}
                <div className="flex gap-2 px-1">
                    <button
                        type="button"
                        onClick={() => {
                            // Remove all marks (bold, italic, underline, etc.)
                            editor.chain().focus().unsetAllMarks().run();

                            // If selection is inside a list, toggle the list off.
                            // This will remove ordered/bullet list wrapping.
                            try {
                                if (editor.isActive('bulletList')) {
                                    editor.chain().focus().toggleBulletList().run();
                                }
                                if (editor.isActive('orderedList')) {
                                    editor.chain().focus().toggleOrderedList().run();
                                }
                            } catch (e) {
                                // ignore if commands unavailable
                            }

                            // Remove font size
                            editor.commands.unsetFontSize();
                            // Convert to paragraph (removes headings, blockquotes, etc.)
                            editor.chain().focus().setParagraph().run();
                            // Remove text alignment
                            editor.chain().focus().unsetTextAlign().run();
                        }}
                        title="Clear Formatting"
                        className="min-w-7 h-7 px-2 rounded-sm hover:bg-gray-200 flex items-center justify-center transition"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Link Popover (anchored to link button) */}
            {linkPopoverVisible && (
                <div
                    ref={linkPopoverRef}
                    role="dialog"
                    aria-modal="false"
                    className="rounded-md bg-white shadow-md border p-3 text-sm"
                    style={popoverStyle}
                >
                    <div className="flex items-center gap-2">
                        <input
                            ref={linkInputRef}
                            type="text"
                            placeholder="Enter URL (e.g., https://example.com)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSetLink();
                                } else if (e.key === 'Escape') {
                                    closeLinkPopover();
                                }
                            }}
                            className="flex-1 px-3 py-2 border rounded-sm text-sm outline-none"
                        />
                        <button type="button" onClick={handleSetLink} className="px-3 py-1 bg-blue-600 text-white rounded-sm text-sm">
                            Add
                        </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().unsetLink().run();
                                    setLinkUrl('');
                                    closeLinkPopover();
                                }}
                                className="px-3 py-1 bg-gray-100 rounded-sm text-sm"
                            >
                                Remove
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // close without changing
                                    closeLinkPopover();
                                }}
                                className="px-2 py-1 border rounded-sm text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div>
                            {linkUrl && (
                                <a href={linkUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                                    Open
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* <div className='p-3 text-sm leading-relaxed text-gray-800 w-full prose:max-w-full' dangerouslySetInnerHTML={{ __html: value || '' }}></div> */}
            <EditorContent
                editor={editor}
                disabled={disabled}
                placeholder={placeholder || 'Write here...'}
                className="p-3 text-sm leading-relaxed text-gray-800 w-full prose:max-w-full"
            />
        </div>
    );
}
