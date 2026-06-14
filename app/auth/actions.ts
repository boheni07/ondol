"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import {
  loginSchema,
  signupSchema,
  resetRequestSchema,
  resetUpdateSchema,
  AUTH_COPY,
  type UserRole,
} from "@/lib/validation/auth";
import { roleHomePath, safeRedirect } from "@/lib/auth/routing";

/**
 * 인증 Server Actions (FR-05·06·09·11·13·15·16).
 * 모든 액션은 서버 측에서 Zod 재검증한다(FR-04). 클라이언트 폼은 동일 스키마로 1차 검증.
 *
 * 반환 규약: 실패 시 { ok:false, formError?, fieldErrors? } 를 반환해 폼이 표시한다.
 * 성공 시 redirect() 로 흐름을 넘긴다(예외를 던지므로 이후 코드는 실행되지 않음).
 */

export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      formError?: string;
      // 계정 열거 방지용 info 톤 메시지(에러 아님) — designer A-04 중복 이메일
      infoError?: string;
      fieldErrors?: Record<string, string>;
    };

function zodFieldErrors(
  error: import("zod").ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

// ── 회원가입 (FR-05·06·07·09, AC-01·AC-06) ─────────────────────────────
export async function signupAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    role: formData.get("role"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    organization: formData.get("organization") ?? "",
    organizationType: formData.get("organizationType") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { role, email, password, name, phone, organization, organizationType } =
    parsed.data;

  const supabase = createClient();

  // 가정 A-2 확정: 가입 폼 데이터(role/name/phone/org)는 signUp options.data 로
  // raw_user_meta_data 에 실어 보낸다. public.users 행 생성은 DB 트리거
  // (auth.users AFTER INSERT → public.users)가 메타데이터를 읽어 수행한다.
  // → 행 생성 무결성(users.id = auth.uid())을 DB 레벨에서 보장(NFR-S5).
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=onboarding`,
      data: {
        role,
        name,
        phone: phone || null,
        organization: organization || null,
        organization_type: organizationType || null,
      },
    },
  });

  if (error) {
    // 계정 열거 방지(FR-09/NFR-S2): 중복 이메일 등 모든 가입 실패를 표준 info 메시지로.
    return { ok: false, infoError: AUTH_COPY.duplicateSignup };
  }

  // Supabase 가 기존 가입 이메일에 대해 obfuscated user 를 반환하는 경우(이메일 확인 활성 시)
  // identities 가 빈 배열 → 이미 가입된 이메일. 존재 비노출 표준 메시지로 처리.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ok: false, infoError: AUTH_COPY.duplicateSignup };
  }

  // 가입 성공 → 인증 대기 화면으로 (AC-01). 이메일은 쿼리로 전달해 A-05 가 표시.
  redirect(`/signup/verify?email=${encodeURIComponent(email)}`);
}

// ── 로그인 (FR-11·12·13·14, AC-04·AC-05·AC-12) ─────────────────────────
export async function loginAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { email, password } = parsed.data;
  const redirectTo = safeRedirect(formData.get("redirect") as string | null);

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // 계정 열거 방지(FR-13/NFR-S2): 이메일/비번 구분 없는 단일 실패 메시지.
    return { ok: false, formError: AUTH_COPY.invalidCredentials };
  }

  // 이메일 미인증 → 인증 대기 게이트 (FR-08). middleware 도 보호하지만 여기서 즉시 안내.
  if (!data.user.email_confirmed_at) {
    redirect(`/signup/verify?email=${encodeURIComponent(email)}`);
  }

  // is_active=false 게이트 (FR-14/AC-12): public.users 조회.
  const role = await resolveActiveRole(supabase, data.user.id);
  if (role === "INACTIVE") {
    await supabase.auth.signOut();
    return { ok: false, formError: AUTH_COPY.inactiveAccount };
  }

  redirect(redirectTo ?? roleHomePath(role));
}

// ── 로그아웃 (FR-16, AC-08) ────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ── 인증 메일 재발송 (FR-08, A-05) ─────────────────────────────────────
export async function resendVerificationAction(
  email: string,
): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, formError: "이메일 형식을 확인해 주세요." };
  }
  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: `${env.siteUrl}/auth/callback?next=onboarding` },
  });
  // 발송 빈도 제한 등은 Supabase rate limit → 화면 쿨다운으로 흡수. 실패도 존재 비노출.
  if (error) return { ok: false, formError: AUTH_COPY.serverError };
  return { ok: true };
}

// ── 비밀번호 재설정 요청 (FR-15(a), AC-07) ─────────────────────────────
export async function resetRequestAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  }
  const supabase = createClient();
  // 계정 열거 방지(가정 A-3): 결과와 무관하게 항상 동일 성공 응답.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.siteUrl}/auth/callback?next=reset`,
  });
  return { ok: true };
}

// ── 비밀번호 재설정 적용 (FR-15(b), AC-07) ─────────────────────────────
// 링크로 진입해 콜백이 세션을 교환한 뒤 호출됨. 현 세션 사용자의 비밀번호를 갱신.
export async function resetUpdateAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetUpdateSchema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // 링크 만료/무효 — 세션이 없으면 갱신 불가 (NFR-S6).
    return { ok: false, formError: AUTH_COPY.linkExpired };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { ok: false, formError: AUTH_COPY.serverError };

  // 변경 후 로그인 유도 (FR-15). 기존 세션은 유지되지만 명시적으로 재로그인 흐름.
  redirect("/login?reset=done");
}

/**
 * public.users 에서 role 조회 + is_active 검사.
 * 반환: 활성이면 role 문자열, 비활성이면 "INACTIVE", 행 없으면 null(트리거 지연 등).
 */
async function resolveActiveRole(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<UserRole | "INACTIVE" | null> {
  const { data, error } = await supabase
    .from("users")
    .select("role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  if (data.is_active === false) return "INACTIVE";
  return data.role as UserRole;
}
