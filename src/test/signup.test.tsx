import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import {
  localToday,
  registrationService,
  signupSchema,
  toRegistrationPayload,
  type RegistrationService,
} from "@/lib/signup-service";
import { SignupForm } from "@/components/auth/SignupForm";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
afterEach(cleanup);

const valid = {
  firstName: "  Layla ",
  lastName: " Haddad",
  email: " Layla@Example.COM ",
  phoneCountry: "DZ",
  phoneNational: "555 12 34 56",
  dateOfBirth: "1994-05-17",
  gender: "female",
  password: "Str0ng!pass",
  confirmPassword: "Str0ng!pass",
};
const errorsFor = (v: object) => {
  const r = signupSchema.safeParse(v);
  return r.success ? {} : r.error.flatten().fieldErrors;
};

describe("Sign-up validation", () => {
  it("builds a payload with exactly the seven backend fields, trimmed and normalized", () => {
    const payload = toRegistrationPayload(signupSchema.parse(valid));
    expect(payload).toEqual({
      firstName: "Layla",
      lastName: "Haddad",
      email: "layla@example.com",
      phoneNumber: "+213555123456",
      dateOfBirth: "1994-05-17",
      gender: "female",
      password: "Str0ng!pass",
    });
    expect(Object.keys(payload)).not.toContain("confirmPassword");
  });
  it("rejects a mismatched password confirmation", () => {
    expect(errorsFor({ ...valid, confirmPassword: "Other1!pass" }).confirmPassword).toBeDefined();
  });
  it("rejects future and impossible dates of birth", () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    expect(errorsFor({ ...valid, dateOfBirth: localToday(d) }).dateOfBirth).toBeDefined();
    expect(errorsFor({ ...valid, dateOfBirth: "2001-02-30" }).dateOfBirth).toBeDefined();
  });
  it("rejects invalid email, phone, gender and weak passwords", () => {
    const e = errorsFor({
      ...valid,
      email: "nope",
      phoneNational: "0555 12",
      gender: "",
      password: "short",
      confirmPassword: "short",
    });
    expect(e.email && e.phoneNational && e.gender && e.password).toBeTruthy();
    expect(errorsFor({ ...valid, phoneCountry: "" }).phoneCountry).toBeDefined();
  });
  it("is explicitly unconfigured by default", async () => {
    expect(
      await registrationService.register(toRegistrationPayload(signupSchema.parse(valid))),
    ).toEqual({
      status: "error",
      code: "unconfigured",
    });
    expect(await registrationService.beginOAuthSignup("google")).toEqual({
      status: "error",
      code: "unconfigured",
    });
  });
});

function fill() {
  const set = (label: string | RegExp, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  set("First name", valid.firstName);
  set("Last name", valid.lastName);
  set("Email address", valid.email);
  set("Country calling code", valid.phoneCountry);
  set("Phone number", valid.phoneNational);
  set("Date of birth", valid.dateOfBirth);
  fireEvent.click(screen.getByLabelText("Female"));
  set("Password", valid.password);
  set("Confirm password", valid.confirmPassword);
}
const service = (over: Partial<RegistrationService>): RegistrationService => ({
  ...registrationService,
  ...over,
});

describe("Sign-up form", () => {
  it("shows the unconfigured state, not success, by default", async () => {
    render(<SignupForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText(/registration is not connected yet/i)).toBeTruthy();
    expect(screen.queryByText("Account created")).toBeNull();
  });
  it("sends only the payload fields and maps backend field errors", async () => {
    const register = vi.fn(async () => ({
      status: "error" as const,
      code: "validation" as const,
      fieldErrors: { email: "This email is already registered.", phoneNumber: "Phone in use." },
    }));
    render(<SignupForm service={service({ register })} />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText("This email is already registered.")).toBeTruthy();
    expect(screen.getByText("Phone in use.")).toBeTruthy();
    expect(register).toHaveBeenCalledWith(toRegistrationPayload(signupSchema.parse(valid)));
  });
  it("shows success only after a successful service response", async () => {
    render(<SignupForm service={service({ register: async () => ({ status: "success" }) })} />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText("Account created")).toBeTruthy();
  });
  it("asks only for fields an OAuth provider did not return", async () => {
    render(
      <SignupForm
        service={service({
          beginOAuthSignup: async () => ({
            status: "needs_profile",
            provider: "github",
            missing: ["phoneNumber", "gender"],
          }),
        })}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue with GitHub" }));
    await waitFor(() => expect(screen.getByText("Complete your profile.")).toBeTruthy());
    expect(screen.getByLabelText("Phone number")).toBeTruthy();
    expect(screen.queryByLabelText("Date of birth")).toBeNull();
    expect(screen.queryByLabelText("Password")).toBeNull();
  });
});
