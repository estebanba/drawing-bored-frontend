import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

/**
 * A minimal pricing page with clean layout and essential information.
 * Clean page layout focusing on content hierarchy and clarity.
 */
export function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for individual developers and side projects",
      features: [
        "Complete source code",
        "Authentication system",
        "Basic UI components",
        "Documentation",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      description: "Ideal for teams and growing startups",
      features: [
        "Everything in Starter",
        "Payment integration",
        "Advanced components",
        "Priority support",
        "Deployment guides",
        "Custom integrations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      description: "Built for large-scale applications and teams",
      features: [
        "Everything in Professional",
        "Multi-tenant architecture",
        "Advanced analytics",
        "Dedicated support",
        "Training sessions",
        "Custom development"
      ]
    }
  ];

  return (
    <div className="w-full py-24">
      <Helmet>
        <title>Pricing | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Pricing</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include lifetime updates and documentation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`p-8 border rounded-lg ${plan.popular ? 'border-primary' : ''}`}
            >
              {plan.popular && (
                <div className="text-sm font-medium text-primary mb-4">
                  Most popular
                </div>
              )}
              
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <div className="text-3xl font-bold mb-3">{plan.price}</div>
              <p className="text-muted-foreground mb-8">
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 