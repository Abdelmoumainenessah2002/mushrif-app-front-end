import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthAction } from "@/hooks/use-auth-action";
import {
  readResetToken, resetPasswordSchema, resetPasswordService, toResetPasswordPayload,
  type ResetPasswordService, type ResetPasswordValues, type ResetTokenState,
} from "@/lib/reset-password-service";
import { Field, SubmitButton } from "./AuthForms";
import { PasswordRequirements } from "./SignupFields";
import { AuthFeedback, AuthSuccess } from "./AuthFeedback";

const EMPTY: ResetPasswordValues = { newPassword: "", confirmPassword: "" };

function ResetLinkIssue({ expired = false }: { expired?: boolean }) {
  return (
    <>
      <CircleAlert className="mb-6 size-10 text-primary" aria-hidden="true" />
      <h1 className="font-display text-4xl font-medium leading-tight tracking-normal">
        {expired ? "Reset link expired." : "Reset link unavailable."}
      </h1>
      <p role="alert" className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {expired ? "This reset link has expired." : "This reset link is missing or invalid."} Request a new link to reset your password.
      </p>
      <Button asChild className="mt-8 h-12 w-full">
        <Link to="/forgot-password">Request a new link</Link>
      </Button>
    </>
  );
}

export function ResetPasswordForm({ service = resetPasswordService }: { service?: ResetPasswordService }) {
  const [tokenState, setTokenState] = useState<ResetTokenState>({ status: "checking" });
  const [visible, setVisible] = useState({ newPassword: false, confirmPassword: false });
  const action = useAuthAction();
  const form = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: EMPTY, mode: "onTouched" });
  const password = form.watch("newPassword");
  const pending = action.state.status === "submitting";
  // Browser-only, in-memory handling; never render, log or persist the token.
  useEffect(() => {
    const read = () => { setTokenState(readResetToken(window.location.search)); form.reset(EMPTY); action.reset(); };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
    // The form and action setters are stable; only browser navigation rereads the link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (action.state.status === "success") return <AuthSuccess reset />;
  if (tokenState.status === "checking") return <p role="status" className="text-muted-foreground">Opening reset link…</p>;
  const tokenError = action.state.status === "error" && (action.state.code === "invalid_token" || action.state.code === "expired_token");
  if (tokenState.status !== "present" || tokenError)
    return <ResetLinkIssue expired={action.state.status === "error" && action.state.code === "expired_token"} />;

  async function submit(values: ResetPasswordValues) {
    if (tokenState.status !== "present") return;
    const result = await action.run(() => service.resetPassword(toResetPasswordPayload(tokenState.token, values)));
    if (result?.status === "success") {
      form.reset(EMPTY);
      setVisible({ newPassword: false, confirmPassword: false });
      setTokenState({ status: "missing" });
      // Remove the consumed token from the address bar without changing the router's history key.
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    } else if (result?.status === "error" && result.fieldErrors?.newPassword) {
      form.setError("newPassword", { message: result.fieldErrors.newPassword }, { shouldFocus: true });
    }
  }

  return (
    <>
      <p className="mb-4 font-mono text-xs text-primary">A FRESH START</p>
      <h1 className="font-display text-4xl font-medium leading-tight tracking-normal">Set a new password.</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Choose a new password for your Mushrif account.</p>
      <form noValidate className="mt-9" onSubmit={form.handleSubmit(submit, () => action.reset())} aria-busy={pending}>
        <fieldset disabled={pending} className="space-y-5">
          {(["newPassword", "confirmPassword"] as const).map((name) => {
            const label = name === "newPassword" ? "New password" : "Confirm new password";
            const toggleLabel = `${visible[name] ? "Hide" : "Show"} ${label.toLowerCase()}`;
            return (
              <div key={name}>
                <Field id={name} label={label} type={visible[name] ? "text" : "password"} autoComplete="new-password" required
                  error={form.formState.errors[name]?.message}
                  aria-describedby={name === "newPassword" ? "password-requirements" : undefined}
                  {...form.register(name)}>
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1.5 top-1.5 text-muted-foreground"
                    aria-label={toggleLabel} title={toggleLabel} aria-pressed={visible[name]}
                    onClick={() => setVisible((previous) => ({ ...previous, [name]: !previous[name] }))}>
                    {visible[name] ? <EyeOff /> : <Eye />}
                  </Button>
                </Field>
                {name === "newPassword" && <PasswordRequirements value={password} />}
              </div>
            );
          })}
        </fieldset>
        <SubmitButton pending={pending}>Reset Password</SubmitButton>
      </form>
      <AuthFeedback state={action.state} operation="reset" />
      <Button asChild variant="link" className="mt-5 w-full text-muted-foreground"><Link to="/login">Back to sign in</Link></Button>
    </>
  );
}