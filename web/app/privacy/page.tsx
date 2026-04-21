import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CircleHub JnU",
  description: "Learn how we protect your privacy and handle your data",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>JnU student ID and university affiliation</li>
              <li>Item descriptions and photos you post</li>
              <li>Communication messages through our platform</li>
              <li>Usage data and interaction with our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our lost & found services</li>
              <li>Facilitate item sharing within the JnU community</li>
              <li>Send you notifications about your items and claims</li>
              <li>Improve our services and user experience</li>
              <li>Prevent fraud and maintain platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Information Sharing
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share your
              information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                With other users when necessary to facilitate lost & found
                services
              </li>
              <li>
                With JnU administration when required for verification purposes
              </li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, and safety</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Data Security
            </h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              Internet is 100% secure. We use industry-standard encryption and
              security practices to safeguard your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Your Rights
            </h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your
              experience, analyze usage patterns, and maintain your session. You
              can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground">
              Our services are intended for university students. We do not
              knowingly collect information from individuals under 18 years of
              age.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Changes to Privacy Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will
              notify you of significant changes via email or through our
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy, please contact us
              at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: privacy@circlehub.jnu.edu
              <br />
              Address: JnU Campus, Dhaka, Bangladesh
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
