import { Button } from "@/components/ui/button";

/**
 * A minimal hero section with clean typography and essential messaging.
 * Clean foundation section without decorative elements.
 */
export function Hero() {
  return (
    <section className="w-full py-24 text-center">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Build faster, ship sooner
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          A clean, minimal boilerplate with everything you need to start building. 
          Authentication, payments, and modern tooling included.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            View Docs
          </Button>
        </div>
      </div>
    </section>
  );
}; 