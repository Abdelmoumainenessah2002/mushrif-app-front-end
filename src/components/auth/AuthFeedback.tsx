import { motion, useReducedMotion } from "motion/react";
import { CircleAlert, Check, ArrowRight, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authMessage, type AuthOperation } from "@/lib/auth-service";
import type { AuthActionState } from "@/hooks/use-auth-action";

export function AuthFeedback({
  state,
  operation,
}: {
  state: AuthActionState;
  operation: AuthOperation;
}) {
  if (state.status !== "error") return null;
  return (
    <div
      role="alert"
      className="mt-5 flex items-start gap-3 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>{authMessage(state.code, operation)}</p>
    </div>
  );
}
export function AuthSuccess({
  recovery = false,
  signup = false,
  reset = false,
  onContinue,
}: {
  recovery?: boolean;
  signup?: boolean;
  reset?: boolean;
  onContinue?: (() => void) | undefined;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      role="status"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="mb-7 flex size-12 items-center justify-center rounded-full border border-sage/30 bg-sage/10 text-sage">
        {recovery ? <Mail className="size-5" /> : <Check className="size-5" />}
      </div>
      <h1 className="font-display text-4xl font-medium tracking-normal">
        {recovery ? "Check your inbox" : reset ? "Password reset" : signup ? "Account created" : "You’re signed in"}
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {recovery
          ? "If an account matches that email, you’ll receive a link to reset your password. Check your spam folder, too."
          : reset
            ? "Your password has been changed. Sign in with your new password to continue."
          : signup
            ? "Your registration was accepted. Follow any next steps your account email describes, then sign in."
            : "Your sign-in was accepted. You can continue when your workspace is connected."}
      </p>
      {recovery || signup || reset ? (
        <Button asChild className="mt-8 h-12 w-full">
          <Link to="/login">
            {signup || reset ? "Go to sign in" : "Back to sign in"}
            <ArrowRight />
          </Link>
        </Button>
      ) : onContinue ? (
        <Button onClick={onContinue} className="mt-8 h-12 w-full">
          Continue
          <ArrowRight />
        </Button>
      ) : (
        <Button asChild variant="outline" className="mt-8 h-12 w-full">
          <Link to="/">
            Return to Mushrif
            <ArrowRight />
          </Link>
        </Button>
      )}
    </motion.div>
  );
}
