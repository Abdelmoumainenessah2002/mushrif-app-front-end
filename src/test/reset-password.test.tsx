import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import {
  readResetToken,
  resetPasswordSchema,
  resetPasswordService,
  toResetPasswordPayload,
  type ResetPasswordService,
} from "@/lib/reset-password-service";
import type { AuthResult } from "@/lib/auth-service";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
beforeEach(() => window.history.replaceState({}, "", "/reset-password?token=test-only-token"));
afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
});
const values = { newPassword: "Str0ng!pass", confirmPassword: "Str0ng!pass" };
const fill = () => {
  fireEvent.change(screen.getByLabelText("New password"), {
    target: { value: values.newPassword },
  });
  fireEvent.change(screen.getByLabelText("Confirm new password"), {
    target: { value: values.confirmPassword },
  });
};
const submit = () => fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));
const service = (resetPassword: ResetPasswordService["resetPassword"]): ResetPasswordService => ({
  resetPassword,
});

describe("Reset rules and contract", () => {
  it("requires a token", () => {
    expect(readResetToken("")).toEqual({ status: "missing" });
    expect(readResetToken("?token=")).toEqual({ status: "missing" });
  });
  it("rejects duplicate tokens and whitespace/control characters without assuming a backend encoding", () => {
    for (const search of ["?token=a&token=b", "?token=a%20b", "?token=%0Aabc", "?token=%00abc"])
      expect(readResetToken(search)).toEqual({ status: "malformed" });
    expect(readResetToken("?token=opaque%2Bvalue")).toEqual({
      status: "present",
      token: "opaque+value",
    });
  });
  it("sends exactly token and newPassword, never confirmation", () => {
    expect(toResetPasswordPayload("test-only-token", values)).toEqual({
      token: "test-only-token",
      newPassword: "Str0ng!pass",
    });
  });
  it("rejects empty passwords", () => {
    expect(resetPasswordSchema.safeParse({ newPassword: "", confirmPassword: "" }).success).toBe(
      false,
    );
  });
  it("reuses the eight-character minimum", () => {
    expect(
      resetPasswordSchema.safeParse({ newPassword: "Aa1!aaa", confirmPassword: "Aa1!aaa" }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ newPassword: "Aa1!aaaa", confirmPassword: "Aa1!aaaa" })
        .success,
    ).toBe(true);
  });
  it.each(["ABCDEFG1!", "abcdefg1!", "Abcdefgh!", "Abcdefgh1"])(
    "rejects a missing existing strength requirement (%s)",
    (password) => {
      expect(
        resetPasswordSchema.safeParse({ newPassword: password, confirmPassword: password }).success,
      ).toBe(false);
    },
  );
  it("requires matching confirmation", () => {
    expect(
      resetPasswordSchema.safeParse({ ...values, confirmPassword: "Other1!pass" }).success,
    ).toBe(false);
  });
  it("cannot claim success by default", async () => {
    expect(
      await resetPasswordService.resetPassword(toResetPasswordPayload("test-only-token", values)),
    ).toEqual({ status: "error", code: "unconfigured" });
  });
});

describe("Reset form", () => {
  it("blocks missing links before requesting a reset", () => {
    window.history.replaceState({}, "", "/reset-password");
    const reset = vi.fn();
    render(<ResetPasswordForm service={service(reset)} />);
    expect(screen.getByRole("link", { name: "Request a new link" }).getAttribute("href")).toBe(
      "/forgot-password",
    );
    expect(screen.queryByLabelText("New password")).toBeNull();
    expect(reset).not.toHaveBeenCalled();
  });
  it("validates before calling the adapter and focuses the first error", async () => {
    const reset = vi.fn();
    render(<ResetPasswordForm service={service(reset)} />);
    submit();
    await screen.findByText("Enter your new password.");
    expect(document.activeElement).toBe(screen.getByLabelText("New password"));
    expect(reset).not.toHaveBeenCalled();
  });
  it("shows unconfigured feedback without success or sensitive persistent storage", async () => {
    const local = vi.spyOn(Storage.prototype, "setItem");
    render(<ResetPasswordForm />);
    fill();
    submit();
    await screen.findByText(/password reset is not connected yet/i);
    expect(screen.queryByText("Password reset")).toBeNull();
    expect(local).not.toHaveBeenCalled();
    expect(document.body.textContent).not.toContain("test-only-token");
  });
  it("blocks duplicate requests while pending, then clears fields after accepted success without signing in", async () => {
    let resolve: ((result: AuthResult) => void) | undefined;
    const reset = vi.fn(
      () =>
        new Promise<AuthResult>((done) => {
          resolve = done;
        }),
    );
    render(<ResetPasswordForm service={service(reset)} />);
    fill();
    const password = screen.getByLabelText("New password") as HTMLInputElement;
    const confirmation = screen.getByLabelText("Confirm new password") as HTMLInputElement;
    submit();
    await screen.findByRole("button", { name: /please wait/i });
    fireEvent.submit(password.closest("form") as HTMLFormElement);
    expect(reset).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledWith({ token: "test-only-token", newPassword: "Str0ng!pass" });
    if (!resolve) throw new Error("Missing pending response");
    resolve({ status: "success" });
    await screen.findByText("Password reset");
    await waitFor(() => expect(password.value).toBe(""));
    expect(confirmation.value).toBe("");
    expect(window.location.search).toBe("");
    expect(screen.getByRole("link", { name: /go to sign in/i }).getAttribute("href")).toBe(
      "/login",
    );
  });
  it.each(["invalid_token", "expired_token"] as const)(
    "offers a new recovery link after %s",
    async (code) => {
      render(<ResetPasswordForm service={service(async () => ({ status: "error", code }))} />);
      fill();
      submit();
      expect(
        (await screen.findByRole("link", { name: "Request a new link" })).getAttribute("href"),
      ).toBe("/forgot-password");
      expect(screen.queryByLabelText("New password")).toBeNull();
    },
  );
  it.each([new TypeError("private details"), new Error("private details")])(
    "maps thrown failures safely",
    async (error) => {
      render(
        <ResetPasswordForm
          service={service(async () => {
            throw error;
          })}
        />,
      );
      fill();
      submit();
      await screen.findByRole("alert");
      expect(document.body.textContent).not.toContain("private details");
      expect(screen.queryByText("Password reset")).toBeNull();
    },
  );
  it("maps backend password field errors", async () => {
    render(
      <ResetPasswordForm
        service={service(async () => ({
          status: "error",
          code: "validation",
          fieldErrors: { newPassword: "Choose a different password." },
        }))}
      />,
    );
    fill();
    submit();
    await screen.findByText("Choose a different password.");
    expect(document.activeElement).toBe(screen.getByLabelText("New password"));
  });
});
