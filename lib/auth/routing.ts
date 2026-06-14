import type { UserRole } from "@/lib/validation/auth";

/**
 * 로그인 성공 후 역할별 진입점 (FR-12, docs/06 §3).
 * guardian → /dashboard, person → /home, 전문가군 → /home.
 */
export function roleHomePath(role: UserRole | string | null | undefined): string {
  switch (role) {
    case "guardian":
      return "/dashboard";
    case "person":
    case "supporter":
    case "teacher":
    case "social_worker":
    case "therapist":
      return "/home";
    default:
      return "/home";
  }
}

/**
 * redirect 쿼리의 오픈 리다이렉트 방지: 같은 사이트 내 절대경로만 허용.
 */
export function safeRedirect(redirect: string | null | undefined): string | null {
  if (!redirect) return null;
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return null;
  return redirect;
}
