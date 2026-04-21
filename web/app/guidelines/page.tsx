import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines - CircleHub JnU",
  description: "Guidelines for respectful and safe community interactions",
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Community Guidelines
        </h1>
        <p className="text-muted-foreground mb-8">
          Building a safe, respectful, and helpful community at JnU
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground">
              CircleHub is built on trust, respect, and community spirit. We
              expect all members to uphold these values in every interaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Be Honest and Transparent
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate descriptions and photos of items</li>
              <li>Be truthful about item conditions and circumstances</li>
              <li>Report found items promptly and honestly</li>
              <li>Don&apos;t make false claims of ownership</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Respect Others
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Treat all community members with courtesy and respect</li>
              <li>Respond to messages and inquiries in a timely manner</li>
              <li>Respect people&apos;s privacy and personal information</li>
              <li>Be understanding if someone makes an honest mistake</li>
              <li>No harassment, bullying, or discrimination of any kind</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Keep It Safe
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Meet in public, well-lit areas on campus</li>
              <li>Verify identity before exchanging items</li>
              <li>Don&apos;t share sensitive personal information publicly</li>
              <li>Report suspicious behavior or safety concerns immediately</li>
              <li>Follow campus security guidelines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Appropriate Content
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Post clear, relevant photos of items</li>
              <li>Use appropriate language in all communications</li>
              <li>No offensive, explicit, or inappropriate content</li>
              <li>Keep item descriptions factual and relevant</li>
              <li>Don&apos;t spam or post repetitive content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Fair Use
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the platform only for its intended purposes</li>
              <li>
                Don&apos;t use it for commercial activities without permission
              </li>
              <li>One account per person</li>
              <li>Don&apos;t create fake listings or accounts</li>
              <li>Respect system limits and guidelines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Item Sharing Etiquette
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Return shared items on time and in good condition</li>
              <li>Communicate clearly about terms and expectations</li>
              <li>Take care of borrowed items as if they were your own</li>
              <li>Document item condition before and after</li>
              <li>Be gracious if someone declines your request</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Lost & Found Best Practices
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Post lost items as soon as possible with detailed descriptions
              </li>
              <li>
                If you find an item, try to locate the owner through the
                platform
              </li>
              <li>Verify ownership before returning items</li>
              <li>Be patient - reuniting items takes time</li>
              <li>Update status when items are recovered</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Reporting Violations
            </h2>
            <p className="text-muted-foreground mb-4">
              If you encounter behavior that violates these guidelines:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Report it through the platform immediately</li>
              <li>Provide specific details and evidence if possible</li>
              <li>Don&apos;t engage in public confrontations</li>
              <li>Let our moderation team handle the issue</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Consequences
            </h2>
            <p className="text-muted-foreground mb-4">
              Violations may result in:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Warning and content removal</li>
              <li>Temporary account suspension</li>
              <li>Permanent account termination</li>
              <li>Reporting to university administration</li>
              <li>Legal action in severe cases</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Building Community
            </h2>
            <p className="text-muted-foreground">
              We&apos;re all part of the JnU community. By following these
              guidelines, you help create a platform where everyone can safely
              recover lost items, share resources, and connect with fellow
              students. Thank you for being a responsible member of CircleHub!
            </p>
          </section>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-muted-foreground">
              Questions about these guidelines? Contact us at{" "}
              <a
                href="mailto:community@circlehub.jnu.edu"
                className="text-blue-600 hover:underline"
              >
                community@circlehub.jnu.edu
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
