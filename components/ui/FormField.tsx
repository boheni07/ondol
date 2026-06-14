"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";

/**
 * FormField — DS §8-2 (Label-lg / Input / HelpText / ErrorMessage).
 * 라벨-입력 for/id 연결, 오류 aria-describedby·aria-invalid (docs/14 §3-3·§4).
 */
type FieldProps = {
  label: string;
  error?: string;
  help?: string;
  // 계정 열거 방지: 특정 필드를 빨갛게 비난하지 않을 때 aria-invalid 억제 (designer A-01)
  suppressInvalid?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const FormField = forwardRef<HTMLInputElement, FieldProps>(
  function FormField({ label, error, help, suppressInvalid, id, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const errId = `${fieldId}-err`;
    const helpId = `${fieldId}-help`;
    const describedBy =
      [error ? errId : null, help ? helpId : null].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error && !suppressInvalid ? true : undefined}
          aria-describedby={describedBy}
          className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 ${
            error && !suppressInvalid
              ? "border-2 border-error-border"
              : "border border-neutral-300"
          }`}
          {...rest}
        />
        {help && !error && (
          <p id={helpId} className="mt-1.5 text-xs text-neutral-500">
            {help}
          </p>
        )}
        {error && (
          <p id={errId} className="mt-1.5 text-xs font-medium text-error-text">
            {error}
          </p>
        )}
      </div>
    );
  },
);

/**
 * PasswordInput — DS 확장(designer §9): TextInput + 눈 아이콘 토글 + 정책 힌트.
 * 눈 아이콘 aria-label·aria-pressed (docs/14 §1-3).
 */
export const PasswordInput = forwardRef<HTMLInputElement, FieldProps>(
  function PasswordInput({ label, error, help, id, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const errId = `${fieldId}-err`;
    const helpId = `${fieldId}-help`;
    const [visible, setVisible] = useState(false);
    const describedBy =
      [error ? errId : null, help ? helpId : null].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type={visible ? "text" : "password"}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 pr-12 text-neutral-900 placeholder:text-neutral-400 ${
              error
                ? "border-2 border-error-border"
                : "border border-neutral-300"
            }`}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
            aria-pressed={visible}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
          >
            {visible ? "🙈" : "👁"}
          </button>
        </div>
        {help && !error && (
          <p id={helpId} className="mt-1.5 text-xs text-neutral-500">
            {help}
          </p>
        )}
        {error && (
          <p id={errId} className="mt-1.5 text-xs font-medium text-error-text">
            {error}
          </p>
        )}
      </div>
    );
  },
);
