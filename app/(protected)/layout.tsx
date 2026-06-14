import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AUTH_COPY } from "@/lib/validation/auth";

/**
 * 보호 레이아웃 — 미들웨어가 인증/이메일 인증을 거른 뒤,
 * 여기서 public.users 의 is_active=false 게이트를 처리한다 (FR-14/AC-12).
 * middleware 는 DB 왕복 없이 통과시키고(NFR-P2), 활성 검사는 보호 영역 진입 시 1회.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미들웨어가 이미 막지만 방어적으로 한 번 더.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profile && profile.is_active === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-page px-4">
        <div className="w-full max-w-md rounded-xl bg-surface-card p-8 text-center shadow-elevation-1">
          <p className="mb-6 text-neutral-700">{AUTH_COPY.inactiveAccount}</p>
          <LogoutButton />
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-surface-card px-6 py-3">
        <Link href="/home" className="font-bold text-primary-500">
          OnDol
        </Link>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span>{profile?.name ?? user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto max-w-4xl p-6">{children}</div>
    </div>
  );
}
