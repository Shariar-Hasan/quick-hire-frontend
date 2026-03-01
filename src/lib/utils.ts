import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
type WithJsx = {
  maxVisible?: number;
  operator?: string;
  fallbackLabel?: (value: string | number) => string;
  values: React.ReactNode[];
  separator?: React.ReactNode;
}
type WithoutJsx = {
  maxVisible?: number;
  operator?: string;
  fallbackLabel?: (value: string | number) => string;
  values: (string | number)[];
  separator?: string;
}

type FormatMultiValueOptions = WithJsx | WithoutJsx;

export function formatMultiValues({
  values,
  maxVisible = 2,
  separator = ", ",
  operator = "+",
}: FormatMultiValueOptions): string | React.ReactNode {
  if (!values || values.length === 0) {
    return "";
  }

  // Check if any values are JSX elements
  const hasJSXElements = values.some(value =>
    React.isValidElement(value) ||
    (typeof value === "object" && value !== null && typeof value !== "string" && typeof value !== "number")
  );

  if (values.length <= maxVisible) {
    if (hasJSXElements) {
      const elements: React.ReactNode[] = [];
      values.forEach((value, index) => {
        if (index > 0) {
          elements.push(separator);
        }
        elements.push(value);
      });
      return React.createElement(React.Fragment, null, ...elements);
    }
    return values.join(separator as string);
  }

  const shown = values.slice(0, maxVisible);
  const remainingCount = values.length - maxVisible;

  if (hasJSXElements) {
    const elements: React.ReactNode[] = [];
    shown.forEach((value, index) => {
      if (index > 0) {
        elements.push(separator);
      }
      elements.push(value);
    });
    elements.push(React.createElement("span", null, ` ${operator}${remainingCount} more`));
    return React.createElement(React.Fragment, null, ...elements);
  }

  const shownText = shown.join(separator as string);
  return `${shownText} ${operator}${remainingCount} more`;
}
