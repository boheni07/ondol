"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { resetUpdateAction, type ActionResult } from "@/app/auth/actions";
import { resetUpdateSchema, type ResetUpdateInput } from "@/lib/validation/auth";
import { PasswordInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/InlineAlert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth loading={pending}>
      비밀번호 변경
    </Button>
  );
}

const PW_HELP = "최소 8자, 영문과 숫자를 포함해 주세요.";

/**
 * A-07 (b) 새 비밀번호 설정 모드. 콜백이 세션을 교환한 뒤 진입.
 * 세션이 없으면(링크 만료/무효) 서버 액션이 linkExpired 를 반환.
 */
export function ResetUpdateForm() {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    resetUpdateAction,
    undefined,
  );

  const {
    register,
    formState: { errors },
  } = useForm<ResetUpdateInput>({
    resolver: zodResolver(resetUpdateSchema),
    mode: "onBlur",
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const formError = state && !state.ok ? state.formError : undefined;

  return (
    <form action={formAction} noValidate>
      {formError && (
        <InlineAlert
          tone="error"
          action={
            <Link href="/reset-password">
              <Button variant="ghost">재설정 다시 요청</Button>
            </Link>
          }
        >
          {formError}
        </InlineAlert>
      )}
      <PasswordInput
        label="새 비밀번호"
        autoComplete="new-password"
        help={PW_HELP}
        error={errors.password?.message ?? fieldErrors?.password}
        {...register("password")}
      />
      <PasswordInput
        label="새 비밀번호 확인"
        autoComplete="new-password"
        error={errors.passwordConfirm?.message ?? fieldErrors?.passwordConfirm}
        {...register("passwordConfirm")}
      />
      <SubmitButton />
    </form>
  );
}
