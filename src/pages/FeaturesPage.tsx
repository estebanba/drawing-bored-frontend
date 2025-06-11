import { Helmet } from "react-helmet-async";

/**
 * A minimal features page with clean typography and simple layout.
 * Clean page layout without decorative distractions.
 */
export function FeaturesPage() {
  const features = [
    {
      title: "Authentication",
      description: "Complete user management system with secure login, registration, and password reset functionality."
    },
    {
      title: "Payment Processing",
      description: "Integrated Stripe payment system supporting subscriptions, one-time payments, and webhook handling."
    },
    {
      title: "Email Integration",
      description: "Transactional email system with Resend for user notifications and communications."
    },
    {
      title: "Modern Tech Stack",
      description: "Built with React, TypeScript, Vite, and Express for fast development and reliable performance."
    },
    {
      title: "UI Components",
      description: "Pre-built, accessible components using shadcn/ui and TailwindCSS for consistent design."
    },
    {
      title: "Database Ready",
      description: "Configured for both PostgreSQL and MongoDB with example schemas and queries."
    },
    {
      title: "API Structure",
      description: "Well-organized REST API with proper error handling, validation, and documentation."
    },
    {
      title: "Production Setup",
      description: "Optimized build process, deployment configurations, and environment management."
    }
  ];

  return (
    <div className="w-full py-24">
      <Helmet>
        <title>Features | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Features</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Everything you need to build and ship your application quickly and efficiently.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="space-y-3">
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 