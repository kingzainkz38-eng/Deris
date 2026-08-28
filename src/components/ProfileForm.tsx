"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "@/lib/auth-context";

export default function ProfileForm() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", city: "", bio: "" });
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seed the editable form from the loaded user on mount/change
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      city: user.city || "",
      bio: user.bio || "",
    });
    setAvatarKey(user.avatar_key || null);
  }, [user]);

  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setAvatarKey(data.key);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, avatarKey }),
      });
      await refresh();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-4">
        {avatarKey ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarKey} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-green)] text-2xl font-bold text-white">
            {form.name.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <label className="cursor-pointer rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
          {uploading ? "Uploading…" : "Change photo"}
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">Full name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-neutral-300 px-3 py-2.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">Phone number</span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-xl border border-neutral-300 px-3 py-2.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">City</span>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="rounded-xl border border-neutral-300 px-3 py-2.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">Bio</span>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            placeholder="Tell clients about your experience and what you offer."
            className="rounded-xl border border-neutral-300 px-3 py-2.5"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="rounded-xl bg-[var(--brand-green)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm font-medium text-[var(--brand-green-dark)]">Saved.</span>}
      </div>
    </div>
  );
}
