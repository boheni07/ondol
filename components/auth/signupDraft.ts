"use client";

import type { UserRole } from "@/lib/validation/auth";

/**
 * 회원가입 위자드 draft (A-03 역할 → A-04 정보 이월).
 * sessionStorage 사용: 새로고침 시 draft 유실되면 designer A-03 "처음부터" 리셋 처리.
 */
const KEY = "ondol.signup.draft";

export type SignupDraft = { role?: UserRole };

export function readDraft(): SignupDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SignupDraft) : {};
  } catch {
    return {};
  }
}

export function writeDraft(draft: SignupDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage 비활성 환경 무시 */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
