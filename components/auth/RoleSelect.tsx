"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  USER_ROLES,
  ROLE_LABELS,
  type UserRole,
} from "@/lib/validation/auth";
import { Button } from "@/components/ui/Button";
import { writeDraft, readDraft } from "./signupDraft";

const ROLE_DESC: Record<UserRole, string> = {
  guardian: "당사자의 기록을 관리하는 가족·후견인",
  person: "내 기록을 직접 남기는 당사자",
  supporter: "활동을 지원하는 활동지원사",
  teacher: "학교에서 함께하는 특수교사",
  social_worker: "복지 서비스를 연계하는 사회복지사",
  therapist: "치료를 담당하는 치료사",
};

/**
 * A-03 역할 선택 (Step 1/3). 라디오 그룹 시맨틱 (docs/14 §4).
 * 선택값을 draft 에 저장하고 A-04 로 이동.
 */
export function RoleSelect() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | undefined>(() => readDraft().role);

  function next() {
    if (!role) return;
    writeDraft({ role });
    router.push("/signup/profile");
  }

  return (
    <div>
      <div role="radiogroup" aria-label="역할 선택" className="grid gap-3">
        {USER_ROLES.map((r) => {
          const selected = role === r;
          return (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setRole(r)}
              className={`rounded-xl border-2 p-4 text-left transition-colors ${
                selected
                  ? "border-primary-500 bg-primary-100"
                  : "border-neutral-200 bg-white hover:border-primary-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900">
                  {ROLE_LABELS[r]}
                </span>
                {selected && (
                  <span aria-hidden="true" className="text-primary-500">
                    ✓
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500">{ROLE_DESC[r]}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Button fullWidth disabled={!role} onClick={next}>
          다음
        </Button>
      </div>
    </div>
  );
}
