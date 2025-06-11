import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * A minimal FAQ section with essential questions and clean accordion.
 * Clean section maintaining visual rhythm and sophistication.
 */
export function FAQ() {
  const faqs = [
    {
      question: "What's included in the boilerplate?",
      answer: "Complete full-stack application with authentication, payments, email integration, and modern UI components. Everything you need to start building."
    },
    {
      question: "How quickly can I get started?",
      answer: "Most developers are up and running within 10 minutes. Clone the repository, follow the setup guide, and you'll have a working application."
    },
    {
      question: "Is this suitable for production?",
      answer: "Yes, the boilerplate follows production best practices including security, performance optimization, and proper deployment configurations."
    },
    {
      question: "Can I customize the code?",
      answer: "Absolutely. Once you purchase, the code is yours to modify and use for any number of projects."
    },
    {
      question: "Do you offer support?",
      answer: "Yes, all plans include support. Email support is available for all customers with priority response for Professional and Enterprise plans."
    },
    {
      question: "What technologies are used?",
      answer: "React, TypeScript, Vite, Express, TailwindCSS, shadcn/ui, Stripe, and Resend. Full tech stack details are in the documentation."
    }
  ];

  return (
    <section className="w-full py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Frequently asked questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 