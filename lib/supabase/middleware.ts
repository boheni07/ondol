import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * 미들웨어 세션 갱신 + 인증 가드 (FR-17·FR-18, designer §3-1).
 *
 * - 매 요청마다 access token 을 검증하고, 만료 시 refresh token 으로 자동 갱신해
 *   갱신된 쿠키를 응답에 실어 보낸다 (AC-10, 사용자에게 비가시).
 * - 보호 라우트 접근 시 미인증이면 /login?redirect=<원경로> 로 리다이렉트 (AC-09·AC-11).
 * - 이메일 미인증 사용자는 보호 라우트 대신 /signup/verify 게이트로 보낸다 (FR-08·AC-03).
 *
 * is_active=false 게이트(FR-14)는 public.users 조회가 필요하므로 미들웨어가 아닌
 * 보호 레이아웃(서버 컴포넌트)에서 처리한다 — 미들웨어는 추가 DB 왕복 없이 통과(NFR-P2).
 */

// 인증 없이 접근 가능한 경로(접두사 매칭)
const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/reset-password",
  "/auth/callback",
];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() 는 Auth 서버에 토큰을 검증시켜 신뢰 가능한 사용자 정보를 반환한다.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!isPublicPath(pathname)) {
    // 보호 라우트
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }
    // 이메일 미인증 게이트 (FR-08)
    if (!user.email_confirmed_at) {
      const url = request.nextUrl.clone();
      url.pathname = "/signup/verify";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
