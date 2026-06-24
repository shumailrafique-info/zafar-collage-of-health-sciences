"use client";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useState } from "react";

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50/60 px-3 py-2.5 text-sm text-red-700"
    >
      <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} className="pr-10" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-md text-ink-400 hover:text-ink-800 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
