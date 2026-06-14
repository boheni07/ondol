"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resendVerificationAction } from "@/app/auth/actions";
import { roleHomePath } from "@/lib/auth/routing";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { clearDraft } from "./signupDraft";

const COOLDOWN_SECONDS = 60;

/**
 * A-05 이메일 인증 대기 (Step 3/3) — 게이트.
 * - 재발송 버튼(쿨다운) + onAuthStateChange 로 같은 탭 인증 완료 감지 → 역할 홈 전환.
 */
export function VerifyWaiting({ email }: { email: string }) {
  const router = useRouter();
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // 인증 완료 감지: 같은 브라우저에서 링크 클릭 시 SIGNED_IN / USER_UPDATED 이벤트 (designer A-05)
  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email_confirmed_at) {
        clearDraft();
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();
        router.replace(roleHomePath(data?.role));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const resend = useCallback(async () => {
    setResending(true);
    setResendError(null);
    const res = await resendVerificationAction(email);
    setResending(false);
    if (!res.ok) {
      setResendError(res.formError ?? "다시 시도해 주세요.");
      return;
    }
    setCooldown(COOLDOWN_SECONDS);
  }, [email]);

  return (
    <div className="text-center">
      <div aria-hidden="true" className="mb-4 text-5xl">
        ✉️
      </div>
      <p className="mb-1 text-neutral-700">
        <span className="font-medium">{email}</span> 주소로 인증 링크를 보냈어요.
      </p>
      <p className="mb-6 text-sm text-neutral-500">
        메일의 버튼을 눌러 가입을 완료해 주세요. 메일이 보이지 않으면 스팸함도
        확인해 주세요.
      </p>

      {resendError && (
        <InlineAlert tone="warning">{resendError}</InlineAlert>
      )}

      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          loading={resending}
          disabled={cooldown > 0}
          onClick={resend}
        >
          {cooldown > 0
            ? `다시 보내기 (${cooldown}초)`
            : "인증 메일 다시 보내기"}
        </Button>
        {cooldown > 0 && (
          <span className="sr-only" aria-live="polite">
            {cooldown}초 후 다시 보낼 수 있어요.
          </span>
        )}
        <Button variant="ghost" onClick={() => router.push("/login")}>
          로그인으로
        </Button>
      </div>
    </div>
  );
}
