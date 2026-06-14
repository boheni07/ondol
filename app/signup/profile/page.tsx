import { AuthCard } from "@/components/ui/AuthCard";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ProfileForm } from "@/components/auth/ProfileForm";

// A-04 회원가입 · 기본 정보 (Step 2/3)
export default function SignupProfilePage() {
  return (
    <AuthCard
      title="기본 정보를 입력해 주세요"
      step={<StepIndicator current={2} />}
    >
      <ProfileForm />
    </AuthCard>
  );
}
