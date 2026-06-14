import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  resetUpdateSchema,
  USER_ROLES,
} from "./auth";

describe("loginSchema", () => {
  it("유효한 입력을 통과시킨다", () => {
    const r = loginSchema.safeParse({
      email: "a@b.com",
      password: "x",
      rememberMe: true,
    });
    expect(r.success).toBe(true);
  });
  it("잘못된 이메일 형식을 거부한다", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(
      false,
    );
  });
});

describe("signupSchema (가정 A-4 비밀번호 정책)", () => {
  const base = {
    role: "guardian" as const,
    email: "a@b.com",
    name: "홍길동",
    password: "abcd1234",
    passwordConfirm: "abcd1234",
  };

  it("8자+영문+숫자를 통과시킨다", () => {
    expect(signupSchema.safeParse(base).success).toBe(true);
  });
  it("8자 미만을 거부한다", () => {
    expect(
      signupSchema.safeParse({ ...base, password: "ab1", passwordConfirm: "ab1" })
        .success,
    ).toBe(false);
  });
  it("숫자 없는 비밀번호를 거부한다", () => {
    expect(
      signupSchema.safeParse({
        ...base,
        password: "abcdefgh",
        passwordConfirm: "abcdefgh",
      }).success,
    ).toBe(false);
  });
  it("비밀번호 불일치를 거부한다", () => {
    const r = signupSchema.safeParse({ ...base, passwordConfirm: "different1" });
    expect(r.success).toBe(false);
  });
  it("6개 역할을 모두 허용한다", () => {
    for (const role of USER_ROLES) {
      expect(signupSchema.safeParse({ ...base, role }).success).toBe(true);
    }
  });
});

describe("resetUpdateSchema", () => {
  it("정책 위반 비밀번호를 거부한다", () => {
    expect(
      resetUpdateSchema.safeParse({ password: "short", passwordConfirm: "short" })
        .success,
    ).toBe(false);
  });
});
