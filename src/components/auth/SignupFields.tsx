import type { ReactNode, SelectHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COUNTRY_CODES,
  GENDER_OPTIONS,
  PASSWORD_RULES,
  formatPhone,
  passwordStrength,
} from "@/lib/signup-service";

export function FieldError({ id, error }: { id: string; error?: string | undefined }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-rose">
      {error}
    </p>
  );
}
function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2.5 block text-sm font-medium">
      {children}
    </label>
  );
}
const controlClass =
  "h-12 rounded-md border border-input bg-surface/50 px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-rose/60";

export function SelectControl({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlClass, className)} />;
}

export function PhoneField({
  country,
  national,
  countryValue,
  nationalValue,
  error,
  countryError,
}: {
  country: UseFormRegisterReturn;
  national: UseFormRegisterReturn;
  countryValue: string;
  nationalValue: string;
  error?: string | undefined;
  countryError?: string | undefined;
}) {
  const digits = nationalValue.replace(/\D/g, "");
  const preview = countryValue && digits ? formatPhone(countryValue, nationalValue) : "";
  const anyError = countryError ?? error;
  return (
    <div>
      <Label htmlFor="phoneNational">Phone number</Label>
      <div className="flex gap-2">
        <SelectControl
          id="phoneCountry"
          aria-label="Country calling code"
          autoComplete="tel-country-code"
          aria-invalid={Boolean(countryError)}
          className="w-[7.5rem] shrink-0 font-mono text-xs"
          {...country}
        >
          <option value="">Code</option>
          {COUNTRY_CODES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.iso} +{c.dial} · {c.name}
            </option>
          ))}
        </SelectControl>
        <input
          id="phoneNational"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="555 12 34 56"
          aria-invalid={Boolean(error)}
          aria-describedby={anyError ? "phoneNational-error" : "phoneNational-hint"}
          className={cn(controlClass, "min-w-0 flex-1 placeholder:text-muted-foreground")}
          {...national}
        />
        <input type="hidden" name="phoneNumber" value={preview} readOnly />
      </div>
      {anyError ? (
        <FieldError id="phoneNational" error={anyError} />
      ) : (
        <p id="phoneNational-hint" className="mt-2 font-mono text-[11px] text-muted-foreground">
          {preview ? `Will be sent as ${preview}` : "Choose your country code, then your number."}
        </p>
      )}
    </div>
  );
}

export function DateOfBirthField({
  register,
  max,
  error,
}: {
  register: UseFormRegisterReturn;
  max: string;
  error?: string | undefined;
}) {
  return (
    <div>
      <Label htmlFor="dateOfBirth">Date of birth</Label>
      <input
        id="dateOfBirth"
        type="date"
        autoComplete="bday"
        max={max}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "dateOfBirth-error" : undefined}
        className={cn(controlClass, "w-full [color-scheme:dark]")}
        {...register}
      />
      <FieldError id="dateOfBirth" error={error} />
    </div>
  );
}

export function GenderField({
  register,
  value,
  error,
}: {
  register: UseFormRegisterReturn;
  value: string;
  error?: string | undefined;
}) {
  return (
    <fieldset aria-describedby={error ? "gender-error" : undefined}>
      <legend className="mb-2.5 block text-sm font-medium">Gender</legend>
      <div className="grid grid-cols-2 gap-2">
        {GENDER_OPTIONS.map((g) => (
          <label
            key={g.value}
            className={cn(
              "flex h-12 cursor-pointer items-center gap-3 rounded-md border bg-surface/50 px-4 text-sm transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring",
              value === g.value
                ? "border-primary/60 text-foreground"
                : "border-input text-muted-foreground hover:text-foreground",
            )}
          >
            <input type="radio" value={g.value} className="accent-[var(--primary)]" {...register} />
            {g.label}
          </label>
        ))}
      </div>
      <FieldError id="gender" error={error} />
    </fieldset>
  );
}

const STRENGTH_TONE = ["bg-border", "bg-rose", "bg-primary", "bg-sky", "bg-sage"];
export function PasswordRequirements({ value }: { value: string }) {
  const { score, label } = passwordStrength(value);
  return (
    <div id="password-requirements" className="mt-3">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={cn(
                "h-1 rounded-full transition-colors duration-300",
                n <= score ? STRENGTH_TONE[score] : "bg-border",
              )}
            />
          ))}
        </div>
        <span
          className="w-12 text-right font-mono text-[11px] text-muted-foreground"
          aria-live="polite"
        >
          {label ? `${label}` : ""}
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(value);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                ok ? "text-sage" : "text-muted-foreground",
              )}
            >
              {ok ? <Check className="size-3.5" /> : <Circle className="size-3" />}
              {rule.label}
              <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
