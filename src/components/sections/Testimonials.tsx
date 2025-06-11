/**
 * A minimal testimonials section with clean quotes and simple attribution.
 * Clean section for visual rhythm and balance.
 */
export function Testimonials() {
  const testimonials = [
    {
      content: "This boilerplate saved me weeks of setup time. Clean code and great documentation.",
      author: "Sarah Chen",
      role: "Developer"
    },
    {
      content: "Finally, a boilerplate that doesn't feel bloated. Just the essentials, done well.",
      author: "Marcus Rodriguez",
      role: "Founder"
    },
    {
      content: "The code quality is excellent. Easy to understand and modify for our needs.",
      author: "Emily Johnson",
      role: "CTO"
    }
  ];

  return (
    <section className="w-full py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What developers say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-4">
              <blockquote className="text-muted-foreground">
                "{testimonial.content}"
              </blockquote>
              
              <div className="text-sm">
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 