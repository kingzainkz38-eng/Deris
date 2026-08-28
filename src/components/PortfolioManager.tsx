"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { ImageIcon, TrashIcon } from "./icons";
import type { PortfolioItem } from "@/lib/types";

export default function PortfolioManager() {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/portfolio?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }, [user]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setImageKey(data.key);
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), imageKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => [
          {
            id: data.id,
            user_id: user!.id,
            title: title.trim(),
            description: description.trim() || null,
            image_key: imageKey,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setTitle("");
        setDescription("");
        setImageKey(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this from your previous work?")) return;
    const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title, e.g. Kitchen renovation"
            className="rounded-xl border border-neutral-300 px-3 py-2.5 text-sm"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the work you did (optional)"
            rows={2}
            className="rounded-xl border border-neutral-300 px-3 py-2.5 text-sm"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
              <ImageIcon className="h-4 w-4" />
              {uploading ? "Uploading…" : imageKey ? "Photo added" : "Add photo"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || uploading || !title.trim()}
              className="rounded-full bg-[var(--brand-green)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add to previous work"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
              {item.image_key ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_key} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">🧰</div>
              )}
            </div>
            <div className="flex items-start justify-between gap-2 p-4">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-neutral-900">{item.title}</h3>
                {item.description && <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{item.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                aria-label="Delete"
                className="shrink-0 text-neutral-400 hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
          Nothing added yet — share a finished job to build trust with new clients.
        </p>
      )}
    </div>
  );
}
