import { Button } from "@/components/ui/button";

/**
 * A minimal pricing section with clean layout and essential information.
 * Subtle background variation for sophisticated section separation.
 */
export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for individual developers",
      features: [
        "Complete source code",
        "Authentication system",
        "Basic components",
        "Documentation",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      description: "Ideal for teams and startups",
      features: [
        "Everything in Starter",
        "Payment integration",
        "Advanced components",
        "Priority support",
        "Deployment guides"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      description: "For large-scale applications",
      features: [
        "Everything in Professional",
        "Multi-tenant setup",
        "Custom integrations",
        "Dedicated support",
        "Training sessions"
      ]
    }
  ];

  return (
    <section className="w-full py-24 bg-muted/20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Simple pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`p-6 border rounded-lg ${plan.popular ? 'border-primary' : ''}`}
            >
              {plan.popular && (
                <div className="text-xs font-medium text-primary mb-4">
                  Most popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-2">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>
              
              <ul className="space-y-2 mb-8 text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 