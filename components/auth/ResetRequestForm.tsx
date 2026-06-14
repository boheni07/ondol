"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { resetRequestAction, type ActionResult } from "@/app/auth/actions";
import {
  resetRequestSchema,
  type ResetRequestInput,
  AUTH_COPY,
} from "@/lib/validation/auth";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/InlineAlert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth loading={pending}>
      재설정 링크 받기
    </Button>
  );
}

/**
 * A-07 (a) 재설정 요청 모드. 계정 열거 방지: 결과와 무관하게 항상 동일 성공 안내(가정 A-3).
 */
export function ResetRequestForm() {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    resetRequestAction,
    undefined,
  );

  const {
    register,
    formState: { errors },
  } = useForm<ResetRequestInput>({
    resolver: zodResolver(resetRequestSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  // 성공 시 폼을 안내로 치환(재제출 남용 방지, designer A-07)
  if (state?.ok) {
    return (
      <div>
        <InlineAlert tone="success">{AUTH_COPY.resetRequested}</InlineAlert>
        <Link href="/login">
          <Button variant="ghost" fullWidth>
            로그인으로
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <p className="mb-4 text-sm text-neutral-500">
        가입한 이메일로 재설정 링크를 보내드려요.
      </p>
      <FormField
        label="이메일"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@example.com"
        error={errors.email?.message ?? (state && !state.ok ? state.fieldErrors?.email : undefined)}
        {...register("email")}
      />
      <SubmitButton />
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-primary-500 hover:underline">
          로그인으로
        </Link>
      </div>
    </form>
  );
}
