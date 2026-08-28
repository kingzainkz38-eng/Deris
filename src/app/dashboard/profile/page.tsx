"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProfileForm from "@/components/ProfileForm";
import PortfolioManager from "@/components/PortfolioManager";

export default function ProfileDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Edit profile</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Update your photo and details, and showcase work you&apos;ve completed.
      </p>

      <div className="mt-6">
        <ProfileForm />
      </div>

      <h2 className="mt-10 text-xl font-bold text-neutral-900">Previous work</h2>
      <p className="mt-1 text-sm text-neutral-500">Shown on your public profile so clients can see what you&apos;ve done.</p>
      <div className="mt-4">
        <PortfolioManager />
      </div>
    </div>
  );
}
