
"use client";

import type { HTMLAttributes } from 'react';
import { useState, useEffect } from 'react';

interface FormattedDateProps extends HTMLAttributes<HTMLSpanElement> {
  dateString: string | undefined | null;
  placeholder?: string;
  options?: Intl.DateTimeFormatOptions;
  locale?: string; // Optional: to force a specific locale
  as?: React.ElementType; // To render as span, div, etc.
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  dateString,
  placeholder = "...", // Keep placeholder short for inline use
  options = { year: 'numeric', month: 'numeric', day: 'numeric' }, // default to something like 1/15/2023 or 15/1/2023
  locale,
  as: Component = 'span',
  className,
  ...rest
}) => {
  const [displayText, setDisplayText] = useState<string>(placeholder);

  useEffect(() => {
    if (dateString) {
      try {
        // Ensure date is parsed in local time zone, especially for YYYY-MM-DD strings
        const dateObj = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
        if (isNaN(dateObj.getTime())) {
          setDisplayText("Invalid date");
        } else {
          setDisplayText(dateObj.toLocaleDateString(locale, options));
        }
      } catch (error) {
        console.error("Error formatting date:", error);
        setDisplayText("Invalid date");
      }
    } else {
      setDisplayText(placeholder);
    }
  }, [dateString, placeholder, options, locale]);

  return <Component className={className} {...rest}>{displayText}</Component>;
};
