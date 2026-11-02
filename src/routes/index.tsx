import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { Nav } from "@/components/mushrif/Nav";
import { Hero } from "@/components/mushrif/Hero";
import { Capabilities } from "@/components/mushrif/Capabilities";
import { Structure } from "@/components/mushrif/Structure";
import { HowItWorks } from "@/components/mushrif/HowItWorks";
import { FinalCta } from "@/components/mushrif/FinalCta";
import { Footer } from "@/components/mushrif/Footer";

const title = "Mushrif — Project & work management";
const description = "Organize projects, coordinate teams and track work across your organization — workspaces, projects, epics, milestones and every task in between.";

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
          <Structure />
          <HowItWorks />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
