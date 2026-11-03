import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Mushrif" },
      {
        name: "description",
        content: "Create a Mushrif account to bring your projects, teams and work together.",
      },
      { property: "og:title", content: "Create your account — Mushrif" },
      {
        property: "og:description",
        content: "Join Mushrif — one shared place for projects, teams and work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});
function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
