import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeadlineBox",
  description: "Jot down every deadline and quiz in 5 seconds so you never miss one.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
            <Link href={user ? "/app" : "/"} className="text-lg font-bold text-indigo-700">
              DeadlineBox
            </Link>
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Log in
              </Link>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
