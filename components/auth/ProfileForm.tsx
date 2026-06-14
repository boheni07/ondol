"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupAction, type ActionResult } from "@/app/auth/actions";
import {
  signupSchema,
  type SignupInput,
  PROFESSIONAL_ROLES,
  ROLE_LABELS,
  type UserRole,
} from "@/lib/validation/auth";
import { FormField, PasswordInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { readDraft } from "./signupDraft";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="flex-1">
      다음
    </Button>
  );
}

const PW_HELP = "최소 8자, 영문과 숫자를 포함해 주세요.";

/**
 * A-04 기본 정보 (Step 2/3). draft 의 role 을 이어받아 hidden 으로 제출.
 * 중복 이메일은 info 톤 표준 메시지(계정 열거 방지, FR-09).
 */
export function ProfileForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const [state, formAction] = useFormState<ActionResult | undefined, FormData>(
    signupAction,
    undefined,
  );

  useEffect(() => {
    const d = readDraft();
    setRole(d.role);
    setDraftLoaded(true);
  }, []);

  const {
    register,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      phone: "",
      organization: "",
      organizationType: "",
    },
  });

  // draft 유실(새로고침 등) → 처음부터 다시 (designer A-03 상태)
  if (draftLoaded && !role) {
    return (
      <InlineAlert
        tone="info"
        action={
          <Button variant="ghost" onClick={() => router.replace("/signup")}>
            처음부터 다시 시작
          </Button>
        }
      >
        가입 정보가 초기화되었어요. 역할 선택부터 다시 진행해 주세요.
      </InlineAlert>
    );
  }

  const showOrgFields = role ? PROFESSIONAL_ROLES.includes(role) : false;
  const serverFieldErrors =
    state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const infoError = state && !state.ok ? state.infoError : undefined;
  const formError = state && !state.ok ? state.formError : undefined;

  return (
    <form action={formAction} noValidate>
      {role && (
        <p className="mb-4 text-sm text-neutral-500">
          선택한 역할:{" "}
          <span className="font-medium text-neutral-700">
            {ROLE_LABELS[role]}
          </span>
        </p>
      )}
      <input type="hidden" name="role" value={role ?? ""} />

      {infoError && (
        <InlineAlert
          tone="info"
          action={
            <>
              <Link href="/login">
                <Button variant="secondary">로그인</Button>
              </Link>
              <Link href="/reset-password">
                <Button variant="ghost">비밀번호 재설정</Button>
              </Link>
            </>
          }
        >
          {infoError}
        </InlineAlert>
      )}

      {formError && <InlineAlert tone="error">{formError}</InlineAlert>}

      <FormField
        label="이메일"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@example.com"
        error={errors.email?.message ?? serverFieldErrors.email}
        {...register("email")}
      />
      <PasswordInput
        label="비밀번호"
        autoComplete="new-password"
        help={PW_HELP}
        error={errors.password?.message ?? serverFieldErrors.password}
        {...register("password")}
      />
      <PasswordInput
        label="비밀번호 확인"
        autoComplete="new-password"
        error={errors.passwordConfirm?.message ?? serverFieldErrors.passwordConfirm}
        {...register("passwordConfirm")}
      />
      <FormField
        label="이름"
        autoComplete="name"
        error={errors.name?.message ?? serverFieldErrors.name}
        {...register("name")}
      />

      {showOrgFields && (
        <fieldset className="mb-4 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-xs text-neutral-500">선택 입력</legend>
          <FormField
            label="연락처"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FormField
            label="소속 기관"
            error={errors.organization?.message}
            {...register("organization")}
          />
          <FormField
            label="기관 유형"
            placeholder="예: special_school"
            error={errors.organizationType?.message}
            {...register("organizationType")}
          />
        </fieldset>
      )}

      <div className="mt-6 flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/signup")}
        >
          이전
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
