/**
 * StepIndicator — DS §8-10. 회원가입 위자드 진행 표시 (designer A-03/04/05).
 * 완료/현재=primary-500, 예정=neutral-300.
 */
const STEPS = ["역할", "정보", "인증"] as const;

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol
      className="mb-6 flex items-center justify-center gap-2"
      aria-label={`회원가입 단계 ${current} / 3`}
    >
      {STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = n <= current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                active ? "bg-primary-500 text-white" : "bg-neutral-200 text-neutral-500"
              }`}
              aria-current={n === current ? "step" : undefined}
            >
              {n}
            </span>
            <span
              className={`text-xs ${active ? "font-medium text-neutral-700" : "text-neutral-400"}`}
            >
              {label}
            </span>
            {n < 3 && <span className="mx-1 h-px w-4 bg-neutral-300" />}
          </li>
        );
      })}
    </ol>
  );
}
