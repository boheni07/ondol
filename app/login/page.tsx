import { AuthCard } from "@/components/ui/AuthCard";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { LoginForm } from "@/components/auth/LoginForm";

/**
 * A-01 로그인 (/login). 세션 복원·자동 로그인은 middleware + 보호 레이아웃이 담당하므로
 * 이 페이지는 미인증 진입 시 폼을 보여준다. redirect/reset 쿼리를 폼에 전달.
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; reset?: string };
}) {
  return (
    <AuthCard title="로그인">
      {searchParams.reset === "done" && (
        <InlineAlert tone="success">
          비밀번호가 변경됐어요. 새 비밀번호로 로그인해 주세요.
        </InlineAlert>
      )}
      <LoginForm redirect={searchParams.redirect} />
    </AuthCard>
  );
}
