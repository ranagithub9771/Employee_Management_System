"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/** Protected layout: redirects to /login when not authenticated. */
export default function AppShell({ title, actions, children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user)
    return (
      <div className="center-screen">
        <div className="spinner" />
      </div>
    );

  const link = (href, label) => (
    <Link href={href} className={pathname.startsWith(href) ? "active" : ""}>
      {label}
    </Link>
  );

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <strong className="brand">EMS</strong>
          {link("/dashboard", "Dashboard")}
          {link("/employees", "Employees")}
        </div>
        <div className="nav-right">
          <span className="muted">Hi, {user.name}</span>
          <button
            className="btn btn-outline"
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="container">
        <div className="page-head">
          <h1>{title}</h1>
          <div>{actions}</div>
        </div>
        {children}
      </main>
    </>
  );
}
