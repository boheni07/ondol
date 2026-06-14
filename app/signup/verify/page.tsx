import { AuthCard } from "@/components/ui/AuthCard";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { VerifyWaiting } from "@/components/auth/VerifyWaiting";
import { createClient } from "@/lib/supabase/server";

/**
 * A-05 이메일 인증 대기 (Step 3/3).
 * email 은 가입 직후 쿼리로, 직접 진입(미인증 가드 리다이렉트) 시엔 세션에서 보강.
 */
export default async function SignupVerifyPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  let email = searchParams.email ?? "";
  if (!email) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? "";
  }

  return (
    <AuthCard
      title="이메일을 확인해 주세요"
      step={<StepIndicator current={3} />}
    >
      <VerifyWaiting email={email} />
    </AuthCard>
  );
}
