import { Helmet } from "react-helmet-async";

/**
 * A minimal terms of service page with clean legal content layout.
 * Clean page layout for legal document readability and navigation.
 */
export function TermsOfServicePage() {
  return (
    <div className="w-full py-24">
      <Helmet>
        <title>Terms of Service | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
        <p className="text-muted-foreground text-center mb-16">
          Last updated: June 2024
        </p>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using our service, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>• You must be at least 18 years old to use this service</p>
              <p>• You are responsible for maintaining the security of your account</p>
              <p>• You may not use the service for any unlawful or prohibited purpose</p>
              <p>• You may not attempt to gain unauthorized access to any part of the service</p>
              <p>• You are responsible for all activity that occurs under your account</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">License and Restrictions</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upon purchase, you receive a license to use the boilerplate code for commercial 
              and personal projects. You may modify, distribute, and use the code without 
              attribution. However, you may not resell or redistribute the original boilerplate 
              as a competing product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment and Subscriptions</h2>
            <p className="text-muted-foreground leading-relaxed">
              All payments are processed securely through our payment provider. Fees are 
              non-refundable except as required by law or as specified in our refund policy. 
              We reserve the right to change pricing with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The service and its original content remain our intellectual property. The 
              boilerplate code you purchase becomes yours to use under the license terms. 
              You retain all rights to applications you build using the boilerplate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We provide the service "as is" without warranties of any kind. We are not liable 
              for any damages or losses resulting from your use of the service. Our liability 
              is limited to the amount you paid for the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your access to the service at any 
              time for violation of these terms. You may terminate your account at any time 
              by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. We will notify you of 
              any significant changes. Your continued use of the service after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at 
              legal@example.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 