import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RecoveryForm } from "@/components/auth/AuthForms";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Password recovery — Mushrif" },
      {
        name: "description",
        content: "Request a password recovery link for your Mushrif account.",
      },
      { property: "og:title", content: "Password recovery — Mushrif" },
      {
        property: "og:description",
        content: "Get back to your projects with Mushrif password recovery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});
function ForgotPasswordPage() {
  return (
    <AuthLayout recovery>
      <RecoveryForm />
    </AuthLayout>
  );
}
