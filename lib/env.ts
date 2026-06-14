/**
 * 환경 변수 접근 헬퍼. 누락 시 빌드/런타임 초기에 명확히 실패시킨다(WBS 0.5 환경 분리).
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[env] 필수 환경 변수 ${name} 가 설정되지 않았습니다. .env.example 를 참고해 .env.local 에 설정하세요.`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  supabaseAnonKey: required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
  // 링크 redirect 기준 origin. 미설정 시 localhost 폴백(개발 편의).
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
