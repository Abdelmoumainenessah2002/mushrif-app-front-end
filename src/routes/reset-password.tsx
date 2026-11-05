import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset your password — Mushrif" },
    { name: "description", content: "Set a new password for your Mushrif account using your recovery link." },
    { property: "og:title", content: "Reset your password — Mushrif" },
    { property: "og:description", content: "Return to your projects with a new Mushrif password." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
    { name: "referrer", content: "no-referrer" },
  ] }),
  component: ResetPasswordPage,
});
function ResetPasswordPage() {
  return <AuthLayout recovery><ResetPasswordForm /></AuthLayout>;
}