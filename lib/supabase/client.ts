"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * 브라우저(Client Component)용 Supabase 클라이언트.
 * @supabase/ssr 의 createBrowserClient 는 쿠키 기반 세션을 사용하므로
 * SSR/RSC 와 세션이 공유된다 (FR-17, docs/10 §1).
 * onAuthStateChange 구독·재발송 등 클라이언트 측 인증 동작에 사용.
 */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
