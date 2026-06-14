import { AuthCard } from "@/components/ui/AuthCard";
import { ResetRequestForm } from "@/components/auth/ResetRequestForm";
import { ResetUpdateForm } from "@/components/auth/ResetUpdateForm";

/**
 * A-07 비밀번호 재설정 — 2모드 단일 라우트.
 * mode=update (콜백에서 세션 교환 후 진입) → 새 비밀번호 설정.
 * 그 외 → 이메일 요청 모드.
 */
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const isUpdate = searchParams.mode === "update";
  return (
    <AuthCard title={isUpdate ? "새 비밀번호 설정" : "비밀번호 재설정"}>
      {isUpdate ? <ResetUpdateForm /> : <ResetRequestForm />}
    </AuthCard>
  );
}
