import { Button } from "@/components/ui/button";

/**
 * A minimal call-to-action section with clean messaging and essential CTA.
 * Final clean section completing the sophisticated layout rhythm.
 */
export function CTA() {
  return (
    <section className="w-full py-24 text-center">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start building?
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Get the boilerplate and ship your product faster.
        </p>

        <Button size="lg">
          Get Started
        </Button>
      </div>
    </section>
  );
} 