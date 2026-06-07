"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const MESSAGES = [
  "🎉 Free shipping on orders over $50 — limited time only",
  "⚡ Flash sale live now — up to 30% off selected items",
  "🛍️ New arrivals just dropped — shop the latest collection",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative flex items-center justify-center bg-primary px-12 py-2.5 text-center text-sm font-medium text-primary-foreground">
      <button
        aria-label="Previous announcement"
        onClick={() => setIndex((i) => (i - 1 + MESSAGES.length) % MESSAGES.length)}
        className="absolute left-3 p-1 opacity-60 transition-opacity hover:opacity-100"
      >
        <ChevronLeft className="size-4" />
      </button>

      <p key={index} className="animate-in fade-in duration-500">
        {MESSAGES[index]}
      </p>

      <button
        aria-label="Next announcement"
        onClick={() => setIndex((i) => (i + 1) % MESSAGES.length)}
        className="absolute right-10 p-1 opacity-60 transition-opacity hover:opacity-100"
      >
        <ChevronRight className="size-4" />
      </button>

      <button
        aria-label="Dismiss announcement"
        onClick={() => setDismissed(true)}
        className="absolute right-3 p-1 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
