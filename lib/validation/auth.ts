import { z } from "zod";

/**
 * 인증 검증 스키마 — 단일 진실(SSOT).
 * 출처: requirements FR-04 (클라/서버 양측 검증), designer §0-4 (인라인 문구 1:1 매핑),
 *       NFR-S3 / 가정 A-4 (비밀번호 정책: 최소 8자, 영문+숫자 포함).
 *
 * web·mobile 공유 대상이므로 React/Next 의존성 없이 순수 zod 만 사용한다.
 * (모노레포 정식 분리 전 단계 — 추후 packages/validation 으로 이동, FR-04.)
 */

// docs/02 §4 user_role Enum 6값
export const USER_ROLES = [
  "guardian",
  "person",
  "supporter",
  "teacher",
  "social_worker",
  "therapist",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

// 전문가군(가입 시 organization_type 노출 대상) — designer A-04
export const PROFESSIONAL_ROLES: readonly UserRole[] = [
  "supporter",
  "teacher",
  "social_worker",
  "therapist",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  guardian: "보호자",
  person: "당사자 본인",
  supporter: "활동지원사",
  teacher: "특수교사",
  social_worker: "사회복지사",
  therapist: "치료사",
};

const email = z
  .string()
  .min(1, "이메일을 입력해 주세요.")
  .email("올바른 이메일 형식이 아니에요.");

// 가정 A-4 확정: 최소 8자 + 영문 + 숫자 (디자이너 A-04 힌트와 1:1)
const password = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 해요.")
  .regex(/[A-Za-z]/, "영문을 포함해 주세요.")
  .regex(/[0-9]/, "숫자를 포함해 주세요.");

export const roleSchema = z.object({
  role: z.enum(USER_ROLES, {
    errorMap: () => ({ message: "역할을 선택해 주세요." }),
  }),
});
export type RoleInput = z.infer<typeof roleSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
  rememberMe: z.boolean().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    role: z.enum(USER_ROLES),
    email,
    password,
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
    name: z.string().min(1, "이름을 입력해 주세요.").max(50, "이름이 너무 길어요."),
    // FR-03 선택 필드
    phone: z.string().max(20).optional().or(z.literal("")),
    organization: z.string().max(100).optional().or(z.literal("")),
    organizationType: z.string().max(50).optional().or(z.literal("")),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["passwordConfirm"],
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const resetRequestSchema = z.object({ email });
export type ResetRequestInput = z.infer<typeof resetRequestSchema>;

export const resetUpdateSchema = z
  .object({
    password,
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["passwordConfirm"],
  });
export type ResetUpdateInput = z.infer<typeof resetUpdateSchema>;

// 계정 열거 방지 표준 메시지 (NFR-S2 / 가정 A-3 / designer §7 카피 가이드)
export const AUTH_COPY = {
  invalidCredentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  duplicateSignup:
    "입력하신 정보로 진행할 수 없어요. 이미 가입된 이메일이라면 로그인하거나 비밀번호를 재설정해 주세요.",
  resetRequested: "해당 이메일로 가입된 계정이 있다면 재설정 링크를 보냈어요.",
  inactiveAccount: "계정이 비활성화되었습니다. 관리자에게 문의해 주세요.",
  serverError: "일시적인 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
  linkExpired: "링크가 만료되었거나 이미 사용됐어요.",
} as const;
