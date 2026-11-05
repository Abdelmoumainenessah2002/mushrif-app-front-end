import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  authService,
  loginSchema,
  recoverySchema,
  type AuthService,
  type OAuthProvider,
} from "@/lib/auth-service";
import { useAuthAction } from "@/hooks/use-auth-action";
import { AuthFeedback, AuthSuccess } from "./AuthFeedback";
import { OAuthOptions } from "./OAuthOptions";

export function Field({
  label,
  error,
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | undefined;
  children?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="mb-2.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Input
          {...props}
          className="h-12 bg-surface/50 pr-12"
          aria-invalid={Boolean(error)}
          aria-describedby={
            [props["aria-describedby"], error ? `${props.id}-error` : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
        {children}
      </div>
      {error && (
        <p id={`${props.id}-error`} role="alert" className="mt-2 text-xs text-rose">
          {error}
        </p>
      )}
    </div>
  );
}
export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <Button type="submit" disabled={pending} className="mt-6 h-12 w-full text-sm">
      {pending ? <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" /> : null}
      {pending ? "Please wait…" : children}
      {!pending && <ArrowRight />}
    </Button>
  );
}
export function LoginForm({
  service = authService,
  onAuthenticated,
}: {
  service?: AuthService;
  onAuthenticated?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [operation, setOperation] = useState<"login" | OAuthProvider>("login");
  const action = useAuthAction();
  const form = useForm<{ identifier: string; password: string }>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const pending = action.state.status === "submitting";
  if (action.state.status === "success") return <AuthSuccess onContinue={onAuthenticated} />;
  async function submit(values: { identifier: string; password: string }) {
    setOperation("login");
    const result = await action.run(() => service.signIn({ ...values, rememberMe }));
    if (result?.status === "error") {
      if (result.fieldErrors?.identifier)
        form.setError("identifier", { message: result.fieldErrors.identifier });
      if (result.fieldErrors?.password)
        form.setError("password", { message: result.fieldErrors.password });
    } else if (result?.status === "success") form.reset();
  }
  return (
    <>
      <p className="mb-4 font-mono text-xs text-primary">WELCOME TO MUSHRIF</p>
      <h1 className="font-display text-4xl font-medium tracking-normal">Welcome back.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sign in to your shared world of work.
      </p>
      <form noValidate onSubmit={form.handleSubmit(submit, () => action.reset())} className="mt-9">
        <fieldset disabled={pending} className="space-y-5">
          <Field
            id="identifier"
            label="Email or phone number"
            type="text"
            autoComplete="username"
            placeholder="you@company.com or +213…"
            error={form.formState.errors.identifier?.message}
            {...form.register("identifier")}
          />
          <Field
            id="password"
            label="Password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1.5 top-1.5 text-muted-foreground"
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              title={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff /> : <Eye />}
            </Button>
          </Field>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(value) => setRememberMe(value === true)}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </fieldset>
        <SubmitButton pending={pending}>Sign In</SubmitButton>
      </form>
      <AuthFeedback state={action.state} operation={operation} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Mushrif?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
      <OAuthOptions
        disabled={pending}
        onSelect={(provider) => {
          setOperation(provider);
          void action.run(() => service.beginOAuth(provider));
        }}
      />
    </>
  );
}
export function RecoveryForm({ service = authService }: { service?: AuthService }) {
  const action = useAuthAction();
  const form = useForm<{ email: string }>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: "" },
  });
  const pending = action.state.status === "submitting";
  if (action.state.status === "success") return <AuthSuccess recovery />;
  return (
    <>
      <p className="mb-4 font-mono text-xs text-primary">LET’S GET YOU BACK</p>
      <h1 className="font-display text-4xl font-medium leading-tight tracking-normal">
        Reset your
        <br />
        password.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Enter your email address to request a password recovery link.
      </p>
      <form
        noValidate
        className="mt-9"
        onSubmit={form.handleSubmit(
          async ({ email }) => {
            const result = await action.run(() => service.requestRecovery(email));
            if (result?.status === "error" && result.fieldErrors?.email)
              form.setError("email", { message: result.fieldErrors.email });
          },
          () => action.reset(),
        )}
      >
        <Field
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          disabled={pending}
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />
        <SubmitButton pending={pending}>Send recovery link</SubmitButton>
      </form>
      <AuthFeedback state={action.state} operation="recovery" />
      <Button asChild variant="link" className="mt-5 w-full text-muted-foreground">
        <Link to="/login">Back to sign in</Link>
      </Button>
    </>
  );
}
