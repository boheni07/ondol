import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * 서버(Server Component / Server Action / Route Handler)용 Supabase 클라이언트.
 * Next.js cookies() 스토어와 연결해 httpOnly·Secure 쿠키로 세션을 읽고 쓴다 (NFR-S4, FR-17).
 *
 * 주의: Server Component 렌더링 중에는 쿠키 set 이 불가하므로 try/catch 로 무시한다.
 * 토큰 갱신 쓰기는 middleware(updateSession) 가 책임진다.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component 컨텍스트에서 호출된 경우 — middleware 가 세션 갱신을 담당하므로 무시.
        }
      },
    },
  });
}
