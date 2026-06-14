import type { ReactNode } from "react";

type Tone = "error" | "warning" | "info" | "success";

const tones: Record<Tone, { box: string; live: "assertive" | "polite" }> = {
  error: { box: "bg-error-bg text-error-text border-error-border", live: "assertive" },
  warning: {
    box: "bg-warning-bg text-warning-text border-warning-border",
    live: "polite",
  },
  info: { box: "bg-info-bg text-info-text border-info-border", live: "polite" },
  success: {
    box: "bg-success-bg text-success-text border-success-border",
    live: "polite",
  },
};

/**
 * InlineAlert — 폼 상단/필드 외 알림. 상태 변화 ARIA live 통지 (designer §6 §4 매핑).
 * 자격증명 오류=error(assertive), 중복 이메일=info(polite) 등 톤이 보안 카피와 연동.
 */
export function InlineAlert({
  tone,
  children,
  action,
}: {
  tone: Tone;
  children: ReactNode;
  action?: ReactNode;
}) {
  const t = tones[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={t.live}
      className={`mb-4 rounded-xl border px-4 py-3 text-sm ${t.box}`}
    >
      <div>{children}</div>
      {action && <div className="mt-2 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}
