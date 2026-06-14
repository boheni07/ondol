import { AuthCard } from "@/components/ui/AuthCard";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { RoleSelect } from "@/components/auth/RoleSelect";

// A-03 회원가입 · 역할 선택 (Step 1/3)
export default function SignupRolePage() {
  return (
    <AuthCard title="어떤 역할로 시작할까요?" step={<StepIndicator current={1} />}>
      <RoleSelect />
    </AuthCard>
  );
}
