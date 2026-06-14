import type { ReactNode } from "react";

/**
 * 인증 레이아웃 카드 (designer §9 DS 확장: AuthCard).
 * 중앙 정렬, max-w-md, BaseCard(rounded-xl elevation-1), surface-page 배경, 로고 슬롯.
 */
export function AuthCard({
  title,
  children,
  step,
}: {
  title: string;
  children: ReactNode;
  step?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="text-2xl font-bold text-primary-500">OnDol</span>
        </div>
        <div className="rounded-xl bg-surface-card p-6 shadow-elevation-1 sm:p-8">
          {step}
          <h1 className="mb-6 text-xl font-bold text-neutral-900">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
