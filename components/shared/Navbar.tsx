"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Leaf, Store, ShoppingBag, Heart, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = {
  RESTAURANT: [
    { href: "/restaurant", label: "Dashboard" },
    { href: "/restaurant/menu", label: "Menu" },
    { href: "/restaurant/surplus", label: "Surplus" },
    { href: "/restaurant/history", label: "History" },
    { href: "/restaurant/impact", label: "Impact" },
  ],
  CONSUMER: [
    { href: "/browse", label: "Browse Bags" },
    { href: "/reservations", label: "My Rescues" },
  ],
  CHARITY: [
    { href: "/charity", label: "Donations Feed" },
    { href: "/charity/history", label: "History" },
  ],
};

const ROLE_ICONS = { RESTAURANT: Store, CONSUMER: ShoppingBag, CHARITY: Heart };
const ROLE_COLORS = { RESTAURANT: "#3D5A3D", CONSUMER: "#E07856", CHARITY: "#4A7C4E" };

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = session?.user.role as keyof typeof NAV_LINKS | undefined;
  const links = role ? NAV_LINKS[role] ?? [] : [];
  const RoleIcon = role ? ROLE_ICONS[role] : null;
  const roleColor = role ? ROLE_COLORS[role] : "var(--color-primary)";

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "rgba(250,247,242,0.95)", backdropFilter: "blur(8px)", borderColor: "var(--color-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={session ? "/dashboard-redirect" : "/"} className="flex items-center gap-2 flex-shrink-0">
            <Leaf size={22} style={{ color: "var(--color-accent)" }} />
            <span className="text-xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>RescuBite</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: pathname === link.href || pathname.startsWith(link.href + "/") ? roleColor : "var(--color-text-secondary)",
                  background: pathname === link.href || pathname.startsWith(link.href + "/") ? `${roleColor}12` : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {RoleIcon && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${roleColor}18` }}>
                      <RoleIcon size={14} style={{ color: roleColor }} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium leading-none" style={{ color: "var(--color-text)" }}>{session.user.name}</p>
                    <p className="text-xs capitalize" style={{ color: "var(--color-text-secondary)" }}>{role?.toLowerCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  title="Sign out"
                >
                  <LogOut size={16} style={{ color: "var(--color-text-secondary)" }} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/signin" className="btn-outline py-2 px-4 text-sm">Sign In</Link>
                <Link href="/auth/signup" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: pathname === link.href ? roleColor : "var(--color-text)" }}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-lg"
              style={{ color: "var(--color-danger)" }}
            >
              <LogOut size={14} /> Sign out
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth/signin" className="btn-outline justify-center w-full">Sign In</Link>
              <Link href="/auth/signup" className="btn-primary justify-center w-full">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
