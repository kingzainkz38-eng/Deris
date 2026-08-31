"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  role: string;
  category: string;
  tint: "green" | "gold";
  file: string;
};

const SLIDES: Slide[] = [
  { role: "Electrician", category: "Home & Repair", tint: "green", file: "electrician" },
  { role: "Plumber", category: "Home & Repair", tint: "gold", file: "plumber" },
  { role: "Painter", category: "Home & Repair", tint: "green", file: "painter" },
  { role: "Car Mechanic", category: "Automotive", tint: "gold", file: "mechanic" },
  { role: "Carpenter", category: "Construction", tint: "green", file: "carpenter" },
  { role: "Tech Support", category: "IT & Tech", tint: "gold", file: "tech-repair" },
  { role: "Tutor", category: "Education", tint: "green", file: "tutor" },
  { role: "Photographer", category: "Media", tint: "gold", file: "photographer" },
  { role: "Barber", category: "Beauty & Wellness", tint: "green", file: "barber" },
  { role: "Cleaning Pro", category: "Cleaning", tint: "gold", file: "cleaner" },
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-green-50)] to-[color-mix(in_srgb,var(--brand-gold)_16%,white)]" />

      <div className="relative h-[85%] w-[85%] overflow-hidden rounded-full shadow-xl ring-4 ring-white">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.role}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <Image
              src={`/people/${slide.file}.jpg`}
              alt={`${slide.role} at work`}
              fill
              sizes="(max-width: 640px) 240px, 320px"
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3">
              <span className="text-sm font-bold text-white">{slide.role}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  slide.tint === "green"
                    ? "bg-[var(--brand-green)] text-white"
                    : "bg-[var(--brand-gold)] text-white"
                }`}
              >
                {slide.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute -bottom-1 flex items-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.role}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${slide.role}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-[var(--brand-green)]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
