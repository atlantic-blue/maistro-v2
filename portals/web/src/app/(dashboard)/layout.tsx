"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@maistro/ui";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="font-bold text-xl">
                Maistro
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Projects
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm">
                    Settings
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              )}
              <Link href="/dashboard/new">
                <Button size="sm">New Project</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
