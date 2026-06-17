"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  charLimit?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          ref={ref}
          className={[
            "w-full h-10 bg-surface-2 border border-border rounded-xl text-sm text-foreground placeholder:text-muted/50",
            "focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all",
            icon ? "pl-9 pr-4" : "px-4",
            error && "border-danger/60 focus:border-danger/60 focus:ring-danger/20",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, charCount, charLimit, className = "", ...props }, ref) => (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <label className="text-xs font-medium text-muted">{label}</label>
          {charLimit !== undefined && charCount !== undefined && (
            <span className={`text-xs ${charCount > charLimit ? "text-danger" : "text-muted"}`}>
              {charCount}/{charLimit}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        className={[
          "w-full bg-surface-2 border border-border rounded-xl text-sm text-foreground placeholder:text-muted/50 px-4 py-3 resize-none",
          "focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all",
          error && "border-danger/60",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>}
      <select
        className={[
          "w-full h-10 bg-surface-2 border border-border rounded-xl text-sm text-foreground px-4",
          "focus:outline-none focus:border-accent/60 transition-all appearance-none cursor-pointer",
          className,
        ].join(" ")}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
