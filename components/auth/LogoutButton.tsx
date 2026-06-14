import { logoutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";

/**
 * 로그아웃 (FR-16/AC-08). Server Action 으로 signOut → /login.
 * 본 슬라이스는 동작·피드백만 담당(designer §3-2). 확인 다이얼로그는 후속.
 */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost">
        로그아웃
      </Button>
    </form>
  );
}
