import { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { AuthOperation, AuthResult, OAuthProvider } from "@/lib/auth-service";
import {
  fieldSchemas,
  formatPhone,
  localToday,
  registrationService,
  signupSchema,
  toRegistrationPayload,
  type RegistrationField,
  type RegistrationService,
  type SignupFormValues,
  type SignupParsed,
} from "@/lib/signup-service";
import { useAuthAction } from "@/hooks/use-auth-action";
import { Field, SubmitButton } from "./AuthForms";
import { AuthFeedback, AuthSuccess } from "./AuthFeedback";
import { OAuthOptions } from "./OAuthOptions";
import { DateOfBirthField, GenderField, PasswordRequirements, PhoneField } from "./SignupFields";

/** Maps backend field names onto form control names. */
const FORM_FIELD: Record<RegistrationField, keyof SignupFormValues> = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phoneNumber: "phoneNational",
  dateOfBirth: "dateOfBirth",
  gender: "gender",
  password: "password",
};
function applyFieldErrors(
  result: AuthResult | undefined,
  setError: (name: keyof SignupFormValues, error: { message: string }) => void,
) {
  if (result?.status !== "error" || !result.fieldErrors) return;
  for (const [key, message] of Object.entries(result.fieldErrors)) {
    const target = FORM_FIELD[key as RegistrationField];
    if (target && message) setError(target, { message });
  }
}

function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  const label = visible ? "Hide password" : "Show password";
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-1.5 top-1.5 text-muted-foreground"
      aria-label={label}
      aria-pressed={visible}
      title={label}
      onClick={onToggle}
    >
      {visible ? <EyeOff /> : <Eye />}
    </Button>
  );
}

function ErrorSummary({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-md border border-rose/30 bg-rose/5 p-4 text-sm"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose" />
      <p>Please fix {count === 1 ? "1 field" : `${count} fields`} highlighted below.</p>
    </div>
  );
}

const EMPTY: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCountry: "",
  phoneNational: "",
  dateOfBirth: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

export function SignupForm({ service = registrationService }: { service?: RegistrationService }) {
  const [visible, setVisible] = useState(false);
  const [operation, setOperation] = useState<AuthOperation>("signup");
  const [completion, setCompletion] = useState<{
    provider: OAuthProvider;
    missing: Exclude<RegistrationField, "password">[];
  } | null>(null);
  const action = useAuthAction();
  const form = useForm<SignupFormValues, unknown, SignupParsed>({
    resolver: zodResolver(signupSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });
  const { errors, submitCount, isSubmitSuccessful } = form.formState;
  const pending = action.state.status === "submitting";
  const [password, phoneCountry, phoneNational, gender] = form.watch([
    "password",
    "phoneCountry",
    "phoneNational",
    "gender",
  ]);
  const errorCount = Object.keys(errors).length;
  const today = useMemo(() => localToday(), []);

  if (action.state.status === "success") return <AuthSuccess signup />;
  if (completion)
    return (
      <ProfileCompletionForm
        {...completion}
        service={service}
        onCancel={() => setCompletion(null)}
      />
    );

  async function submit(values: SignupParsed) {
    setOperation("signup");
    const result = await action.run(() => service.register(toRegistrationPayload(values)));
    applyFieldErrors(result, form.setError);
    if (result?.status === "success") form.reset(EMPTY);
  }
  async function startOAuth(provider: OAuthProvider) {
    setOperation(provider);
    let next: Awaited<ReturnType<RegistrationService["beginOAuthSignup"]>> | undefined;
    await action.run(async () => {
      next = await service.beginOAuthSignup(provider);
      return next.status === "needs_profile" ? { status: "error", code: "validation" } : next;
    });
    if (next?.status === "needs_profile") {
      action.reset();
      setCompletion({ provider: next.provider, missing: next.missing });
    }
  }

  return (
    <>
      <p className="mb-4 font-mono text-xs text-primary">JOIN MUSHRIF</p>
      <h1 className="font-display text-4xl font-medium tracking-normal">Create your account.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        One shared place for your projects, teams and work.
      </p>
      <form noValidate className="mt-9" onSubmit={form.handleSubmit(submit, () => action.reset())}>
        {submitCount > 0 && !isSubmitSuccessful && <ErrorSummary count={errorCount} />}
        <fieldset disabled={pending} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="firstName"
              label="First name"
              autoComplete="given-name"
              placeholder="Layla"
              error={errors.firstName?.message}
              {...form.register("firstName")}
            />
            <Field
              id="lastName"
              label="Last name"
              autoComplete="family-name"
              placeholder="Haddad"
              error={errors.lastName?.message}
              {...form.register("lastName")}
            />
          </div>
          <Field
            id="email"
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...form.register("email")}
          />
          <PhoneField
            country={form.register("phoneCountry")}
            national={form.register("phoneNational")}
            countryValue={phoneCountry}
            nationalValue={phoneNational}
            countryError={errors.phoneCountry?.message}
            error={errors.phoneNational?.message}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <DateOfBirthField
              register={form.register("dateOfBirth")}
              max={today}
              error={errors.dateOfBirth?.message}
            />
            <GenderField
              register={form.register("gender")}
              value={gender}
              error={errors.gender?.message}
            />
          </div>
          <div>
            <Field
              id="password"
              label="Password"
              type={visible ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              error={errors.password?.message}
              {...form.register("password")}
            >
              <PasswordToggle visible={visible} onToggle={() => setVisible(!visible)} />
            </Field>
            <PasswordRequirements value={password} />
          </div>
          <Field
            id="confirmPassword"
            label="Confirm password"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
        </fieldset>
        <SubmitButton pending={pending}>Create account</SubmitButton>
      </form>
      <AuthFeedback state={action.state} operation={operation} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
      <OAuthOptions disabled={pending} onSelect={(p) => void startOAuth(p)} />
    </>
  );
}

type MissingField = Exclude<RegistrationField, "password">;
/** Collects only the fields an OAuth provider didn't return. Frontend-only until integrated. */
export function ProfileCompletionForm({
  provider,
  missing,
  service,
  onCancel,
}: {
  provider: OAuthProvider;
  missing: MissingField[];
  service: RegistrationService;
  onCancel: () => void;
}) {
  const action = useAuthAction();
  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const f of missing) {
      if (f === "phoneNumber") {
        shape.phoneCountry = fieldSchemas.phoneCountry;
        shape.phoneNational = fieldSchemas.phoneNational;
      } else shape[f] = fieldSchemas[f];
    }
    return z.object(shape);
  }, [missing]);
  const form = useForm<SignupFormValues>({
    // The schema is built from the missing fields at runtime, so its static type is widened.
    resolver: zodResolver(schema) as unknown as Resolver<SignupFormValues>,
    defaultValues: EMPTY,
    mode: "onTouched",
  });
  const { errors } = form.formState;
  const pending = action.state.status === "submitting";
  const [phoneCountry, phoneNational, gender] = form.watch([
    "phoneCountry",
    "phoneNational",
    "gender",
  ]);
  const has = (f: MissingField) => missing.includes(f);
  if (action.state.status === "success") return <AuthSuccess signup />;

  async function submit(values: SignupFormValues) {
    const fields: Partial<Record<MissingField, string>> = {};
    for (const f of missing)
      fields[f] =
        f === "phoneNumber"
          ? formatPhone(values.phoneCountry, values.phoneNational)
          : String(values[f]).trim();
    const result = await action.run(() => service.completeOAuthProfile(provider, fields));
    applyFieldErrors(result, form.setError);
  }
  return (
    <>
      <p className="mb-4 font-mono text-xs text-primary">ALMOST THERE</p>
      <h1 className="font-display text-4xl font-medium tracking-normal">Complete your profile.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your provider didn’t share everything Mushrif needs. Add the missing details below.
      </p>
      <form noValidate className="mt-9" onSubmit={form.handleSubmit(submit, () => action.reset())}>
        <fieldset disabled={pending} className="space-y-5">
          {has("firstName") && (
            <Field
              id="firstName"
              label="First name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...form.register("firstName")}
            />
          )}
          {has("lastName") && (
            <Field
              id="lastName"
              label="Last name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...form.register("lastName")}
            />
          )}
          {has("email") && (
            <Field
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...form.register("email")}
            />
          )}
          {has("phoneNumber") && (
            <PhoneField
              country={form.register("phoneCountry")}
              national={form.register("phoneNational")}
              countryValue={phoneCountry}
              nationalValue={phoneNational}
              countryError={errors.phoneCountry?.message}
              error={errors.phoneNational?.message}
            />
          )}
          {has("dateOfBirth") && (
            <DateOfBirthField
              register={form.register("dateOfBirth")}
              max={localToday()}
              error={errors.dateOfBirth?.message}
            />
          )}
          {has("gender") && (
            <GenderField
              register={form.register("gender")}
              value={gender}
              error={errors.gender?.message}
            />
          )}
        </fieldset>
        <SubmitButton pending={pending}>Finish creating account</SubmitButton>
      </form>
      <AuthFeedback state={action.state} operation="signup" />
      <Button
        type="button"
        variant="link"
        className="mt-5 w-full text-muted-foreground"
        onClick={onCancel}
      >
        Back to sign up
      </Button>
    </>
  );
}
