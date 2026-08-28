"use client";

import { useState } from "react";
import { StarIcon } from "./icons";

export function StarRatingDisplay({
  value,
  count,
  size = "md",
  showCount = true,
}: {
  value: number | null;
  count: number;
  size?: "sm" | "md";
  showCount?: boolean;
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  const rounded = value ? Math.round(value) : 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            filled={i <= rounded}
            className={`${starSize} ${i <= rounded ? "text-[var(--brand-gold)]" : "text-neutral-300"}`}
          />
        ))}
      </div>
      {value ? (
        <span className="text-sm font-semibold text-neutral-700">
          {value.toFixed(1)}
          {showCount && <span className="font-normal text-neutral-400"> ({count})</span>}
        </span>
      ) : (
        showCount && <span className="text-sm text-neutral-400">No reviews yet</span>
      )}
    </div>
  );
}

export function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${i} star${i === 1 ? "" : "s"}`}
          className="p-0.5"
        >
          <StarIcon
            filled={i <= (hover || value)}
            className={`h-7 w-7 transition-colors ${i <= (hover || value) ? "text-[var(--brand-gold)]" : "text-neutral-300"}`}
          />
        </button>
      ))}
    </div>
  );
}
