"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.push("/auth/signin"); return; }
    if (session.user.role === "RESTAURANT") router.push("/restaurant");
    else if (session.user.role === "CHARITY") router.push("/charity");
    else router.push("/browse");
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
        <p style={{ color: "var(--color-text-secondary)" }}>Loading your dashboard...</p>
      </div>
    </div>
  );
}
