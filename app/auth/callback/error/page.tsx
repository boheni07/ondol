import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { Button } from "@/components/ui/Button";
import { AUTH_COPY } from "@/lib/validation/auth";

/**
 * A-08 콜백 오류 상태 — 토큰 만료/무효 분기 (designer A-08).
 * reason=reset → A-07 재요청, 그 외 → A-05 재발송 경로 안내.
 */
export default function CallbackErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const isReset = searchParams.reason === "reset";
  return (
    <AuthCard title="링크를 확인할 수 없어요">
      <InlineAlert
        tone="error"
        action={
          isReset ? (
            <Link href="/reset-password">
              <Button variant="secondary">재설정 다시 요청</Button>
            </Link>
          ) : (
            <Link href="/signup/verify">
              <Button variant="secondary">인증 메일 다시 받기</Button>
            </Link>
          )
        }
      >
        {AUTH_COPY.linkExpired}
      </InlineAlert>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-primary-500 hover:underline">
          로그인으로
        </Link>
      </div>
    </AuthCard>
  );
}
