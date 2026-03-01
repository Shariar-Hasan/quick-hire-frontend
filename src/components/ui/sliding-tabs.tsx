import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React, { use, useCallback, useState } from "react";

export interface SlidingTab {
    key: string;
    label: React.ReactNode;
    icon?: LucideIcon;
    disabled?: boolean;
    isVisible?: boolean;
    onClick?: (key: string) => void;
    className?: string | ((activeTab: string) => string);
}

interface SlidingTabsProps<T extends string> {
    tabs: SlidingTab[];
    activeTab: T;
    onTabChange?: (key: T) => void;
    className?: string;
    variant?: "default" | "compact";
    selectedClassName?: string;
}

export function SlidingTabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
    className,
    variant = "default",
    selectedClassName,
}: SlidingTabsProps<T>) {
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    // Filter visible tabs
    const visibleTabs = tabs.filter((tab) => tab.isVisible !== false);

    const getTabIndex = useCallback((tabKey: string) => {
        return visibleTabs.findIndex(tab => tab.key === tabKey);
    }, [visibleTabs, activeTab]);

    const handleTabClick = (tab: SlidingTab) => {
        if (tab.disabled) return;

        // Call custom onClick if provided
        if (tab.onClick) {
            tab.onClick(tab.key);
        }

        // Call the main onTabChange
        onTabChange?.(tab.key as T); ;
    };

    return (
        <div className={cn("relative flex gap-1 p-1 bg-gray-100 rounded-lg", className)}>
            {/* Sliding Active Indicator */}
            <div
                className={(cn(
                    "absolute top-1 h-9 bg-white rounded-md shadow-md transition-all duration-300",
                    variant === "compact" ? "h-8" : "h-9",
                    selectedClassName ? selectedClassName : "border border-gray-300"
                ))}
                style={{
                    left: `calc(${getTabIndex(activeTab) * (100 / visibleTabs.length)}% + 0.25rem)`,
                    width: `calc(${100 / visibleTabs.length}% - 0.5rem)`,
                }}
            />

            {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                const isDisabled = tab.disabled;

                return (
                    <button
                        key={tab.key}
                        onClick={() => handleTabClick(tab)}
                        onMouseEnter={() => !isDisabled && setHoveredTab(tab.key)}
                        onMouseLeave={() => setHoveredTab(null)}
                        disabled={isDisabled}
                        className={cn(
                            "relative z-10 flex-1 flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer",
                            typeof tab.className === "function"
                                ? tab.className(activeTab)
                                : tab.className,
                            variant === "compact" ? "px-2 py-1.5" : "px-2 py-2",
                            isActive && "text-gray-900",
                            !isActive && !isDisabled && "text-gray-600 hover:text-gray-900",
                            isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {Icon && <Icon className="w-4 h-4" />}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}


export const SlidingContent = ({ activeTab, tabs, children }: {
    activeTab: string;
    tabs: SlidingTab[];
    children: React.ReactNode[];
}) => {
    const getTabTranslate = () => {
        const index = tabs.findIndex(tab => tab.key === activeTab);
        if (index === -1 || tabs.length === 0) return 'translateX(0%)';
        return `translateX(-${index * (100 / tabs.length)}%)`;
    };
    return <div className="w-full overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
        <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
                width: `${tabs.length * 100}%`,
                transform: getTabTranslate()
            }}
        >
            {children.map((child, index) => (
                <div
                    key={index}
                    className="shrink-0"
                    style={{ width: `${100 / tabs.length}%` }}
                >
                    {child}
                </div>
            ))}
        </div>
    </div>
}