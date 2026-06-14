import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roleHomePath } from "@/lib/auth/routing";

/**
 * 인증 콜백 핸들러 (A-08, FR-07·FR-15).
 *
 * 이메일 인증 링크 / 비밀번호 재설정 링크 진입을 처리한다.
 * Supabase 가 PKCE `code` 를 쿼리로 붙여 보내면, 이를 세션으로 교환한다.
 *
 * - next=reset  : 재설정 링크 → 세션 교환 후 /reset-password (설정 모드)로.
 * - 그 외(가입) : 이메일 인증 완료 → 역할별 홈으로 (AC-02).
 * - 실패        : /auth/callback/error 상태 화면(클라이언트)로 분기.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const errorParam = searchParams.get("error_description") ?? searchParams.get("error");

  // 링크 토큰 자체가 만료/무효로 도착한 경우 (Supabase 가 error 쿼리로 전달)
  if (errorParam || !code) {
    return NextResponse.redirect(
      `${origin}/auth/callback/error?reason=${encodeURIComponent(next ?? "verify")}`,
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/auth/callback/error?reason=${encodeURIComponent(next ?? "verify")}`,
    );
  }

  // 비밀번호 재설정 흐름 → 설정 모드로
  if (next === "reset") {
    return NextResponse.redirect(`${origin}/reset-password?mode=update`);
  }

  // 이메일 인증 완료 → 역할별 홈 (AC-02)
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  return NextResponse.redirect(`${origin}${roleHomePath(profile?.role)}`);
}
