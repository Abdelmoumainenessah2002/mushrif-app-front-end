import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/AuthForms";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Mushrif" },
      {
        name: "description",
        content: "Sign in to Mushrif, your shared place for projects and work.",
      },
      { property: "og:title", content: "Sign in — Mushrif" },
      { property: "og:description", content: "Return to your shared world of work with Mushrif." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});
function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
