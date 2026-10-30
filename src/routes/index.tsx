import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { Nav } from "@/components/mushrif/Nav";
import { Hero } from "@/components/mushrif/Hero";
import { Capabilities } from "@/components/mushrif/Capabilities";
import { Permissions } from "@/components/mushrif/Permissions";
import { Ownership } from "@/components/mushrif/Ownership";
import { HowItWorks } from "@/components/mushrif/HowItWorks";
import { FinalCta } from "@/components/mushrif/FinalCta";
import { Footer } from "@/components/mushrif/Footer";

const title = "Mushrif — Organization & team management";
const description = "Manage organizations, members, roles, permissions, account security, notifications and ownership in one structured place.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        <Nav />
        <main>
          <Hero />
          <Capabilities />
          <Permissions />
          <Ownership />
          <HowItWorks />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
