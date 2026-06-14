"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/app/auth/actions";
import { loginSchema, type LoginInput, AUTH_COPY } from "@/lib/validation/auth";
import { FormField, PasswordInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/InlineAlert";

function SubmitButton() {
  // useFormStatus 로 Server Action 진행 상태를 읽어 버튼 Loading (designer A-01 로딩 상태)
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth loading={pending}>
      로그인
    </Button>
  );
}

/**
 * A-01 로그인 폼.
 * - 클라이언트 1차 검증(RHF+Zod, FR-04) + 서버 Server Action 재검증.
 * - 실패 시 단일 표준 메시지(FR-13/NFR-S2), 두 필드 모두 aria-invalid 미설정.
 */
export function LoginForm({ redirect }: { redirect?: string }) {
  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    loginAction,
    undefined,
  );

  const {
    register,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const serverFormError =
    state && !state.ok ? state.formError : undefined;

  return (
    <form action={formAction} noValidate>
      {redirect && (
        <InlineAlert tone="info">
          로그인하면 이전 화면으로 돌아갑니다.
        </InlineAlert>
      )}

      {serverFormError && (
        <InlineAlert tone="error">{serverFormError}</InlineAlert>
      )}

      <input type="hidden" name="redirect" value={redirect ?? ""} />

      <FormField
        label="이메일"
        type="email"
        inputMode="email"
        autoComplete="username"
        placeholder="name@example.com"
        error={errors.email?.message}
        suppressInvalid={!!serverFormError}
        {...register("email")}
      />

      <PasswordInput
        label="비밀번호"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="mb-5 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            className="h-[18px] w-[18px] accent-primary-500"
            {...register("rememberMe")}
          />
          로그인 상태 유지
        </label>
        <Link
          href="/reset-password"
          className="text-sm text-primary-500 hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      <SubmitButton />

      <div className="mt-6 border-t border-neutral-200 pt-5 text-center text-sm text-neutral-600">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-primary-500 hover:underline">
          회원가입
        </Link>
      </div>

      {/* aria-live 영역 보강: 메시지 자체는 InlineAlert(assertive)가 통지 */}
      <span className="sr-only" aria-live="assertive">
        {serverFormError === AUTH_COPY.invalidCredentials ? serverFormError : ""}
      </span>
    </form>
  );
}
