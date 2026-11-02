import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { authService, identifierSchema, loginSchema, type AuthResult, type AuthService } from "@/lib/auth-service";
import { useAuthAction } from "@/hooks/use-auth-action";
import { LoginForm, RecoveryForm } from "@/components/auth/AuthForms";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => <a href={to} {...props}>{children}</a> }));
afterEach(cleanup);
describe("Frontend authentication boundaries", () => {
  it("accepts email and phone identifiers, rejecting obvious invalid formats", () => {
    expect(identifierSchema.safeParse("layla@example.com").success).toBe(true);
    expect(identifierSchema.safeParse("+213 555 123 456").success).toBe(true);
    expect(identifierSchema.safeParse("not-an-account").success).toBe(false);
    expect(identifierSchema.safeParse("123").success).toBe(false);
  });
  it("requires an identifier and password without verifying credentials", () => {
    expect(loginSchema.safeParse({ identifier: "", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ identifier: "a@example.com", password: "x" }).success).toBe(true);
  });
  it("never reports fake login, recovery or OAuth success by default", async () => {
    expect(await authService.signIn({ identifier: "a@example.com", password: "x", rememberMe: false })).toEqual({ status: "error", code: "unconfigured" });
    expect(await authService.requestRecovery("a@example.com")).toEqual({ status: "error", code: "unconfigured" });
    for (const provider of ["google", "github", "facebook"] as const) expect(await authService.beginOAuth(provider)).toEqual({ status: "error", code: "unconfigured" });
  });
  it("locks concurrent submissions until the operation finishes", async () => {
    let resolve: ((value: AuthResult) => void) | undefined;
    const operation = vi.fn(() => new Promise<AuthResult>((done) => { resolve = done; }));
    const { result } = renderHook(useAuthAction);
    act(() => { void result.current.run(operation); void result.current.run(operation); });
    expect(operation).toHaveBeenCalledTimes(1);
    expect(result.current.state.status).toBe("submitting");
    await act(async () => { resolve?.({ status: "error", code: "invalid_credentials" }); });
    expect(result.current.state).toEqual({ status: "error", code: "invalid_credentials" });
  });
  it("distinguishes network and server failures without exposing raw errors", async () => {
    const { result } = renderHook(useAuthAction);
    await act(async () => { await result.current.run(async () => { throw new TypeError("private details"); }); });
    expect(result.current.state).toEqual({ status: "error", code: "network" });
    await act(async () => { await result.current.run(async () => { throw new Error("private details"); }); });
    expect(result.current.state).toEqual({ status: "error", code: "server" });
  });
  it("passes only the checked Remember me preference and supports visibility", async () => {
    const signIn = vi.fn<AuthService["signIn"]>().mockResolvedValue({ status: "error", code: "invalid_credentials" });
    render(<LoginForm service={{ ...authService, signIn }} />);
    fireEvent.change(screen.getByLabelText("Email or phone number"), { target: { value: "a@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "local-only" } });
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("checkbox", { name: "Remember me" }));
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => expect(signIn).toHaveBeenCalledWith({ identifier: "a@example.com", password: "local-only", rememberMe: true }));
  });
  it("shows the recovery success state only after an accepted service result", async () => {
    const requestRecovery = vi.fn<AuthService["requestRecovery"]>().mockResolvedValue({ status: "success" });
    render(<RecoveryForm service={{ ...authService, requestRecovery }} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "a@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send recovery link" }));
    await waitFor(() => expect(screen.getByRole("status")).toBeInTheDocument());
    expect(requestRecovery).toHaveBeenCalledWith("a@example.com");
  });
  it("keeps successful login navigation under an explicit future hook", async () => {
    const onAuthenticated = vi.fn();
    render(<LoginForm service={{ ...authService, signIn: async () => ({ status: "success" }) }} onAuthenticated={onAuthenticated} />);
    fireEvent.change(screen.getByLabelText("Email or phone number"), { target: { value: "a@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "x" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument());
    expect(onAuthenticated).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });
});