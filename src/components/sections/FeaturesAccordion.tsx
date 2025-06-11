/**
 * A minimal features section with clean typography and simple layout.
 * Subtle background variation for unobtrusive section separation.
 */
export function FeaturesAccordion() {
  const features = [
    {
      title: "Authentication",
      description: "Complete user management with secure login and registration."
    },
    {
      title: "Payments",
      description: "Stripe integration for subscriptions and one-time payments."
    },
    {
      title: "Email",
      description: "Transactional emails with Resend for user communications."
    },
    {
      title: "Modern Stack",
      description: "React, TypeScript, Vite, and Express for fast development."
    },
    {
      title: "UI Components",
      description: "Pre-built components with clean, accessible design."
    },
    {
      title: "Production Ready",
      description: "Optimized build process and deployment configurations."
    }
  ];

  return (
    <section className="w-full py-24 bg-muted/20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What's included
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 