import { Hero } from "@/components/sections/Hero";
import { FeaturesAccordion } from "@/components/sections/FeaturesAccordion";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Helmet } from "react-helmet-async";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";

/**
 * The main homepage, assembling various sections to create a compelling landing page.
 */
export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Your App | Homepage</title>
        <meta name="description" content="The best app for solving your problems." />
      </Helmet>
      <div className="flex flex-col">
        <Hero />
        <FeaturesAccordion />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </div>
    </>
  );
} 