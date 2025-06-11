import { Helmet } from "react-helmet-async";

/**
 * A minimal privacy policy page with clean legal content layout.
 * Clean page layout for legal document accessibility and clarity.
 */
export function PrivacyPolicyPage() {
  return (
    <div className="w-full py-24">
      <Helmet>
        <title>Privacy Policy | Your App</title>
      </Helmet>
      
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-muted-foreground text-center mb-16">
          Last updated: June 2024
        </p>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              We value your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when 
              you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p><strong>Account Information:</strong> Username, email address, and encrypted password.</p>
              <p><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns.</p>
              <p><strong>Payment Information:</strong> Billing details processed securely through our payment provider.</p>
              <p><strong>Communication Data:</strong> Support messages and feedback you send us.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>• Provide and maintain our service</p>
              <p>• Process payments and manage subscriptions</p>
              <p>• Send important updates and security notifications</p>
              <p>• Provide customer support</p>
              <p>• Improve our product and user experience</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data, including 
              encryption, secure servers, and regular security audits. However, no method of 
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal information at any time. 
              You can also request a copy of your data or object to certain processing activities. 
              Contact us at privacy@example.com for any data-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use trusted third-party services for payments (Stripe) and email (Resend). 
              These services have their own privacy policies and security measures. We only 
              share the minimum necessary information with these providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by email or through our service. Your continued use of the 
              service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at privacy@example.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 