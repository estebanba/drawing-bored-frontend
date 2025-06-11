import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * A minimal FAQ page with clean accordion layout.
 * Clean page layout focusing on information accessibility.
 */
export function FAQPage() {
  const faqs = [
    {
      question: "What's included in the boilerplate?",
      answer: "A complete full-stack application with authentication system, payment integration, email functionality, modern UI components, and comprehensive documentation. You get both frontend and backend code ready for production."
    },
    {
      question: "How quickly can I get started?",
      answer: "Most developers have the application running locally within 10-15 minutes. The setup process is straightforward with clear documentation and automated scripts to handle dependencies and configuration."
    },
    {
      question: "Is this suitable for production use?",
      answer: "Yes, the boilerplate is built with production best practices including security measures, performance optimization, proper error handling, and deployment configurations for popular hosting platforms."
    },
    {
      question: "Can I customize the code for my needs?",
      answer: "Absolutely. Once you purchase, the code is yours to modify, extend, and use for any number of projects. The codebase is well-structured and documented to make customization straightforward."
    },
    {
      question: "What kind of support do you provide?",
      answer: "All plans include email support with comprehensive documentation. Professional and Enterprise customers receive priority support with faster response times and additional resources."
    },
    {
      question: "Which technologies are used?",
      answer: "Frontend: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui. Backend: Node.js, Express, TypeScript. Integrations: Stripe for payments, Resend for email. Database examples for both PostgreSQL and MongoDB."
    },
    {
      question: "Do you provide updates?",
      answer: "Yes, all plans include lifetime updates. When we release new features, improvements, or security updates, you'll receive access to the updated codebase and migration guides when needed."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with the boilerplate for any reason, contact us within 30 days of purchase for a full refund."
    }
  ];

  return (
    <div className="w-full py-24">
      <Helmet>
        <title>FAQ | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground text-center mb-16">
          Common questions about the boilerplate, setup, and support.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
} 