import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleHomePath } from "@/lib/auth/routing";

/**
 * 루트 진입(/). 세션이 있으면 역할 홈으로, 없으면 로그인으로 (자동 로그인 흐름의 진입점).
 * person 역할의 "/" 홈 개념은 후속에서 분리; 본 슬라이스는 인증 분기만 담당.
 */
export default async function RootPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!user.email_confirmed_at) redirect("/signup/verify");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  redirect(roleHomePath(profile?.role));
}
