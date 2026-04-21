import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - CircleHub JnU",
  description: "Terms and conditions for using CircleHub services",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing and using CircleHub JnU, you agree to be bound by
              these Terms of Service. If you do not agree with any part of these
              terms, you may not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Eligibility
            </h2>
            <p className="text-muted-foreground mb-4">
              To use CircleHub, you must:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Be a current student or staff member of JnU</li>
              <li>Have a valid JnU email address</li>
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-muted-foreground mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Provide accurate information about lost, found, or shared items
              </li>
              <li>Not use the platform for fraudulent purposes</li>
              <li>Respect other users&apos; privacy and property</li>
              <li>Not post offensive, illegal, or inappropriate content</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>
                Report any security vulnerabilities or suspicious activity
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Lost & Found Services
            </h2>
            <p className="text-muted-foreground mb-4">
              When using our lost & found services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                You must provide accurate descriptions and photos of items
              </li>
              <li>
                Finders must make reasonable efforts to return items to their
                rightful owners
              </li>
              <li>Claims must be verified with proof of ownership</li>
              <li>CircleHub is not liable for disputes between users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Item Sharing
            </h2>
            <p className="text-muted-foreground mb-4">When sharing items:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You retain ownership of your items</li>
              <li>You are responsible for item condition and agreements</li>
              <li>Document item condition before and after sharing</li>
              <li>
                CircleHub is not responsible for damaged or lost shared items
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Prohibited Activities
            </h2>
            <p className="text-muted-foreground mb-4">You may not:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Use the platform for commercial purposes without permission
              </li>
              <li>Post false or misleading information</li>
              <li>Harass, threaten, or impersonate other users</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Use automated systems to scrape or collect data</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              All content on CircleHub, including logos, design, and text, is
              owned by CircleHub or its licensors. You retain ownership of
              content you post, but grant us a license to use it for platform
              operations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Disclaimers
            </h2>
            <p className="text-muted-foreground mb-4">
              CircleHub is provided &quot;as is&quot; without warranties. We do
              not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Guarantee the accuracy of user-posted information</li>
              <li>Verify the identity or claims of all users</li>
              <li>Take responsibility for disputes between users</li>
              <li>Guarantee uninterrupted or error-free service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              CircleHub and its operators are not liable for any damages arising
              from use of the platform, including loss of items, disputes, or
              data breaches beyond our reasonable control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Account Termination
            </h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate
              these terms or engage in harmful behavior. You may close your
              account at any time through your settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-muted-foreground">
              We may modify these terms at any time. Continued use of the
              platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              12. Contact Information
            </h2>
            <p className="text-muted-foreground">
              For questions about these terms, contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: legal@circlehub.jnu.edu
              <br />
              Address: JnU Campus, Dhaka, Bangladesh
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
