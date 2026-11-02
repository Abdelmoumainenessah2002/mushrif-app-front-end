import { useRef, useState } from "react";
import type { AuthResult } from "@/lib/auth-service";

export type AuthActionState = { status: "idle" | "submitting" } | AuthResult;
export function useAuthAction() {
  const [state, setState] = useState<AuthActionState>({ status: "idle" });
  const locked = useRef(false);
  async function run(operation: () => Promise<AuthResult>) {
    if (locked.current) return;
    locked.current = true;
    setState({ status: "submitting" });
    try {
      const result = await operation();
      setState(result);
      return result;
    } catch (error) {
      const result: AuthResult = { status: "error", code: error instanceof TypeError ? "network" : "server" };
      setState(result);
      return result;
    } finally {
      locked.current = false;
    }
  }
  return { state, run, reset: () => setState({ status: "idle" }) };
}